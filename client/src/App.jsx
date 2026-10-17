import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { ToastProvider } from "./contexts/ToastContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { WishlistProvider } from "./contexts/WishlistContext.jsx";
import { ReviewsProvider } from "./contexts/ReviewsContext.jsx";
import { AdminProvider } from "./contexts/AdminContext.jsx";

import PageTitle from "./components/PageTitle.js";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Categories from "./components/Categories.jsx";
import Products from "./components/Products.jsx";
import About from "./components/About.jsx";
import Footer from "./components/Footer.jsx";
import Shop from "./components/Shop.jsx";
import ProductDetails from "./components/ProductDetails.jsx";
import SignIn from "./components/SignIn.jsx";
import SignUp from "./components/SignUp.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import Cart from "./components/Cart.jsx";
import Checkout from "./components/Checkout.jsx";
import OrderHistory from "./components/OrderHistory.jsx";
import Wishlist from "./components/Wishlist.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import NotFound from "./components/NotFound.jsx";

const stripePromise = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
  : null;

// New pages start at the top; filter changes on the same page don't jump.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// /search?q=… is the old URL; keep it working.
function SearchRedirect() {
  const { search } = useLocation();
  return <Navigate to={`/products${search}`} replace />;
}

const Home = () => (
  <>
    <Hero />
    <Categories />
    <Products limit={10} />
    <About />
  </>
);

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ReviewsProvider>
                <AdminProvider>
                  <Elements stripe={stripePromise}>
                    <PageTitle />
                    <ScrollToTop />
                    <div className="app-container">
                      <a href="#main" className="skip-link">
                        Skip to content
                      </a>
                      <Navbar />
                      <main id="main">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/products" element={<Shop />} />
                          <Route path="/search" element={<SearchRedirect />} />
                          <Route path="/product/:id" element={<ProductDetails />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/contact" element={<About />} />
                          <Route path="/signin" element={<SignIn />} />
                          <Route path="/login" element={<Navigate to="/signin" replace />} />
                          <Route path="/signup" element={<SignUp />} />
                          <Route path="/forgotpassword" element={<ForgotPassword />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/wishlist" element={<Wishlist />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/orders" element={<OrderHistory />} />
                          <Route path="/admin" element={<AdminDashboard />} />
                          <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
                          <Route path="/adminpanel" element={<AdminPanel />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                      <Footer />
                    </div>
                  </Elements>
                </AdminProvider>
              </ReviewsProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
