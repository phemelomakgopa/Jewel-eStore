import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './OrderHistory.css';

export default function OrderHistory() {
  const { currentUser, getUserOrders } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userOrders = await getUserOrders(currentUser.uid);
        setOrders(userOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser, getUserOrders]);

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return 'Date not available';
    return new Date(timestamp.toDate()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!currentUser) {
    return (
      <div className="auth-required">
        <h2>Sign In Required</h2>
        <p>Please sign in to view your order history.</p>
        <Link to="/login" className="btn btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <h2>No Orders Found</h2>
        <p>You haven't placed any orders yet.</p>
        <Link to="/products" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <h1>Your Orders</h1>
      
      <div className="orders-list">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className={`order-card ${activeOrder === order.id ? 'expanded' : ''}`}
          >
            <div 
              className="order-summary"
              onClick={() => setActiveOrder(activeOrder === order.id ? null : order.id)}
            >
              <div className="order-header">
                <div>
                  <h3>Order #{order.id.substring(0, 8)}</h3>
                  <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${order.status || 'processing'}`}>
                    {order.status || 'Processing'}
                  </span>
                </div>
              </div>
              
              <div className="order-preview">
                <div className="order-items-preview">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="preview-item">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="preview-image"
                      />
                      {index === 2 && order.items.length > 3 && (
                        <div className="more-items">+{order.items.length - 3} more</div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="order-total">
                  <span>Total: </span>
                  <strong>${order.amounts?.total?.toFixed(2) || '0.00'}</strong>
                </div>
                
                <div className="toggle-details">
                  {activeOrder === order.id ? 'Hide details' : 'View details'}
                </div>
              </div>
            </div>
            
            {activeOrder === order.id && (
              <div className="order-details">
                <div className="shipping-address">
                  <h4>Shipping Address</h4>
                  {order.shippingAddress ? (
                    <address>
                      {order.shippingAddress.fullName && <p>{order.shippingAddress.fullName}</p>}
                      {order.shippingAddress.address1 && <p>{order.shippingAddress.address1}</p>}
                      {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                      <p>
                        {order.shippingAddress.city && `${order.shippingAddress.city}, `}
                        {order.shippingAddress.state && `${order.shippingAddress.state} `}
                        {order.shippingAddress.postalCode && `${order.shippingAddress.postalCode}`}
                      </p>
                      {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
                      {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
                    </address>
                  ) : (
                    <p>No shipping address provided</p>
                  )}
                </div>
                
                <div className="order-items-details">
                  <h4>Order Items</h4>
                  <div className="items-list">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-image">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="item-details">
                          <h5>{item.name}</h5>
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: ${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="item-total">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="order-summary-details">
                  <h4>Order Summary</h4>
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${order.amounts?.subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>${order.amounts?.shipping?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>${order.amounts?.tax?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${order.amounts?.total?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                
                <div className="order-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => window.print()}
                  >
                    Print Invoice
                  </button>
                  <Link 
                    to={`/track-order/${order.id}`} 
                    className="btn btn-outline"
                  >
                    Track Order
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
