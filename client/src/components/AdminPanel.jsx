import React, { useState } from "react";
import styles from "./AdminPanel.module.css";
import { Link } from "react-router-dom";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getApp } from "firebase/app";

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

  // Add Firestore reference
  const db = getFirestore(getApp());

  // Add product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const desc = e.target.desc.value;
    const price = e.target.price.value;
    const images = e.target.images.files;

    // For simplicity, use the first image's name as the image string
    // In production, upload the image and get its URL
    let image = "";
    if (images.length > 0) {
      image = images[0].name;
    }

    const productData = {
      name,
      description: desc,
      image,
      price,
    };

    try {
      await addDoc(collection(db, "products"), productData);
      setProducts((prev) => [
        ...prev,
        { id: Date.now(), ...productData, imageCount: images.length },
      ]);
      e.target.reset();
      alert("Product added to Firestore!");
    } catch (error) {
      alert("Error adding product: " + error.message);
    }
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
        <div className={styles.adminContainer}>
          {!loggedIn ? (
            <div className={styles.adminLoginScreen}>
              <h1 className={styles.adminLoginTitle}>Admin Login</h1>
              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.adminInput}
              />
              <button className={styles.adminLoginButton} onClick={handleLogin}>
                Login
              </button>
            </div>
          ) : (
            <div className={styles.adminContent}>
              <h1 className={styles.adminDashboardTitle}>Admin Dashboard</h1>
              <div className={styles.adminTabButtons}>
                <button
                  className={`${styles.adminTabBtn} ${
                    activeTab === "products" ? styles.adminTabBtnActive : ""
                  }`}
                  onClick={() => setActiveTab("products")}
                >
                  🛍 Products
                </button>
                <button
                  className={`${styles.adminTabBtn} ${
                    activeTab === "orders" ? styles.adminTabBtnActive : ""
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  📦 Orders
                </button>
              </div>
    
              {/* Products Tab */}
              {activeTab === "products" && (
                <div className={`${styles.adminTabContent} ${styles.adminTabContentActive}`}>
                  <h2>Manage Products</h2>
                  <form onSubmit={handleAddProduct} className={styles.adminForm}>
                    <input
                      name="name"
                      type="text"
                      placeholder="Product Name"
                      required
                      className={styles.adminInput}
                    />
                    <input
                      name="desc"
                      type="text"
                      placeholder="Description"
                      required
                      className={styles.adminInput}
                    />
                    <input
                      name="price"
                      type="number"
                      placeholder="Price (R)"
                      required
                      className={styles.adminInput}
                    />
                    <input name="images" type="file" multiple className={styles.adminFileInput} />
                    <button type="submit" className={styles.adminSubmitButton}>Add Product</button>
                  </form>
                  <ul className={styles.adminList}>
                    {products.map((p) => (
                      <li key={p.id} className={styles.adminListItem}>
                        <strong>{p.name}</strong> <br />
                        <small>{p.desc}</small> <br />
                        <small>{p.price}</small> <br />
                        <em>{p.imageCount} image(s) uploaded</em> <br />
                        <button 
                          onClick={() => handleDeleteProduct(p.id)}
                          className={styles.adminDeleteButton}
                        >
                          🗑 Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
    
              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className={`${styles.adminTabContent} ${styles.adminTabContentActive}`}>
                  <h2>Customer Orders</h2>
                  <select
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                    className={styles.adminSelect}
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                  <ul className={styles.adminList}>
                    {filteredOrders.map((order) => (
                      <li key={order.id} className={styles.adminListItem}>
                        <strong>Order #{order.id}</strong> from {order.customer} <br />
                        Status: {order.status} <br />
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={styles.adminSelect}
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
    