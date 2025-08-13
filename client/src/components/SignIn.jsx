import React, { useState } from "react";
import "./SignIn.css";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { app } from "../config/firebaseConfig";
import { adminEmail } from "../config/adminList";

export default function SignIn() {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Google Sign-In (optional, remove if not needed)
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      navigate("/");
    } catch (error) {
      alert("Google Sign-In failed. Please try again.");
    }
  };

  // Email Sign-In
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      // You can store/display user initial after this
      navigate("/");
    } catch (error) {
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSignIn}>
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div
            className="forgot-password"
            style={{
              textAlign: "right",
              marginBottom: "10px",
            }}
          >
            <Link to="/forgotpassword">Forgot Password?</Link>
          </div>

          <button type="submit" className="create-account-btn">
            Sign In
          </button>

          <div className="divider">or</div>

          <button
            type="button"
            className="google-btn"
            onClick={handleGoogleSignIn}
          >
            <img
              src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
              alt="Google logo"
              style={{ width: 20, marginRight: 8 }}
            />
            Continue with Google
          </button>
          <div className="signup-bottom">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
