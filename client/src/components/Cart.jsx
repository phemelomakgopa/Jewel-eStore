import React from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import Flat_Pearls_Bracelet from "../assets/Flat_Pearls_Bracelet.jpg";
import GearDiamond_Gold_Ring from "../assets/GearDiamond+Gold_Ring.jpg";

export default function Cart() {
  const navigate = useNavigate();

  // Example placeholder cart items (will connect to backend later)
  const cartItems = [
    {
      id: 1,
      name: "Pearl Bracelet",
      price: 299.0,
      quantity: 1,
      image: Flat_Pearls_Bracelet
    },
    {
      id: 2,
      name: "Diamong & Gold Ring",
      price: 499.0,
      quantity: 2,
      image: GearDiamond_Gold_Ring

    },
  ];

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>R{item.price.toFixed(2)}</p>
                  <div className="qty-control">
                    <button>-</button>
                    <span>{item.quantity}</span>
                    <button>+</button>
                  </div>
                  <button className="remove-btn">Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <p>Subtotal: <strong>R{subtotal.toFixed(2)}</strong></p>
            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
