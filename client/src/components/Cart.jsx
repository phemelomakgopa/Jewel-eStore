import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import "./Cart.css";
import Flat_Pearls_Bracelet from "../assets/Flat_Pearls_Bracelet.jpg";
import GearDiamond_Gold_Ring from "../assets/GearDiamond+Gold_Ring.jpg";

export default function Cart() {
  const navigate = useNavigate();
  const {
    items: cartItems,
    removeItem,
    updateQuantity,
    subtotal,
    shipping,
    tax,
    total,
    discount,
    discountCode,
    setDiscountCode,
    applyDiscountCode,
    removeDiscountCode,
    discountError,
  } = useCart();
  
  const [localDiscountCode, setLocalDiscountCode] = useState(discountCode || '');
  
  const handleApplyDiscount = (e) => {
    e.preventDefault();
    applyDiscountCode(localDiscountCode);
  };
  
  const handleRemoveDiscount = () => {
    removeDiscountCode();
    setLocalDiscountCode('');
  };

  // Format currency in South African Rand
  const formatCurrency = (amount) => {
    return `R${(amount / 100).toFixed(2)}`;
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size || ''}`} className="cart-item">
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">R{(item.price / 100).toFixed(2)}</p>
                  {item.size && <p className="item-size">Size: {item.size}</p>}
                  
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => {
                        if (item.quantity > 1) {
                          updateQuantity(item.id, item.size, item.quantity - 1);
                        } else {
                          removeItem(item.id, item.size);
                        }
                      }}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    className="remove-btn"
                    onClick={() => removeItem(item.id, item.size)}
                  >
                    Remove
                  </button>
                </div>
                <div className="item-total">
                  R{((item.price * item.quantity) / 100).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            
            {/* Discount Code */}
            <div className="discount-section">
              {discountCode && discount.amount > 0 ? (
                <div className="discount-applied">
                  <span>Discount Applied: {discountCode}</span>
                  {discount.shippingDiscount ? (
                    <span className="discount-amount">Free Shipping</span>
                  ) : (
                    <span className="discount-amount">-R{(discount.amount / 100).toFixed(2)}</span>
                  )}
                  <button 
                    type="button" 
                    className="remove-discount"
                    onClick={handleRemoveDiscount}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyDiscount} className="discount-form">
                  <input
                    type="text"
                    placeholder="Discount Code"
                    value={localDiscountCode}
                    onChange={(e) => setLocalDiscountCode(e.target.value)}
                  />
                  <button type="submit" className="apply-discount">
                    Apply
                  </button>
                </form>
              )}
              {discountError && (
                <div className="error-message">{discountError}</div>
              )}
            </div>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            
            {discount.shippingDiscount && shipping === 0 ? (
              <div className="summary-row discount">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            ) : (
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping > 0 ? formatCurrency(shipping) : "Free"}</span>
              </div>
            )}
            
            <div className="summary-row">
              <span>Tax (15%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            
            {discount.amount > 0 && (
              <div className="summary-row discount">
                <span>Discount ({discountCode})</span>
                <span>-{formatCurrency(discount.amount)}</span>
              </div>
            )}
            
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            
            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
