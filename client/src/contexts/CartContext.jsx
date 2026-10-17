import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProductById } from "../data/products";
import { formatPrice } from "../utils/format";
import { useToast } from "./ToastContext";

const CartContext = createContext();

// All amounts are in cents.
export const SHIPPING_FLAT = 6000;
export const VAT_RATE = 0.15;

// Sample discount codes (in a real app, these would be validated server-side)
const DISCOUNT_CODES = {
  WELCOME10: { type: "percentage", value: 10, minPurchase: 0 },
  FREESHIP: { type: "shipping", value: 0, minPurchase: 5000 },
  SAVE20: { type: "percentage", value: 20, minPurchase: 10000 },
};

const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

// Price, name, image and stock always come from the catalogue, never from
// whatever was saved in the browser — saved carts can be stale.
const hydrateItem = ({ id, quantity, size }) => {
  const product = getProductById(id);
  if (!product || product.stock <= 0) return null;
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    stock: product.stock,
    size: size || null,
    quantity: Math.min(Math.max(1, Number(quantity) || 1), product.stock),
  };
};

const sameLine = (item, id, size) => item.id === id && (item.size || null) === (size || null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider = ({ children }) => {
  const { notify } = useToast();
  const [items, setItems] = useState(() => readStorage("cart", []).map(hydrateItem).filter(Boolean));
  const [discountCode, setDiscountCode] = useState(() => readStorage("cartDiscount", null));
  const [discountError, setDiscountError] = useState("");

  useEffect(() => {
    writeStorage(
      "cart",
      items.map(({ id, quantity, size }) => ({ id, quantity, size }))
    );
  }, [items]);

  useEffect(() => {
    writeStorage("cartDiscount", discountCode);
  }, [discountCode]);

  const addToCart = useCallback(
    (productOrId, quantity = 1, options = {}) => {
      const id = typeof productOrId === "object" ? productOrId.id : productOrId;
      const product = getProductById(id);
      if (!product) return false;

      const existing = items.find((i) => sameLine(i, product.id, options.size));
      const current = existing?.quantity || 0;
      const allowed = Math.min(quantity, product.stock - current);

      if (allowed <= 0) {
        notify(`You already have all ${product.stock} of the ${product.name} in your cart.`);
        return false;
      }

      setItems((prev) => {
        if (prev.some((i) => sameLine(i, product.id, options.size))) {
          return prev.map((i) =>
            sameLine(i, product.id, options.size) ? { ...i, quantity: i.quantity + allowed } : i
          );
        }
        return [...prev, hydrateItem({ id: product.id, quantity: allowed, size: options.size })];
      });

      notify(
        allowed < quantity
          ? `Only ${allowed} more ${product.name} available — added to your cart.`
          : `${product.name} added to your cart.`,
        { action: { label: "View cart", to: "/cart" } }
      );
      return true;
    },
    [items, notify]
  );

  const updateQuantity = useCallback((id, size, quantity) => {
    setItems((prev) =>
      prev
        .map((i) => (sameLine(i, id, size) ? { ...i, quantity: Math.min(quantity, i.stock) } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((id, size) => {
    setItems((prev) => prev.filter((i) => !sameLine(i, id, size)));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setDiscountCode(null);
  }, []);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

  // A code that stops qualifying (e.g. items removed) is kept but not applied,
  // and the cart explains why.
  const discountInfo = discountCode ? DISCOUNT_CODES[discountCode] : null;
  const discountQualifies = !!discountInfo && subtotal >= discountInfo.minPurchase;

  const discount = useMemo(() => {
    if (!discountQualifies) return 0;
    if (discountInfo.type === "percentage") return Math.round(subtotal * (discountInfo.value / 100));
    return 0;
  }, [discountQualifies, discountInfo, subtotal]);

  const shipping = useMemo(() => {
    if (subtotal === 0) return 0;
    if (discountQualifies && discountInfo.type === "shipping") return 0;
    return SHIPPING_FLAT;
  }, [subtotal, discountQualifies, discountInfo]);

  const tax = useMemo(() => Math.round(Math.max(0, subtotal - discount) * VAT_RATE), [subtotal, discount]);
  const total = Math.max(0, subtotal - discount + shipping + tax);

  const applyDiscountCode = (code) => {
    const upper = code.trim().toUpperCase();
    if (!upper) {
      setDiscountError("Enter a discount code.");
      return false;
    }
    const info = DISCOUNT_CODES[upper];
    if (!info) {
      setDiscountError(`"${upper}" isn't a valid code.`);
      return false;
    }
    if (subtotal < info.minPurchase) {
      setDiscountError(`${upper} needs a subtotal of at least ${formatPrice(info.minPurchase)}.`);
      return false;
    }
    setDiscountCode(upper);
    setDiscountError("");
    return true;
  };

  const removeDiscountCode = () => {
    setDiscountCode(null);
    setDiscountError("");
  };

  const getTotalItems = () => items.reduce((sum, i) => sum + i.quantity, 0);

  const value = {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    removeItem: removeFromCart,
    clearCart,
    getTotalItems,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    discountCode,
    discountType: discountInfo?.type || null,
    discountQualifies,
    discountMinimum: discountInfo?.minPurchase || 0,
    applyDiscountCode,
    removeDiscountCode,
    discountError,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
