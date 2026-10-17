import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut, updateProfile } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { adminEmail } from "../config/adminList";
import Loader from "../components/Loader";

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const EMPTY_ADDRESS = {
  fullName: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  province: "",
  postalCode: "",
  country: "South Africa",
};

// Older records used `streetAddress` / `state`; read them so saved addresses
// aren't lost.
export const normalizeAddress = (address = {}) => ({
  fullName: (address.fullName || address.name || "").trim(),
  email: (address.email || "").trim(),
  phone: (address.phone || "").trim(),
  street: (address.street || address.streetAddress || "").trim(),
  city: (address.city || "").trim(),
  province: (address.province || address.state || "").trim(),
  postalCode: (address.postalCode || "").trim(),
  country: (address.country || "South Africa").trim(),
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (!user) {
        setUserProfile(null);
        setLoading(false);
        return;
      }
      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
          updateDoc(userRef, { lastLogin: serverTimestamp() }).catch(() => {});
        } else {
          // The only place a user document is created, so signing in again
          // can never wipe an existing address or order list.
          const newUser = {
            uid: user.uid,
            email: user.email || "",
            // Omitted when empty so a name saved by sign-up isn't overwritten.
            ...(user.displayName ? { name: user.displayName } : {}),
            photo: user.photoURL || "",
            provider: user.providerData?.[0]?.providerId || "password",
            role: "user",
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            shippingAddress: { ...EMPTY_ADDRESS, email: user.email || "" },
            orders: [],
          };
          await setDoc(userRef, newUser, { merge: true });
          setUserProfile((prev) => ({ ...newUser, ...(prev?.name ? { name: prev.name } : {}) }));
        }
      } catch (e) {
        console.error("Could not load user profile:", e);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  const updateDisplayName = useCallback(async (name) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, { displayName: name });
    await setDoc(doc(db, "users", auth.currentUser.uid), { name }, { merge: true });
    setUserProfile((prev) => ({ ...(prev || {}), name }));
  }, []);

  const updateShippingAddress = useCallback(
    async (addressData) => {
      if (!currentUser) throw new Error("Sign in to save an address.");
      const shippingAddress = normalizeAddress(addressData);
      await setDoc(
        doc(db, "users", currentUser.uid),
        { shippingAddress, updatedAt: serverTimestamp() },
        { merge: true }
      );
      setUserProfile((prev) => ({ ...(prev || {}), shippingAddress }));
      return shippingAddress;
    },
    [currentUser]
  );

  const getShippingAddress = useCallback(() => {
    const saved = userProfile?.shippingAddress;
    return saved ? normalizeAddress({ email: currentUser?.email, ...saved }) : null;
  }, [userProfile, currentUser]);

  // Amounts are integer cents; `unit` lets order history tell new orders
  // apart from older ones that stored rands.
  const createOrder = useCallback(
    async ({ items, shippingAddress, amounts, payment, status = "placed" }) => {
      if (!currentUser) throw new Error("Sign in to place an order.");
      if (!items?.length) throw new Error("Your cart is empty.");
      if (!shippingAddress?.fullName) throw new Error("Add a shipping address first.");

      const orderRef = doc(collection(db, "orders"));
      const order = {
        id: orderRef.id,
        userId: currentUser.uid,
        unit: "cents",
        currency: "ZAR",
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          size: i.size || null,
        })),
        shippingAddress: normalizeAddress(shippingAddress),
        amounts: {
          subtotal: amounts.subtotal,
          discount: amounts.discount || 0,
          shipping: amounts.shipping,
          tax: amounts.tax,
          total: amounts.total,
        },
        discountCode: amounts.discountCode || null,
        status,
        payment,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(orderRef, order);
      updateDoc(doc(db, "users", currentUser.uid), {
        orders: arrayUnion(orderRef.id),
        updatedAt: serverTimestamp(),
      }).catch((e) => console.warn("Could not link order to user profile:", e));

      return { ...order, createdAt: new Date() };
    },
    [currentUser]
  );

  // Sorted client-side so Firestore doesn't need a composite index.
  const getUserOrders = useCallback(async () => {
    if (!currentUser) return [];
    const snap = await getDocs(query(collection(db, "orders"), where("userId", "==", currentUser.uid)));
    const time = (o) => (o.createdAt?.toMillis ? o.createdAt.toMillis() : 0);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => time(b) - time(a));
  }, [currentUser]);

  const isAdmin =
    !!currentUser && (adminEmail.includes(currentUser.email) || userProfile?.role === "admin");

  const value = {
    currentUser,
    userProfile,
    loading,
    isAdmin,
    logout,
    updateDisplayName,
    updateShippingAddress,
    getShippingAddress,
    createOrder,
    getUserOrders,
  };

  return <AuthContext.Provider value={value}>{loading ? <Loader /> : children}</AuthContext.Provider>;
};
