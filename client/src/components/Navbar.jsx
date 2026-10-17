import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FaShoppingBag, FaHeart, FaBars, FaTimes } from "react-icons/fa";
import styles from "./Navbar.module.css";
import { useAuth } from "../contexts/AuthContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import UserProfile from "./UserProfile";
import SearchBar from "./SearchBar";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const linkClass = ({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`;

const Navbar = () => {
  const { currentUser } = useAuth();
  const { getWishlistCount } = useWishlist();
  const { getTotalItems } = useCart();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = getTotalItems();
  const wishlistCount = currentUser ? getWishlistCount() : 0;

  // Close the mobile menu whenever the route changes.
  useEffect(() => setMenuOpen(false), [location.pathname, location.search]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <button
          type="button"
          className={styles.menuToggle}
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <Link to="/" className={styles.logo}>
          Jewel Store.
        </Link>

        <div className={styles.searchContainer}>
          <SearchBar />
        </div>

        <nav className={styles.navLinksDesktop} aria-label="Main">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          {!currentUser && (
            <Link
              to="/signin"
              state={{ from: location.pathname + location.search }}
              className={styles.signInLink}
            >
              Sign in
            </Link>
          )}

          <Link to="/wishlist" className={styles.iconButton} aria-label={`Wishlist, ${wishlistCount} items`}>
            <FaHeart />
            {wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}
          </Link>

          <Link to="/cart" className={styles.iconButton} aria-label={`Cart, ${cartCount} items`}>
            <FaShoppingBag />
            {cartCount > 0 && <span className={`${styles.badge} ${styles.cartBadge}`}>{cartCount}</span>}
          </Link>

          {currentUser && <UserProfile />}
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className={styles.mobileMenu}>
          <SearchBar />
          <nav aria-label="Main" className={styles.mobileLinks}>
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
            {currentUser && (
              <NavLink to="/orders" className={linkClass}>
                Your orders
              </NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
