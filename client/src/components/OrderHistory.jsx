import React, { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getProductById } from "../data/products";
import { formatDate, formatPrice, orderAmountToCents } from "../utils/format";
import "./OrderHistory.css";

const STATUS = {
  placed: { label: "Placed", tone: "info" },
  paid: { label: "Paid, preparing", tone: "info" },
  awaiting_payment: { label: "Awaiting payment", tone: "warn" },
  processing: { label: "Preparing", tone: "info" },
  shipped: { label: "Shipped", tone: "info" },
  delivered: { label: "Delivered", tone: "ok" },
  completed: { label: "Completed", tone: "ok" },
  cancelled: { label: "Cancelled", tone: "bad" },
};

const statusOf = (s) => STATUS[s] || { label: s || "Placed", tone: "info" };

export default function OrderHistory() {
  const { currentUser, getUserOrders } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setOrders(await getUserOrders());
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("We couldn't load your orders. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [getUserOrders]);

  useEffect(() => {
    if (currentUser) load();
  }, [currentUser, load]);

  if (!currentUser) return <Navigate to="/signin" state={{ from: "/orders" }} replace />;

  if (loading) {
    return (
      <div className="page">
        <h1 className="page-title">Your orders</h1>
        <div className="orders-loading" role="status">
          <span className="spinner" aria-hidden="true"></span> Loading your orders…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>Orders unavailable</h2>
          <p>{error}</p>
          <button type="button" onClick={load} className="btn btn-primary">
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>No orders yet</h2>
          <p>When you place an order it will appear here with its status.</p>
          <Link to="/products" className="btn btn-primary">
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Your orders</h1>

      <ul className="orders-list">
        {orders.map((order) => {
          const open = openId === order.id;
          const status = statusOf(order.status);
          const cents = (amount) => orderAmountToCents(order, amount);
          const addr = order.shippingAddress || {};

          return (
            <li key={order.id} className={`order-card ${open ? "expanded" : ""}`}>
              <button
                type="button"
                className="order-summary"
                onClick={() => setOpenId(open ? null : order.id)}
                aria-expanded={open}
                aria-controls={`order-${order.id}`}
              >
                <span className="order-head">
                  <span className="order-number">Order {order.id.slice(0, 8).toUpperCase()}</span>
                  <span className="order-date">{formatDate(order.createdAt) || "Date unavailable"}</span>
                </span>

                <span className="order-thumbs" aria-hidden="true">
                  {order.items.slice(0, 3).map((item, i) => {
                    const src = getProductById(item.id)?.image || item.image;
                    return src ? <img key={i} src={src} alt="" /> : null;
                  })}
                  {order.items.length > 3 && <span className="more-items">+{order.items.length - 3}</span>}
                </span>

                <span className={`status-badge status-${status.tone}`}>{status.label}</span>
                <span className="order-total">{formatPrice(cents(order.amounts?.total))}</span>
                <span className="toggle-details">{open ? "Hide details" : "Details"}</span>
              </button>

              {open && (
                <div className="order-details" id={`order-${order.id}`}>
                  <div className="detail-block">
                    <h2>Items</h2>
                    <ul className="detail-items">
                      {order.items.map((item, i) => (
                        <li key={i}>
                          {getProductById(item.id) ? (
                            <Link to={`/product/${item.id}`}>{item.name}</Link>
                          ) : (
                            <span>{item.name}</span>
                          )}
                          <span className="muted">× {item.quantity}</span>
                          <span>{formatPrice(cents(item.price) * item.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="detail-block">
                    <h2>Delivery</h2>
                    <address>
                      {addr.fullName || addr.name}
                      <br />
                      {[addr.street || addr.streetAddress, addr.city, addr.province || addr.state, addr.postalCode]
                        .filter(Boolean)
                        .join(", ")}
                      {addr.phone && (
                        <>
                          <br />
                          {addr.phone}
                        </>
                      )}
                    </address>
                  </div>

                  <div className="detail-block">
                    <h2>Payment</h2>
                    <dl className="detail-totals">
                      <div>
                        <dt>Subtotal</dt>
                        <dd>{formatPrice(cents(order.amounts?.subtotal))}</dd>
                      </div>
                      {order.amounts?.discount > 0 && (
                        <div>
                          <dt>Discount{order.discountCode ? ` (${order.discountCode})` : ""}</dt>
                          <dd>−{formatPrice(cents(order.amounts.discount))}</dd>
                        </div>
                      )}
                      <div>
                        <dt>Delivery</dt>
                        <dd>{order.amounts?.shipping ? formatPrice(cents(order.amounts.shipping)) : "Free"}</dd>
                      </div>
                      <div>
                        <dt>VAT</dt>
                        <dd>{formatPrice(cents(order.amounts?.tax))}</dd>
                      </div>
                      <div className="grand">
                        <dt>Total</dt>
                        <dd>{formatPrice(cents(order.amounts?.total))}</dd>
                      </div>
                    </dl>
                    {order.status === "awaiting_payment" && (
                      <p className="eft-reminder">
                        Pay by EFT using reference <strong>{order.id}</strong>. Bank details are in your confirmation
                        email.
                      </p>
                    )}
                  </div>

                  <div className="order-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
                      Print receipt
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
