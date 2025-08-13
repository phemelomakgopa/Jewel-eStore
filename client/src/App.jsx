import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageTitle from "./components/PageTitle.js"
import Navbar from "./components/Navbar.jsx";
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

function App() {
  return (
    <Router>
      <PageTitle/>
      <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            {/* Main landing page with all sections */}
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

            {/* Individual routes for pages mentioned in your Navbar */}
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/adminpanel" element={<AdminPanel />} />

            {/* Fallback route - shows main page if no match */}
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
  );
}

export default App;
