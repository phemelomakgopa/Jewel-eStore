import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  const addToCart = (product, quantity = 1, options = {}) => {
    setItems((prev) => {
      const key = `${product.id}-${options.size || ""}`;
      const idx = prev.findIndex((i) => `${i.id}-${i.size || ""}` === key);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price) || 0,
          image: product.image || "",
          size: options.size,
          quantity,
        },
      ];
    });
  };

  const updateQuantity = (id, size, quantity) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id && (i.size || "") === (size || "") ? { ...i, quantity } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (id, size) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && (i.size || "") === (size || ""))));
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );
  const shipping = useMemo(() => (items.length ? 60 : 0), [items]);
  const tax = useMemo(() => subtotal * 0.15, [subtotal]);
  const total = useMemo(() => subtotal + shipping + tax, [subtotal, shipping, tax]);

  const value = {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shipping,
    tax,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
