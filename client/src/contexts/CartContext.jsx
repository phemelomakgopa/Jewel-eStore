import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();

// Sample discount codes (in a real app, these would come from your database)
const DISCOUNT_CODES = {
  "WELCOME10": { type: 'percentage', value: 10, minPurchase: 0 },
  "FREESHIP": { type: 'shipping', value: 0, minPurchase: 50 },
  "SAVE20": { type: 'percentage', value: 20, minPurchase: 100 },
};

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
  
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);

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

  const applyDiscountCode = (code) => {
    const upperCode = code.trim().toUpperCase();
    
    if (!upperCode) {
      setDiscountError('Please enter a discount code');
      return false;
    }
    
    if (!DISCOUNT_CODES[upperCode]) {
      setDiscountError('Invalid discount code');
      return false;
    }
    
    const discountInfo = DISCOUNT_CODES[upperCode];
    
    if (subtotal < discountInfo.minPurchase) {
      setDiscountError(`Minimum purchase of $${discountInfo.minPurchase} required`);
      return false;
    }
    
    setAppliedDiscount({
      code: upperCode,
      type: discountInfo.type,
      value: discountInfo.value
    });
    
    setDiscountError('');
    return true;
  };
  
  const removeDiscountCode = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    setDiscountError('');
  };

    const subtotal = useMemo(() => {
    const amountInCents = items.reduce((sum, i) => sum + Math.round(i.price * 100) * i.quantity, 0);
    return amountInCents / 100;
  }, [items]);

  const discount = useMemo(() => {
    if (!appliedDiscount) return { amount: 0, type: 'none' };

    const subtotalInCents = Math.round(subtotal * 100);
    const discountInfo = DISCOUNT_CODES[appliedDiscount.code.toUpperCase()];

    if (!discountInfo || subtotal < discountInfo.minPurchase) {
      return { amount: 0, type: 'none' };
    }

    if (discountInfo.type === 'shipping') {
      return { amount: 0, type: 'shipping', shippingDiscount: true };
    }

    let amountInCents = 0;
    if (discountInfo.type === 'percentage') {
      amountInCents = Math.round(subtotalInCents * (discountInfo.value / 100));
    } else if (discountInfo.type === 'fixed') {
      amountInCents = Math.min(Math.round(discountInfo.value * 100), subtotalInCents);
    }

    return { amount: amountInCents / 100, type: discountInfo.type };
  }, [appliedDiscount, subtotal]);

  const shipping = useMemo(() => {
    if (subtotal === 0) return 0;
    if (appliedDiscount && DISCOUNT_CODES[appliedDiscount.code]?.type === 'shipping') {
      return 0; // Free shipping
    }
    return 60.00; // R60 flat rate shipping
  }, [subtotal, appliedDiscount]);

  const tax = useMemo(() => {
    const subtotalInCents = Math.round(subtotal * 100);
    const discountInCents = Math.round(discount.amount * 100);
    const taxableAmountInCents = Math.max(0, subtotalInCents - discountInCents);
    const taxInCents = Math.round(taxableAmountInCents * 0.15);
    return taxInCents / 100;
  }, [subtotal, discount]);

  const total = useMemo(() => {
    const subtotalInCents = Math.round(subtotal * 100);
    const discountInCents = Math.round(discount.amount * 100);
    const shippingInCents = Math.round(shipping * 100);
    const taxInCents = Math.round(tax * 100);
    
    const totalInCents = Math.max(0, subtotalInCents - discountInCents + shippingInCents + taxInCents);
    return totalInCents / 100;
  }, [subtotal, discount, shipping, tax]);

  // Calculate total number of items in the cart
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    removeItem: removeFromCart, // Alias for removeFromCart
    clearCart,
    getTotalItems,
    subtotal,
    shipping,
    tax,
    total,
    discount,
    discountCode,
    setDiscountCode,
    applyDiscountCode,
    removeDiscountCode,
    discountError,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
