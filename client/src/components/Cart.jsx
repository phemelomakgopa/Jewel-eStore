import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { formatPrice } from "../utils/format";
import "./Cart.css";

export const OrderTotals = ({ subtotal, discount, discountCode, shipping, tax, total }) => (
  <dl className="totals">
    <div>
      <dt>Subtotal</dt>
      <dd>{formatPrice(subtotal)}</dd>
    </div>
    {discount > 0 && (
      <div className="totals-discount">
        <dt>Discount ({discountCode})</dt>
        <dd>−{formatPrice(discount)}</dd>
      </div>
    )}
    <div>
      <dt>Delivery</dt>
      <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
    </div>
    <div>
      <dt>VAT (15%)</dt>
      <dd>{formatPrice(tax)}</dd>
    </div>
    <div className="totals-grand">
      <dt>Total</dt>
      <dd>{formatPrice(total)}</dd>
    </div>
  </dl>
);

export default function Cart() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    discountCode,
    discountType,
    discountQualifies,
    discountMinimum,
    applyDiscountCode,
    removeDiscountCode,
    discountError,
    getTotalItems,
  } = useCart();

  const [code, setCode] = useState("");

  const handleApplyDiscount = (e) => {
    e.preventDefault();
    if (applyDiscountCode(code)) setCode("");
  };

  const checkout = () => {
    if (currentUser) navigate("/checkout");
    else navigate("/signin", { state: { from: "/checkout" } });
  };

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p>Pieces you add will wait here until you're ready to check out.</p>
          <Link to="/products" className="btn btn-primary">
            Browse the shop
          </Link>
        </div>
      </div>
    );
  }

  const itemCount = getTotalItems();

  return (
    <div className="page cart-page">
      <h1 className="page-title">
        Your cart <span className="cart-count">({itemCount} {itemCount === 1 ? "item" : "items"})</span>
      </h1>

      <div className="cart-layout">
        <ul className="cart-items">
          {items.map((item) => (
            <li key={`${item.id}-${item.size || ""}`} className="cart-item">
              <Link to={`/product/${item.id}`} className="item-image">
                <img src={item.image} alt="" />
              </Link>

              <div className="item-details">
                <h2 className="item-name">
                  <Link to={`/product/${item.id}`}>{item.name}</Link>
                </h2>
                <p className="item-price">{formatPrice(item.price)} each</p>
                {item.size && <p className="item-size">Size: {item.size}</p>}

                <div className="item-controls">
                  <div className="quantity-controls" role="group" aria-label={`Quantity of ${item.name}`}>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span aria-live="polite">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button type="button" className="btn-link remove-btn" onClick={() => removeItem(item.id, item.size)}>
                    Remove
                  </button>
                </div>
                {item.quantity >= item.stock && <p className="stock-note">That's all we have in stock.</p>}
              </div>

              <div className="item-total">{formatPrice(item.price * item.quantity)}</div>
            </li>
          ))}
        </ul>

        <aside className="cart-summary" aria-labelledby="summary-heading">
          <h2 id="summary-heading">Order summary</h2>

          <div className="discount-section">
            {discountCode ? (
              <div className="discount-applied">
                <div>
                  <strong>{discountCode}</strong>
                  {discountQualifies ? (
                    <span>{discountType === "shipping" ? "Free delivery applied" : "Discount applied"}</span>
                  ) : (
                    <span className="discount-pending">
                      Add {formatPrice(discountMinimum - subtotal)} more to use this code
                    </span>
                  )}
                </div>
                <button type="button" className="btn-link" onClick={removeDiscountCode}>
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyDiscount} className="discount-form">
                <label htmlFor="discount-code" className="visually-hidden">
                  Discount code
                </label>
                <input
                  id="discount-code"
                  type="text"
                  placeholder="Discount code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  aria-invalid={!!discountError}
                  aria-describedby={discountError ? "discount-error" : undefined}
                  autoCapitalize="characters"
                />
                <button type="submit" className="btn btn-secondary">
                  Apply
                </button>
              </form>
            )}
            {discountError && (
              <p id="discount-error" className="field-error">
                {discountError}
              </p>
            )}
          </div>

          <OrderTotals
            subtotal={subtotal}
            discount={discount}
            discountCode={discountCode}
            shipping={shipping}
            tax={tax}
            total={total}
          />

          <button type="button" className="btn btn-primary checkout-btn" onClick={checkout}>
            {currentUser ? "Check out" : "Sign in to check out"}
          </button>
          <Link to="/products" className="continue-link">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
