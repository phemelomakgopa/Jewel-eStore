import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "../config/firebaseConfig";

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setCurrentUser(user);
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
            await updateDoc(userRef, { lastLogin: serverTimestamp() });
          } else {
            const newUser = {
              uid: user.uid,
              email: user.email || "",
              name: user.displayName || "",
              photo: user.photoURL || "",
              provider: user.providerData?.[0]?.providerId || "email",
              role: "user",
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              shippingAddress: {
                fullName: "",
                phone: "",
                street: "",
                city: "",
                state: "",
                postalCode: "",
                country: "",
              },
              orders: [],
            };
            await setDoc(userRef, newUser);
            setUserProfile(newUser);
          }
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
      } catch (e) {
        console.error("Auth state init error:", e);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [auth, db]);

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const updateShippingAddress = useCallback(
    async (addressData) => {
      if (!currentUser) throw new Error("Not signed in");
      const userRef = doc(db, "users", currentUser.uid);
      const payload = {
        shippingAddress: {
          fullName: addressData.fullName?.trim() || "",
          phone: addressData.phone?.trim() || "",
          street: addressData.street?.trim() || "",
          city: addressData.city?.trim() || "",
          state: addressData.state?.trim() || "",
          postalCode: addressData.postalCode?.trim() || "",
          country: addressData.country?.trim() || "",
        },
        updatedAt: serverTimestamp(),
      };
      await updateDoc(userRef, payload);
      const updated = await getDoc(userRef);
      setUserProfile(updated.data());
      return updated.data().shippingAddress;
    },
    [currentUser, db]
  );

  const getShippingAddress = useCallback(() => {
    return userProfile?.shippingAddress || null;
  }, [userProfile]);

  const createOrder = useCallback(
    async (orderData) => {
      if (!currentUser) throw new Error("Not signed in");
      if (!orderData?.items?.length) throw new Error("Cart is empty");
      if (!orderData?.shippingAddress?.fullName) throw new Error("Shipping address missing");

      const userRef = doc(db, "users", currentUser.uid);
      const ordersCol = collection(db, "orders");

      const order = {
        userId: currentUser.uid,
        items: orderData.items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          size: i.size || null,
          image: i.image || "",
        })),
        shippingAddress: orderData.shippingAddress,
        amounts: {
          subtotal: Number(orderData.amounts?.subtotal || 0),
          shipping: Number(orderData.amounts?.shipping || 0),
          tax: Number(orderData.amounts?.tax || 0),
          total: Number(orderData.amounts?.total || 0),
        },
        status: "placed",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        payment: {
          method: "card",
          last4: orderData?.payment?.last4 || "",
          brand: orderData?.payment?.brand || "unknown",
        },
      };

      const newOrderRef = doc(ordersCol);
      const orderId = newOrderRef.id;
      await setDoc(newOrderRef, { id: orderId, ...order });
      await updateDoc(userRef, { 
        orders: arrayUnion(orderId), 
        updatedAt: serverTimestamp() 
      });

      const updated = await getDoc(userRef);
      setUserProfile(updated.data());

      return { id: orderId, ...order };
    },
    [currentUser, db]
  );

  const getUserOrders = useCallback(async () => {
    if (!currentUser) return [];
    const ordersCol = collection(db, "orders");
    const q = query(
      ordersCol, 
      where("userId", "==", currentUser.uid), 
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data());
  }, [currentUser, db]);

  const getOrderById = useCallback(
    async (orderId) => {
      if (!currentUser) throw new Error("Not signed in");
      const ref = doc(db, "orders", orderId);
      const od = await getDoc(ref);
      if (!od.exists()) throw new Error("Order not found");
      const data = od.data();
      if (data.userId !== currentUser.uid) throw new Error("Unauthorized");
      return data;
    },
    [currentUser, db]
  );

  const value = {
    currentUser,
    userProfile,
    loading,
    logout,
    updateShippingAddress,
    getShippingAddress,
    createOrder,
    getUserOrders,
    getOrderById,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
