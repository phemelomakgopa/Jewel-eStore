import React, { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { collection, getDocs, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import catalogue, { getCategoryLabel } from "../data/products";
import { formatDate, formatPrice, orderAmountToCents } from "../utils/format";
import styles from "./AdminPanel.module.css";

const ORDER_STATUSES = ["placed", "awaiting_payment", "paid", "processing", "shipped", "delivered", "cancelled"];
const statusLabel = (s) => (s || "placed").replace("_", " ").replace(/^\w/, (c) => c.toUpperCase());

export const AdminGate = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  if (isAdmin) return children;
  return (
    <div className="page">
      <div className="empty-state">
        <h2>Admins only</h2>
        <p>
          {currentUser
            ? `${currentUser.email} doesn't have admin access. Ask an owner to add it in config/adminList.js.`
            : "Sign in with an admin account to manage the store."}
        </p>
        {currentUser ? (
          <Link to="/" className="btn btn-primary">
            Back to the shop
          </Link>
        ) : (
          <Link to="/signin" state={{ from: "/adminpanel" }} className="btn btn-primary">
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
};

function OrdersTab() {
  const { notify } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const snap = await getDocs(collection(db, "orders"));
      const time = (o) => (o.createdAt?.toMillis ? o.createdAt.toMillis() : 0);
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => time(b) - time(a)));
    } catch (err) {
      console.error(err);
      setError(
        err.code === "permission-denied"
          ? "Firestore rules don't allow this account to read all orders. Allow admins to read the orders collection."
          : "Couldn't load orders. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (order, status) => {
    const previous = order.status;
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
    try {
      await updateDoc(doc(db, "orders", order.id), { status, updatedAt: serverTimestamp() });
      notify(`Order ${order.id.slice(0, 8).toUpperCase()} marked ${statusLabel(status).toLowerCase()}.`);
    } catch (err) {
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: previous } : o)));
      notify("Couldn't update that order. Check Firestore rules for admin writes.", { tone: "error" });
    }
  };

  if (loading) return <p role="status">Loading orders…</p>;
  if (error)
    return (
      <div>
        <p className="form-alert">{error}</p>
        <button type="button" className="btn btn-secondary" onClick={load}>
          Try again
        </button>
      </div>
    );

  const shown = filter === "all" ? orders : orders.filter((o) => (o.status || "placed") === filter);

  return (
    <>
      <div className={styles.toolbar}>
        <label>
          Show{" "}
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className={styles.select}>
            <option value="all">All orders ({orders.length})</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="btn btn-secondary" onClick={load}>
          Refresh
        </button>
      </div>

      {shown.length === 0 ? (
        <p className={styles.muted}>No orders with this status.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Order</th>
                <th scope="col">Date</th>
                <th scope="col">Customer</th>
                <th scope="col">Items</th>
                <th scope="col">Total</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((o) => (
                <tr key={o.id}>
                  <td className={styles.mono}>{o.id.slice(0, 8).toUpperCase()}</td>
                  <td>{formatDate(o.createdAt, { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td>
                    {o.shippingAddress?.fullName || "—"}
                    <span className={styles.sub}>{o.shippingAddress?.email}</span>
                  </td>
                  <td>{o.items?.reduce((n, i) => n + i.quantity, 0)}</td>
                  <td>{formatPrice(orderAmountToCents(o, o.amounts?.total))}</td>
                  <td>
                    <select
                      value={o.status || "placed"}
                      onChange={(e) => changeStatus(o, e.target.value)}
                      className={styles.select}
                      aria-label={`Status of order ${o.id.slice(0, 8)}`}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {statusLabel(s)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function ProductsTab() {
  return (
    <>
      <p className={styles.muted}>
        The catalogue lives in <code>client/src/data/products.js</code>. Edit that file to add, price or restock pieces;
        every page reads from it.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Piece</th>
              <th scope="col">Category</th>
              <th scope="col">Price</th>
              <th scope="col">Stock</th>
            </tr>
          </thead>
          <tbody>
            {catalogue.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link to={`/product/${p.id}`} className={styles.productCell}>
                    <img src={p.image} alt="" />
                    {p.name}
                  </Link>
                </td>
                <td>{getCategoryLabel(p.category)}</td>
                <td>{formatPrice(p.price)}</td>
                <td className={p.stock <= 5 ? styles.low : undefined}>{p.stock <= 5 ? `${p.stock} (low)` : p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function AdminPanel() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "products" ? "products" : "orders";

  return (
    <AdminGate>
      <div className="page">
        <div className={styles.header}>
          <h1 className="page-title">Manage the store</h1>
          <Link to="/admin" className="btn-link">
            Dashboard
          </Link>
        </div>

        <div className={styles.tabs} role="tablist">
          {[
            ["orders", "Orders"],
            ["products", "Products"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              className={`${styles.tab} ${tab === key ? styles.tabActive : ""}`}
              onClick={() => setParams(key === "orders" ? {} : { tab: key })}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.panel} role="tabpanel">
          {tab === "orders" ? <OrdersTab /> : <ProductsTab />}
        </div>
      </div>
    </AdminGate>
  );
}
