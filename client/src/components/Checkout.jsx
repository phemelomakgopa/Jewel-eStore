import React from "react";
import "./Checkout.css";

export default function Checkout() {
  const cartItems = [
    {
      id: 1,
      name: "Gold Ring",
      price: 299.0,
      quantity: 1,
      image: "../public/images/Gold+Diamond_Ring.jpg",

    },
    {
      id: 2,
      name: "Pearl Necklace",
      price: 499.0,
      quantity: 2,
      image: "../public/images/Gold_Necklaces.jpg",
    },
  ];

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="checkout-page">
      {/* Left side - Shipping & Payment */}
      <div className="checkout-left">
        <h2>Shipping Details</h2>
        <form className="shipping-form">
          <input type="text" placeholder="Full Name" required />
          <input type="text" placeholder="Street Address" required />
          <input type="text" placeholder="City" required />
          <input type="text" placeholder="State/Province" required />
          <input type="text" placeholder="Postal Code" required />
          <input type="text" placeholder="Country" required />
        </form>

        <h2>Payment</h2>
        <form className="payment-form">
          <input type="text" placeholder="Card Number" required />
          <input type="text" placeholder="MM/YY" required />
          <input type="text" placeholder="CVV" required />
        </form>

        <button className="place-order-btn">Place Order</button>
      </div>

      {/* Right side - Order Summary */}
      <div className="checkout-right">
        <h2>Order Summary</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="summary-item">
            <img src={item.image} alt={item.name} />
            <div>
              <h4>{item.name}</h4>
              <p>Qty: {item.quantity}</p>
              <p>R{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
        <hr />
        <p>Subtotal: <strong>R{subtotal.toFixed(2)}</strong></p>
      </div>
    </div>
  );
}
