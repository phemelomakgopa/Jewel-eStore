import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { authErrorMessage } from "../utils/authErrors";
import "./SignIn.css";

export default function ForgotPassword() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [sentTo, setSentTo] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSentTo(email.trim());
    } catch (err) {
      // Don't reveal whether an account exists for this email.
      if (err.code === "auth/user-not-found") setSentTo(email.trim());
      else setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleReset}>
        <h1>Reset your password</h1>

        {sentTo ? (
          <p className="auth-success" role="status">
            If there's an account for {sentTo}, a reset link is on its way. Check your inbox and spam folder.
          </p>
        ) : (
          <>
            <p className="auth-lead">Enter your email and we'll send you a link to choose a new password.</p>
            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}
            <label htmlFor="reset-email">Email</label>
            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="auth-submit" disabled={busy}>
              {busy ? "Sending…" : "Send reset link"}
            </button>
          </>
        )}

        <p className="auth-switch">
          <Link to="/signin">Back to sign in</Link>
        </p>
      </form>
    </div>
  );
}
