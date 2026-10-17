import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import { authErrorMessage } from "../utils/authErrors";
import "./SignIn.css";

export const GoogleButton = ({ onClick, disabled, children }) => (
  <button type="button" className="google-btn" onClick={onClick} disabled={disabled}>
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
    {children}
  </button>
);

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const from = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (currentUser) return <Navigate to={from} replace />;

  const run = async (fn) => {
    setBusy(true);
    setError("");
    try {
      await fn();
      navigate(from, { replace: true });
    } catch (err) {
      setError(authErrorMessage(err));
      setBusy(false);
    }
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    run(() => signInWithEmailAndPassword(auth, email.trim(), password));
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSignIn}>
        <h1>Sign in</h1>
        <p className="auth-lead">
          {from === "/checkout" ? "Sign in to finish checking out. Your cart is saved." : "Welcome back."}
        </p>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <label htmlFor="signin-email">Email</label>
        <input
          id="signin-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="label-row">
          <label htmlFor="signin-password">Password</label>
          <Link to="/forgotpassword" state={{ email }}>
            Forgot password?
          </Link>
        </div>
        <input
          id="signin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="auth-submit" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <div className="divider">or</div>

        <GoogleButton onClick={() => run(() => signInWithPopup(auth, googleProvider))} disabled={busy}>
          Continue with Google
        </GoogleButton>

        <p className="auth-switch">
          New here?{" "}
          <Link to="/signup" state={{ from }}>
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
