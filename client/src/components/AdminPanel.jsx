import React, { useState } from "react";
import styles from "./AdminPanel.module.css";
import { Link } from 'react-router-dom';
export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([
    { id: 1, status: "pending", customer: "Alice" },
    { id: 2, status: "shipped", customer: "Bob" },
    { id: 3, status: "completed", customer: "Charlie" },
  ]);
  const [orderFilter, setOrderFilter] = useState("all");

  // Login
  const handleLogin = () => {
    if (password === "admin123") {
      setLoggedIn(true);
    } else {
      alert("Incorrect password!");
    }
  };

  // Add product
  const handleAddProduct = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const desc = e.target.desc.value;
    const price = e.target.price.value;
    const images = e.target.images.files;

    setProducts((prev) => [
      ...prev,
      { id: Date.now(), name, desc, price, imageCount: images.length },
    ]);
    e.target.reset();
  };

  // Delete product
  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Update order status
  const updateOrderStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  // Filtered orders
  const filteredOrders =
    orderFilter === "all"
      ? orders
      : orders.filter((order) => order.status === orderFilter);

  return (
    <div className={styles.container}>
      {!loggedIn ? (
        <div className={styles.screen}>
          <h1>Admin Login</h1>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="loginButton" onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
          <div className={styles.tabButtons}>
            <button
              className={`${styles.tabBtn} ${
                activeTab === "products" ? styles.tabBtnActive : ""
              }`}
              onClick={() => setActiveTab("products")}
            >
              🛍 Products
            </button>
            <button
              className={`${styles.tabBtn} ${
                activeTab === "orders" ? styles.tabBtnActive : ""
              }`}
              onClick={() => setActiveTab("orders")}
            >
              📦 Orders
            </button>
          </div>

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className={`${styles.tabContent} ${styles.tabContentActive}`}>
              <h2>Manage Products</h2>
              <form onSubmit={handleAddProduct}>
                <input name="name" type="text" placeholder="Product Name" required />
                <input name="desc" type="text" placeholder="Description" required />
                <input name="price" type="number" placeholder="Price (R)" required />
                <input name="images" type="file" multiple />
                <button type="submit">Add Product</button>
              </form>
              <ul>
                {products.map((p) => (
                  <li key={p.id}>
                    <strong>{p.name}</strong> <br />
                    <small>{p.desc}</small> <br />
                    <small>{p.price}</small> <br />
                    <em>{p.imageCount} image(s) uploaded</em> <br />
                    <button onClick={() => handleDeleteProduct(p.id)}>🗑 Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className={`${styles.tabContent} ${styles.tabContentActive}`}>
              <h2>Customer Orders</h2>
              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
              <ul>
                {filteredOrders.map((order) => (
                  <li key={order.id}>
                    <strong>Order #{order.id}</strong> from {order.customer} <br />
                    Status: {order.status} <br />
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
