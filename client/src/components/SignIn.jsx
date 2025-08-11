import React, { useState } from "react";
import "./SignIn.css";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app } from "../config/firebaseConfig";
import { saveUserToDB } from "../utils/saveUserToDB";
import { adminEmail } from "../config/adminList";

export default function SignUp() {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  // Google Sign-in
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save to DB
      await saveUserToDB(user);

      // Navigate
      // After sign-in success:
      if (adminEmail.includes(user.email)){
        navigate("/admin");
      }
      else {
        navigate("/");
      }
    }
    catch (error) {
      console.error("Google Sign-In failed", error);
    }
  };

  // Email Sign-up
  const handleCeateAccount = async (e) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // Save to DB
      await saveUserToDB(user);

      // Navigate
      if (adminEmail.includes(user.email)) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
    catch (error)
    {
      console.error("Email sign-uo failed:", error);
      alert(error.message);
    }
  };
  

  return (
    <div className="signup-page">
      {/* Sign Up Form */}
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleCreateAccount}>
          <label>Email address *</label>
          <input 
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

          <label>Password *</label>
          <input
            type="password"
            required
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

          <label>Repeat passwords *</label>
          <input
            type="password"
            required
            placeholder="Repeat your password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />

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
