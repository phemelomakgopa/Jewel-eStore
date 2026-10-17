import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import { authErrorMessage } from "../utils/authErrors";
import { GoogleButton } from "./SignIn";
import "./SignIn.css";

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, updateDisplayName } = useAuth();
  const from = location.state?.from || "/";

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [creating, setCreating] = useState(false);

  // While creating, the auth state flips to signed-in before the name is
  // saved; don't redirect away mid-way.
  if (currentUser && !creating) return <Navigate to={from} replace />;

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return setError("Use a password with at least 6 characters.");
    if (form.password !== form.confirm) return setError("The passwords don't match.");

    setBusy(true);
    setCreating(true);
    setError("");
    try {
      // AuthContext creates the user's profile document; we only add the name.
      await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
      await updateDisplayName(form.name.trim());
      navigate(from, { replace: true });
    } catch (err) {
      setError(authErrorMessage(err));
      setBusy(false);
      setCreating(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate(from, { replace: true });
    } catch (err) {
      setError(authErrorMessage(err));
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSignUp}>
        <h1>Create an account</h1>
        <p className="auth-lead">Save pieces to your wishlist and track your orders.</p>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <label htmlFor="signup-name">Full name</label>
        <input id="signup-name" autoComplete="name" required value={form.name} onChange={update("name")} />

        <label htmlFor="signup-email">Email</label>
        <input id="signup-email" type="email" autoComplete="email" required value={form.email} onChange={update("email")} />

        <label htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          aria-describedby="password-hint"
          value={form.password}
          onChange={update("password")}
        />
        <span id="password-hint" className="auth-hint">
          At least 6 characters.
        </span>

        <label htmlFor="signup-confirm">Confirm password</label>
        <input
          id="signup-confirm"
          type="password"
          autoComplete="new-password"
          required
          value={form.confirm}
          onChange={update("confirm")}
        />

        <button type="submit" className="auth-submit" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </button>

        <div className="divider">or</div>

        <GoogleButton onClick={handleGoogle} disabled={busy}>
          Sign up with Google
        </GoogleButton>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/signin" state={{ from }}>
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
