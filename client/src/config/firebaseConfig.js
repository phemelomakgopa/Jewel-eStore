import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAnkiMO0f9I4SuQzBXZhxLeG7xISzLy5tI",
    authDomain: "ecommerce-jewlery.firebaseapp.com",
    projectId: "ecommerce-jewlery",
    storageBucket: "ecommerce-jewlery.firebasestorage.app",
    messagingSenderId: "617892589505",
    appId: "1:617892589505:web:b5784f2cc07eb235e4c940",
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Exports
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const firebaseApp = app; // alternative export name if needed
export { app, signInWithPopup, doc, getDoc };