import React, { useState } from "react";
import "./SignIn.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { app } from "../config/firebaseConfig";

export default function SignUp() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // Email Sign-Up
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Set display name
      await updateProfile(user, { displayName: name });

      // Save user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: user.email,
        provider: "email",
        role: "user",
        photo: "",
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
      });

      navigate("/");
    } catch (error) {
      setMessage("Failed to create account. Try again.");
    }
  };

  // Google Sign-Up
  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email,
        provider: "google",
        role: "user",
        photo: user.photoURL || "",
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
      });

      navigate("/");
    } catch (error) {
      setMessage("Google Sign-Up failed. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSignUp}>
          <h2>Create Account</h2>

          <input
            type="text"
            required
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            required
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            required
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {message && <p className="feedback">{message}</p>}

          <button type="submit" className="create-account-btn">
            Sign Up
          </button>

          <div className="divider">or</div>

          <button
            type="button"
            className="google-btn"
            onClick={handleGoogleSignUp}
          >
            <img
              src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
              alt="Google logo"
              style={{ width: 20, marginRight: 8 }}
            />
            Sign Up with Google
          </button>

          <div className="signup-bottom">
            Already have an account? <Link to="/signin">Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
