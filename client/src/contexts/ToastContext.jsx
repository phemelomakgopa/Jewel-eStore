import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Toast.css";

const ToastContext = createContext();

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // notify("Added to cart", { action: { label: "View cart", to: "/cart" }, tone: "error" })
  const notify = useCallback(
    (message, { action, tone = "default", duration = 3500 } = {}) => {
      const id = ++nextId.current;
      setToasts((prev) => [...prev.slice(-2), { id, message, action, tone }]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.tone}`}>
            <span>{t.message}</span>
            {t.action && (
              <Link to={t.action.to} state={t.action.state} className="toast-action" onClick={() => dismiss(t.id)}>
                {t.action.label}
              </Link>
            )}
            <button type="button" className="toast-close" aria-label="Dismiss" onClick={() => dismiss(t.id)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
