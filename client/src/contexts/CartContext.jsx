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

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const discount = useMemo(() => {
    if (!appliedDiscount) return { amount: 0, type: 'none' };
    
    let amount = 0;
    const code = appliedDiscount.code.toUpperCase();
    const discountInfo = DISCOUNT_CODES[code];
    
    if (!discountInfo) return { amount: 0, type: 'none' };
    
    if (subtotal < discountInfo.minPurchase) {
      return { 
        amount: 0, 
        type: 'none',
        error: `Minimum purchase of $${discountInfo.minPurchase} required for this code`
      };
    }
    
    if (discountInfo.type === 'percentage') {
      amount = subtotal * (discountInfo.value / 100);
    } else if (discountInfo.type === 'fixed') {
      amount = Math.min(discountInfo.value, subtotal);
    } else if (discountInfo.type === 'shipping') {
      return { amount: 0, type: 'shipping', shippingDiscount: true };
    }
    
    return { amount, type: discountInfo.type };
  }, [appliedDiscount, subtotal]);

  const shipping = useMemo(() => {
    const baseShipping = subtotal > 0 ? 60 : 0; // $60 flat rate shipping
    if (appliedDiscount && DISCOUNT_CODES[appliedDiscount.code]?.type === 'shipping') {
      return 0; // Free shipping
    }
    return baseShipping;
  }, [subtotal, appliedDiscount]);

  const tax = useMemo(() => {
    const taxableAmount = Math.max(0, subtotal - (discount.type === 'percentage' || discount.type === 'fixed' ? discount.amount : 0));
    return taxableAmount * 0.15; // 15% tax
  }, [subtotal, discount]);

  const total = useMemo(() => {
    const discountedSubtotal = subtotal - (discount.type === 'percentage' || discount.type === 'fixed' ? discount.amount : 0);
    return Math.max(0, discountedSubtotal + shipping + tax);
  }, [subtotal, discount, shipping, tax]);

  const value = {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    removeItem: removeFromCart, // Alias for removeFromCart
    clearCart,
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
