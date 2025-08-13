import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from "../config/firebaseConfig";
import "./ForgotPassword.css"; // optional styling
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const auth = getAuth(app);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Check your inbox.");
    } catch (error) {
      setMessage("Failed to send reset email. Please check the address.");
    }
  };

  return (
    <div className="forgot-password-page">
      <form className="forgot-password-form" onSubmit={handleReset}>
        <h2>Reset Your Password</h2>
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send Reset Email</button>
        {message && <p className="feedback">{message}</p>}
        <div className="back-to-signin">
          <Link to="/signin">Back to Sign In</Link>
        </div>
      </form>
    </div>
  );
}
