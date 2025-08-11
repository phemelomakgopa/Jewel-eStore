import React from "react";
import "./SignIn.css";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app } from "../config/firebaseConfig";

export default function SignUp() {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Replace with your admin email(s)
      const adminEmails = ["admin@example.com"];

      if (adminEmails.includes(user.email)) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Google Sign-In failed", error);
    }
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    alert("Custom create account logic goes here!");
  };

  return (
    <div className="signup-page">
      {/* Sign Up Form */}
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleCreateAccount}>
          <label>Username*</label>
          <input type="text" required />

          <label>Password *</label>
          <input type="password" required />

          <label>Repeat passwords *</label>
          <input type="password" required />

          <button type="submit" className="create-account-btn">
            Create account
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
            />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}
