import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PageTitle from "./components/PageTitle.js";
import Navbar from "./components/Navbar.jsx";
import { AuthProvider } from './contexts/AuthContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
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
import OrderHistory from "./components/OrderHistory.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import Loader from "./components/Loader.jsx";
import "./App.css";
import ProductDetails from "./components/ProductDetails.jsx";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <Loader />;

  return (
    <AuthProvider>
      <CartProvider>
        <Elements stripe={stripePromise}>
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
                  <Route path="/orders" element={<OrderHistory />} />
                  <Route path="/adminpanel" element={<AdminPanel />} />
                 <Route path="/product/:id" element={<ProductDetails />} />

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
        </Elements>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
