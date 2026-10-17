import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { formatPrice } from "../utils/format";
import ShippingAddressForm from "./ShippingAddressForm";
import StripePaymentForm from "./StripePaymentForm";
import { OrderTotals } from "./Cart";
import "./Checkout.css";

const EMAILJS = {
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID || "service_pq8uw3p",
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "template_tdfvjye",
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "tD9Eu4EUpfDHjUo6X",
};

const BANK = {
  bank: "First National Bank",
  accountName: "Jewel eStore",
  accountNumber: "1234567890",
  branchCode: "250655",
};

const STEPS = ["Delivery", "Payment", "Confirmation"];

const isComplete = (a) => a && a.fullName && a.email && a.phone && a.street && a.city && a.province && a.postalCode;

const formatAddress = (a) => [a.street, a.city, a.province, a.postalCode].filter(Boolean).join(", ");

// Fire-and-forget: a failed email must never block or undo an order.
const sendConfirmationEmail = (order) => {
  const params = {
    to_name: order.shippingAddress.fullName,
    to_email: order.shippingAddress.email,
    order_id: order.id,
    order_date: new Date().toLocaleDateString("en-ZA"),
    total_amount: formatPrice(order.amounts.total),
    shipping_address: formatAddress(order.shippingAddress),
    items: order.items.map((i) => `${i.name} (x${i.quantity}) - ${formatPrice(i.price * i.quantity)}`).join("\n"),
  };
  return emailjs
    .send(EMAILJS.serviceId, EMAILJS.templateId, params, EMAILJS.publicKey)
    .then(() => true)
    .catch((err) => {
      console.warn("Order confirmation email failed:", err);
      return false;
    });
};

const Stepper = ({ step }) => (
  <ol className="checkout-steps">
    {STEPS.map((label, i) => (
      <li key={label} className={`step ${step > i + 1 ? "done" : ""} ${step === i + 1 ? "current" : ""}`} aria-current={step === i + 1 ? "step" : undefined}>
        <span className="step-number">{step > i + 1 ? "✓" : i + 1}</span>
        <span className="step-label">{label}</span>
      </li>
    ))}
  </ol>
);

export default function Checkout() {
  const cart = useCart();
  const { currentUser, getShippingAddress, updateShippingAddress, createOrder } = useAuth();

  const saved = getShippingAddress();
  const [address, setAddress] = useState(() => (isComplete(saved) ? saved : null));
  const [editingAddress, setEditingAddress] = useState(() => !isComplete(saved));
  const [savingAddress, setSavingAddress] = useState(false);
  const [method, setMethod] = useState("card");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);
  const [emailSent, setEmailSent] = useState(null);

  if (!currentUser) return <Navigate to="/signin" state={{ from: "/checkout" }} replace />;

  if (placedOrder) return <Confirmation order={placedOrder} emailSent={emailSent} />;

  if (!cart.items.length) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p>Add a piece or two before checking out.</p>
          <Link to="/products" className="btn btn-primary">
            Browse the shop
          </Link>
        </div>
      </div>
    );
  }

  const step = editingAddress ? 1 : 2;

  const handleAddressSave = async (data) => {
    setSavingAddress(true);
    setError("");
    try {
      setAddress(await updateShippingAddress(data));
    } catch (err) {
      // Still let them continue; the address just won't be remembered.
      console.warn("Couldn't save address to profile:", err);
      setAddress(data);
    } finally {
      setSavingAddress(false);
      setEditingAddress(false);
    }
  };

  const placeOrder = async (payment, status) => {
    setPlacing(true);
    setError("");
    try {
      const order = await createOrder({
        items: cart.items,
        shippingAddress: address,
        amounts: {
          subtotal: cart.subtotal,
          discount: cart.discount,
          discountCode: cart.discountQualifies ? cart.discountCode : null,
          shipping: cart.shipping,
          tax: cart.tax,
          total: cart.total,
        },
        payment,
        status,
      });
      setPlacedOrder(order);
      cart.clearCart();
      sendConfirmationEmail(order).then(setEmailSent);
    } catch (err) {
      console.error("Order creation failed:", err);
      setError(
        payment.method === "card"
          ? `Your payment went through (reference ${payment.reference}) but we couldn't save the order. Contact us with that reference and we'll sort it out.`
          : "We couldn't place your order. Check your connection and try again."
      );
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="page checkout-page">
      <h1 className="page-title">Checkout</h1>
      <Stepper step={step} />

      <div className="checkout-layout">
        <div className="checkout-main">
          <section className="checkout-panel" aria-labelledby="delivery-heading">
            <div className="panel-heading">
              <h2 id="delivery-heading">Delivery address</h2>
              {!editingAddress && (
                <button type="button" className="btn-link" onClick={() => setEditingAddress(true)}>
                  Change
                </button>
              )}
            </div>

            {editingAddress ? (
              <ShippingAddressForm
                initialAddress={address || saved || { email: currentUser.email, fullName: currentUser.displayName }}
                onSave={handleAddressSave}
                isLoading={savingAddress}
              />
            ) : (
              <address className="address-summary">
                <strong>{address.fullName}</strong>
                <span>{formatAddress(address)}</span>
                <span>{address.phone}</span>
                <span>{address.email}</span>
              </address>
            )}
          </section>

          <section className={`checkout-panel ${step < 2 ? "is-locked" : ""}`} aria-labelledby="payment-heading">
            <div className="panel-heading">
              <h2 id="payment-heading">Payment</h2>
            </div>

            {step < 2 ? (
              <p className="locked-note">Add a delivery address to continue.</p>
            ) : (
              <>
                <fieldset className="payment-options">
                  <legend className="visually-hidden">Payment method</legend>
                  <label className={`payment-option ${method === "card" ? "selected" : ""}`}>
                    <input type="radio" name="method" value="card" checked={method === "card"} onChange={() => setMethod("card")} />
                    <span>
                      <strong>Card</strong>
                      <small>Visa, Mastercard or American Express</small>
                    </span>
                  </label>
                  <label className={`payment-option ${method === "eft" ? "selected" : ""}`}>
                    <input type="radio" name="method" value="eft" checked={method === "eft"} onChange={() => setMethod("eft")} />
                    <span>
                      <strong>Bank transfer (EFT)</strong>
                      <small>We ship once your payment clears, usually 1–2 working days</small>
                    </span>
                  </label>
                </fieldset>

                {error && (
                  <p className="form-alert" role="alert">
                    {error}
                  </p>
                )}

                {method === "card" ? (
                  <StripePaymentForm
                    amount={cart.total}
                    disabled={placing}
                    onSuccessfulPayment={(payment) => placeOrder(payment, "paid")}
                  />
                ) : (
                  <div className="eft-panel">
                    <p>
                      Place your order and we'll show our bank details with your order number to use as the payment
                      reference. We'll also email them to you.
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary pay-button"
                      disabled={placing}
                      onClick={() => placeOrder({ method: "eft" }, "awaiting_payment")}
                    >
                      {placing ? "Placing order…" : `Place order for ${formatPrice(cart.total)}`}
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        <aside className="checkout-summary" aria-labelledby="summary-heading">
          <div className="panel-heading">
            <h2 id="summary-heading">Order summary</h2>
            <Link to="/cart" className="btn-link">
              Edit cart
            </Link>
          </div>
          <ul className="summary-items">
            {cart.items.map((item) => (
              <li key={`${item.id}-${item.size || ""}`}>
                <span className="summary-thumb">
                  <img src={item.image} alt="" />
                  <span className="summary-qty" aria-label={`Quantity ${item.quantity}`}>
                    {item.quantity}
                  </span>
                </span>
                <span className="summary-name">{item.name}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <OrderTotals
            subtotal={cart.subtotal}
            discount={cart.discount}
            discountCode={cart.discountCode}
            shipping={cart.shipping}
            tax={cart.tax}
            total={cart.total}
          />
        </aside>
      </div>
    </div>
  );
}

function Confirmation({ order, emailSent }) {
  const awaitingPayment = order.status === "awaiting_payment";

  return (
    <div className="page checkout-page">
      <Stepper step={3} />
      <div className="confirmation">
        <div className="success-icon" aria-hidden="true">
          ✓
        </div>
        <h1 className="page-title">{awaitingPayment ? "Order placed — payment needed" : "Thank you, your order is placed"}</h1>
        <p className="order-ref">
          Order number <strong>{order.id}</strong>
        </p>

        {awaitingPayment && (
          <div className="bank-details">
            <h2>Pay by bank transfer</h2>
            <dl>
              <div>
                <dt>Bank</dt>
                <dd>{BANK.bank}</dd>
              </div>
              <div>
                <dt>Account name</dt>
                <dd>{BANK.accountName}</dd>
              </div>
              <div>
                <dt>Account number</dt>
                <dd>{BANK.accountNumber}</dd>
              </div>
              <div>
                <dt>Branch code</dt>
                <dd>{BANK.branchCode}</dd>
              </div>
              <div>
                <dt>Amount</dt>
                <dd>{formatPrice(order.amounts.total)}</dd>
              </div>
              <div>
                <dt>Reference</dt>
                <dd>
                  <strong>{order.id}</strong>
                </dd>
              </div>
            </dl>
            <p>Email your proof of payment to orders@jewelestore.co.za. We'll ship as soon as it clears.</p>
          </div>
        )}

        <ul className="confirmation-items">
          {order.items.map((item) => (
            <li key={`${item.id}-${item.size || ""}`}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
          <li className="confirmation-total">
            <span>Total</span>
            <span>{formatPrice(order.amounts.total)}</span>
          </li>
        </ul>

        <p className="confirmation-note">
          {emailSent === false
            ? "We couldn't send your confirmation email, but your order is saved and visible in your orders."
            : `A confirmation is on its way to ${order.shippingAddress.email}.`}{" "}
          Delivery to {order.shippingAddress.city} usually takes 3–5 working days{awaitingPayment ? " after payment" : ""}.
        </p>

        <div className="order-actions">
          <Link to="/orders" className="btn btn-primary">
            View your orders
          </Link>
          <Link to="/products" className="btn btn-secondary">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
