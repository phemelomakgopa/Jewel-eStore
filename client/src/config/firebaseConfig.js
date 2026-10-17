import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase web config is public by design; access is controlled by
// Firestore security rules, not by hiding these values.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyAnkiMO0f9I4SuQzBXZhxLeG7xISzLy5tI",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "ecommerce-jewlery.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "ecommerce-jewlery",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "ecommerce-jewlery.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "617892589505",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:617892589505:web:b5784f2cc07eb235e4c940",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export { app };
