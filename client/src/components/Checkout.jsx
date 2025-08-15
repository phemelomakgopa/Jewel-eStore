import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import ShippingAddressForm from "./ShippingAddressForm";
import StripePaymentForm from "./StripePaymentForm";
import "./Checkout.css";
import emailjs from "@emailjs/browser";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, shipping, tax, total, clearCart } = useCart();
  const { currentUser, userProfile, updateShippingAddress, createOrder } = useAuth();

  const [payment, setPayment] = useState({
    method: "card", // card, eft, instant_eft
    bankName: "",
    accountType: "cheque", // cheque, savings
  });

  const [savingOrder, setSavingOrder] = useState(false);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Load saved address if available
  useEffect(() => {
    if (userProfile?.shippingAddress?.fullName) {
      setAddress(userProfile.shippingAddress);
    }
  }, [userProfile]);

  const handleAddressSave = async (addressData) => {
    try {
      const savedAddress = await updateShippingAddress(addressData);
      setAddress(savedAddress);
      setActiveStep(2); // Move to payment step
    } catch (err) {
      setError(err.message || "Failed to save address");
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPayment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim()
      .substring(0, 19);
  };

  const formatExpiryDate = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d{1,2})/, "$1/$2")
      .substring(0, 5);
  };

  const handleSuccessfulPayment = async (paymentIntentId) => {
    if (!currentUser || !address) {
      setError("User or address not found. Cannot place order.");
      return;
    }

    setSavingOrder(true);
    setError("");

    try {
      const orderData = {
        items,
        shippingAddress: address,
        amounts: {
          subtotal,
          shipping,
          tax,
          total,
        },
        payment: {
          method: "card",
          stripePaymentId: paymentIntentId,
        },
      };

      const order = await createOrder(orderData);

      sendOrderConfirmationEmail({
        orderId: order.id,
        customer: {
          name: currentUser.displayName || "Valued Customer",
          email: currentUser.email,
        },
        ...order,
      });

      clearCart();
      setOrderId(order.id);
      setOrderPlaced(true);
      setActiveStep(3);
    } catch (err) {
      console.error("Order creation error:", err);
      setError(
        err.message ||
          "Failed to save order after payment. Please contact support."
      );
    } finally {
      setSavingOrder(false);
    }
  };

  // Placeholder for EFT/other payment methods
  const handlePlaceOrder = async () => {
    console.log("Placing order with method:", payment.method);
    // This would contain the logic for non-Stripe payment methods
    alert("This payment method is not yet implemented.");
  };

  const getCardBrand = (cardNumber) => {
    const num = cardNumber.replace(/\s+/g, "");
    if (/^4/.test(num)) return "visa";
    if (/^5[1-5]/.test(num)) return "mastercard";
    if (/^3[47]/.test(num)) return "amex";
    return "unknown";
  };

  const sendOrderConfirmationEmail = (orderDetails) => {
    const templateParams = {
      to_name: orderDetails.customer.name,
      to_email: orderDetails.customer.email,
      order_id: orderDetails.orderId,
      order_date: new Date(orderDetails.createdAt).toLocaleDateString(),
      total_amount: `R ${orderDetails.amounts.total.toFixed(2)}`,
      shipping_address: `${orderDetails.shippingAddress.street}, ${orderDetails.shippingAddress.suburb}, ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.province}, ${orderDetails.shippingAddress.postalCode}`,
      items: orderDetails.items
        .map(
          (item) =>
            `${item.name} (x${item.quantity}) - R ${item.price.toFixed(2)}`
        )
        .join("\n"),
    };

    // Replace with your actual EmailJS Service ID, Template ID, and Public Key
    const SERVICE_ID = "service_pq8uw3p";
    const TEMPLATE_ID = "template_tdfvjye";
    const PUBLIC_KEY = "tD9Eu4EUpfDHjUo6X";

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY).then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
        alert(
          `A confirmation email has been sent to ${orderDetails.customer.email}.`
        );
      },
      (err) => {
        console.error("FAILED...", err);
        alert(
          "Failed to send confirmation email. Please check your order history."
        );
      }
    );
  };

  if (!currentUser) {
    return (
      <div className="checkout-container">
        <div className="auth-required">
          <h2>Sign In Required</h2>
          <p>Please sign in to proceed to checkout.</p>
          <button
            onClick={() => navigate("/login", { state: { from: "/checkout" } })}
            className="btn btn-primary"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="checkout-container">
        <div className="order-success">
          <div className="success-icon">✓</div>
          <h2>Order Placed Successfully!</h2>
          <p>
            Your order ID is: <strong>{orderId}</strong>
          </p>
          <p>We've sent a confirmation email to {currentUser.email}</p>
          <div className="order-actions">
            <button onClick={() => navigate("/")} className="btn btn-secondary">
              Continue Shopping
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="btn btn-primary"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="checkout-container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart before checking out.</p>
          <button
            onClick={() => navigate("/products")}
            className="btn btn-primary"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-steps">
        <div className={`step ${activeStep >= 1 ? "active" : ""}`}>
          <div className="step-number">1</div>
          <div className="step-label">Shipping</div>
        </div>
        <div
          className={`step-connector ${activeStep >= 2 ? "active" : ""}`}
        ></div>
        <div className={`step ${activeStep >= 2 ? "active" : ""}`}>
          <div className="step-number">2</div>
          <div className="step-label">Payment</div>
        </div>
        <div
          className={`step-connector ${activeStep >= 3 ? "active" : ""}`}
        ></div>
        <div className={`step ${activeStep >= 3 ? "active" : ""}`}>
          <div className="step-number">3</div>
          <div className="step-label">Confirmation</div>
        </div>
      </div>

      <div className="checkout-content">
        <div className="checkout-left">
          {activeStep === 1 && (
            <div className="shipping-section">
              <h2>Shipping Address</h2>
              <ShippingAddressForm
                initialData={address}
                onSave={handleAddressSave}
              />
              {error && <div className="error-message">{error}</div>}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/cart")}
                >
                  Back to Cart
                </button>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="payment-section">
              <h2>Payment Method</h2>
              <div className="payment-methods">
                {/* Payment Method Selection */}
                <div className="payment-options">
                  <div className="payment-option">
                    <input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      value="card"
                      checked={payment.method === "card"}
                      onChange={(e) =>
                        setPayment((p) => ({ ...p, method: e.target.value }))
                      }
                    />
                    <label htmlFor="card" className="payment-label">
                      <div className="payment-icon">💳</div>
                      <div className="payment-info">
                        <h4>Credit/Debit Card</h4>
                        <p>Visa, Mastercard, American Express</p>
                      </div>
                    </label>
                  </div>

                  <div className="payment-option">
                    <input
                      type="radio"
                      id="instant_eft"
                      name="paymentMethod"
                      value="instant_eft"
                      checked={payment.method === "instant_eft"}
                      onChange={(e) =>
                        setPayment((p) => ({ ...p, method: e.target.value }))
                      }
                    />
                    <label htmlFor="instant_eft" className="payment-label">
                      <div className="payment-icon">⚡</div>
                      <div className="payment-info">
                        <h4>Instant EFT</h4>
                        <p>Ozow, PayU, SiD Secure EFT</p>
                      </div>
                    </label>
                  </div>

                  <div className="payment-option">
                    <input
                      type="radio"
                      id="eft"
                      name="paymentMethod"
                      value="eft"
                      checked={payment.method === "eft"}
                      onChange={(e) =>
                        setPayment((p) => ({ ...p, method: e.target.value }))
                      }
                    />
                    <label htmlFor="eft" className="payment-label">
                      <div className="payment-icon">🏦</div>
                      <div className="payment-info">
                        <h4>Bank Transfer (EFT)</h4>
                        <p>Direct bank transfer</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Card Payment Form */}
                {payment.method === "card" && (
                  <StripePaymentForm
                    amount={Math.round(total * 100) / 100}
                    onSuccessfulPayment={handleSuccessfulPayment}
                  />
                )}

                {/* Instant EFT Form */}
                {payment.method === "instant_eft" && (
                  <div className="instant-eft-form">
                    <div className="form-group">
                      <label>Select Your Bank</label>
                      <select
                        name="bankName"
                        value={payment.bankName}
                        onChange={handlePaymentChange}
                        required
                      >
                        <option value="">Choose your bank</option>
                        <option value="absa">ABSA Bank</option>
                        <option value="fnb">First National Bank (FNB)</option>
                        <option value="standard">Standard Bank</option>
                        <option value="nedbank">Nedbank</option>
                        <option value="capitec">Capitec Bank</option>
                        <option value="investec">Investec</option>
                        <option value="discovery">Discovery Bank</option>
                        <option value="african_bank">African Bank</option>
                        <option value="bidvest">Bidvest Bank</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="payment-info-box">
                      <p>✓ Secure instant payment</p>
                      <p>✓ No card details required</p>
                      <p>✓ Direct from your bank account</p>
                    </div>
                  </div>
                )}

                {/* EFT Form */}
                {payment.method === "eft" && (
                  <div className="eft-form">
                    <div className="form-group">
                      <label>Account Type</label>
                      <select
                        name="accountType"
                        value={payment.accountType}
                        onChange={handlePaymentChange}
                        required
                      >
                        <option value="cheque">Cheque Account</option>
                        <option value="savings">Savings Account</option>
                      </select>
                    </div>
                    <div className="eft-instructions">
                      <h4>Bank Transfer Details:</h4>
                      <div className="bank-details">
                        <p>
                          <strong>Bank:</strong> First National Bank
                        </p>
                        <p>
                          <strong>Account Name:</strong> Jewel eStore
                        </p>
                        <p>
                          <strong>Account Number:</strong> 1234567890
                        </p>
                        <p>
                          <strong>Branch Code:</strong> 250655
                        </p>
                        <p>
                          <strong>Reference:</strong> Your Order Number
                        </p>
                      </div>
                      <div className="eft-note">
                        <p>
                          ⚠️ Please use your order number as the payment
                          reference
                        </p>
                        <p>
                          📧 Email proof of payment to orders@jewelestore.co.za
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="billing-address">
                  <h3>Billing Address</h3>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={true} onChange={() => {}} />
                    Same as shipping address
                  </label>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setActiveStep(1)}
                  >
                    Back
                  </button>
                  {payment.method !== "card" && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handlePlaceOrder}
                      disabled={savingOrder}
                    >
                      {savingOrder ? "Placing Order..." : "Place Order"}
                    </button>
                  )}
                </div>
              </div>
              {error && <div className="error-message">{error}</div>}
            </div>
          )}

          {activeStep === 3 && orderPlaced && (
            <div className="order-confirmation">
              <div className="success-icon">
                <div className="checkmark">✓</div>
              </div>
              <h2>Order Placed Successfully!</h2>
              <div className="order-details">
                <p>
                  <strong>Order ID:</strong> {orderId}
                </p>
                <p>
                  <strong>Email:</strong> Confirmation sent to{" "}
                  {address?.email || currentUser?.email}
                </p>
                <p>
                  <strong>Total:</strong> R{(total / 100).toFixed(2)}
                </p>
              </div>

              <div className="next-steps">
                <h3>What's Next?</h3>
                <ul>
                  <li>📧 Check your email for order confirmation</li>
                  <li>📦 We'll send tracking info when your order ships</li>
                  <li>🚚 Estimated delivery: 3-5 business days</li>
                </ul>
              </div>

              <div className="order-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/orders")}
                >
                  View My Orders
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/")}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="checkout-right">
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="order-items">
              {items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                    <span className="quantity">{item.quantity}</span>
                  </div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>R{(item.price / 100).toFixed(2)}</p>
                  </div>
                  <div className="item-total">
                    R{((item.price * item.quantity) / 100).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="subtotal">
                <span>Subtotal</span>
                <span>R{(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="shipping">
                <span>Shipping</span>
                <span>R{(shipping / 100).toFixed(2)}</span>
              </div>
              <div className="tax">
                <span>Tax</span>
                <span>R{(tax / 100).toFixed(2)}</span>
              </div>
              <div className="total">
                <span>Total</span>
                <span>R{(total / 100).toFixed(2)}</span>
              </div>
            </div>

            <div className="secure-checkout">
              <i className="fas fa-lock"></i> Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
