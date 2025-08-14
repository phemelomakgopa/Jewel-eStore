import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PageTitle from "./components/PageTitle.js";
import Navbar from "./components/Navbar.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import Hero from "./components/Hero.jsx";
import Categories from "./components/Categories.jsx";
import Products from "./components/Products.jsx";
import About from "./components/About.jsx";
import Footer from "./components/Footer.jsx";
import SignIn from "./components/SignIn.jsx";
import SignUp from "./components/SignUp.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import Cart from "./components/Cart.jsx";
import Checkout from "./components/Checkout.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import Loader from "./components/Loader.jsx";

import "./App.css"; // keep your global styles; make sure it doesn't add blur/overlap

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <Loader />;

  return (
    <AuthProvider>
      <Router>
        <PageTitle />
        <div className="app-container">
          <Navbar />
          <main>
            <Routes>
              {/* Main landing page */}
              <Route
                path="/"
                element={
                  <>
                    <Hero />
                    <Categories />
                    <Products />
                    <About />
                  </>
                }
              />

              {/* Standalone pages */}
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/adminpanel" element={<AdminPanel />} />

              {/* Fallback -> main sections */}
              <Route
                path="*"
                element={
                  <>
                    <Hero />
                    <Categories />
                    <Products />
                    <About />
                  </>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
