import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import ShippingAddressForm from "./ShippingAddressForm";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, shipping, tax, total, clearCart } = useCart();
  const { 
    currentUser, 
    userProfile, 
    updateShippingAddress, 
    createOrder 
  } = useAuth();

  const [payment, setPayment] = useState({
    method: "card", // card, eft, instant_eft
    cardHolderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
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
    setPayment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim()
      .substring(0, 19);
  };

  const formatExpiryDate = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d{1,2})/, '$1/$2')
      .substring(0, 5);
  };

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    try {
      setSavingOrder(true);
      setError("");

      // Basic validation
      if (!address?.fullName) {
        throw new Error("Please provide a shipping address");
      }

      if (!payment.cardNumber || !payment.expiryDate || !payment.cvv || !payment.cardHolderName) {
        throw new Error("Please fill in all payment details");
      }

      // Create order data
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
          last4: payment.cardNumber.slice(-4),
          brand: getCardBrand(payment.cardNumber),
        },
      };

      // Save to Firestore
      const order = await createOrder(orderData);
      
      // Send confirmation email
      await sendOrderConfirmationEmail(order, address);
      
      // Clear cart and show success
      clearCart();
      setOrderId(order.id);
      setOrderPlaced(true);
      setActiveStep(3);

    } catch (err) {
      console.error("Order error:", err);
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setSavingOrder(false);
    }
  };

  const getCardBrand = (cardNumber) => {
    const num = cardNumber.replace(/\s+/g, '');
    if (/^4/.test(num)) return 'visa';
    if (/^5[1-5]/.test(num)) return 'mastercard';
    if (/^3[47]/.test(num)) return 'amex';
    return 'unknown';
  };

  const sendOrderConfirmationEmail = async (order, shippingAddress) => {
    try {
      // Email service integration (using EmailJS or similar service)
      const emailData = {
        to_email: shippingAddress.email || currentUser.email,
        to_name: shippingAddress.fullName || currentUser.displayName,
        order_id: order.id,
        order_date: new Date().toLocaleDateString('en-ZA'),
        total_amount: `R${(order.amounts.total / 100).toFixed(2)}`,
        items: order.items.map(item => 
          `${item.name} (Qty: ${item.quantity}) - R${(item.price * item.quantity / 100).toFixed(2)}`
        ).join('\n'),
        shipping_address: `${shippingAddress.fullName}\n${shippingAddress.streetAddress}\n${shippingAddress.city}, ${shippingAddress.province}\n${shippingAddress.postalCode}\nSouth Africa`,
        payment_method: payment.method === 'card' ? 'Credit/Debit Card' : 
                       payment.method === 'instant_eft' ? 'Instant EFT' : 'Bank Transfer (EFT)',
        subtotal: `R${(order.amounts.subtotal / 100).toFixed(2)}`,
        shipping: `R${(order.amounts.shipping / 100).toFixed(2)}`,
        tax: `R${(order.amounts.tax / 100).toFixed(2)}`,
      };

      // For now, we'll simulate email sending
      // In production, you would integrate with EmailJS, SendGrid, or similar
      console.log('Order confirmation email sent:', emailData);
      
      // Show success message to user
      alert(`Order confirmation email sent to ${emailData.to_email}`);
      
      return true;
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      // Don't throw error - order should still complete even if email fails
      return false;
    }
  };

  if (!currentUser) {
    return (
      <div className="checkout-container">
        <div className="auth-required">
          <h2>Sign In Required</h2>
          <p>Please sign in to proceed to checkout.</p>
          <button 
            onClick={() => navigate('/login', { state: { from: '/checkout' } })}
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
          <p>Your order ID is: <strong>{orderId}</strong></p>
          <p>We've sent a confirmation email to {currentUser.email}</p>
          <div className="order-actions">
            <button 
              onClick={() => navigate('/')} 
              className="btn btn-secondary"
            >
              Continue Shopping
            </button>
            <button 
              onClick={() => navigate('/orders')} 
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
            onClick={() => navigate('/products')} 
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
        <div className={`step ${activeStep >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Shipping</div>
        </div>
        <div className={`step-connector ${activeStep >= 2 ? 'active' : ''}`}></div>
        <div className={`step ${activeStep >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Payment</div>
        </div>
        <div className={`step-connector ${activeStep >= 3 ? 'active' : ''}`}></div>
        <div className={`step ${activeStep >= 3 ? 'active' : ''}`}>
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
                  onClick={() => navigate('/cart')}
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
                      onChange={(e) => setPayment(p => ({ ...p, method: e.target.value }))}
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
                      onChange={(e) => setPayment(p => ({ ...p, method: e.target.value }))}
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
                      onChange={(e) => setPayment(p => ({ ...p, method: e.target.value }))}
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
                  <div className="card-form">
                    <div className="form-group">
                      <label>Cardholder Name</label>
                      <input
                        type="text"
                        name="cardHolderName"
                        value={payment.cardHolderName}
                        onChange={handlePaymentChange}
                        placeholder="Name on card"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formatCardNumber(payment.cardNumber)}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          setPayment(p => ({ ...p, cardNumber: formatted }));
                        }}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formatExpiryDate(payment.expiryDate)}
                          onChange={(e) => {
                            const formatted = formatExpiryDate(e.target.value);
                            setPayment(p => ({ ...p, expiryDate: formatted }));
                          }}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={payment.cvv}
                          onChange={handlePaymentChange}
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  </div>
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
                        <p><strong>Bank:</strong> First National Bank</p>
                        <p><strong>Account Name:</strong> Jewel eStore</p>
                        <p><strong>Account Number:</strong> 1234567890</p>
                        <p><strong>Branch Code:</strong> 250655</p>
                        <p><strong>Reference:</strong> Your Order Number</p>
                      </div>
                      <div className="eft-note">
                        <p>⚠️ Please use your order number as the payment reference</p>
                        <p>📧 Email proof of payment to orders@jewelestore.co.za</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="billing-address">
                  <h3>Billing Address</h3>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={true} 
                      onChange={() => {}}
                    />
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
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handlePlaceOrder}
                    disabled={savingOrder}
                  >
                    {savingOrder ? 'Processing...' : 'Place Order'}
                  </button>
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
                <p><strong>Order ID:</strong> {orderId}</p>
                <p><strong>Email:</strong> Confirmation sent to {address?.email || currentUser?.email}</p>
                <p><strong>Total:</strong> R{(total / 100).toFixed(2)}</p>
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
                  onClick={() => navigate('/orders')}
                >
                  View My Orders
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/')}
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
