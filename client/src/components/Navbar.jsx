import React from "react";
import styles from "./Navbar.module.css"; 
import { useAuth } from "../contexts/AuthContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import UserProfile from "./UserProfile";
import SearchBar from "./SearchBar";

import { FaShoppingCart, FaUserCircle, FaHeart } from "react-icons/fa";

const Navbar = () => {
  const { currentUser } = useAuth();
  const { getWishlistCount } = useWishlist();
  const { getTotalItems } = useCart();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo/Brand Name */}
        <a href="/" className={styles.logo}>
          Jewel Store.
        </a>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <SearchBar className={styles.searchBar} />
        </div>

        {/* Navigation Links (Desktop) */}
        <div className={styles.navLinksDesktop}>
          <a href="/" className={styles.navLink}>
            Home
          </a>
          <a href="/about" className={styles.navLink}>
            About
          </a>
          <a href="/products" className={styles.navLink}>
            Products
          </a>
          <a href="/contact" className={styles.navLink}>
            Contact
          </a>
        </div>

        {/* Action Buttons (Desktop) */}
        <div className={styles.actionButtonsDesktop}>
          {!currentUser ? (
            <a href="/signin" className={styles.signInLink}>
              SIGN IN
            </a>
          ) : null}

          <a href="/wishlist" className={styles.wishlistButton}>
            <FaHeart className={styles.wishlistIcon} />
            {currentUser && getWishlistCount() > 0 && (
              <span className={styles.wishlistBadge}>{getWishlistCount()}</span>
            )}
          </a>

          <a href="/cart" className={styles.cartButton}>
            <FaShoppingCart className={styles.cartIcon} />
            {getTotalItems() > 0 && (
              <span className={styles.cartBadge}>{getTotalItems()}</span>
            )}
          </a>
          
          {currentUser && (
            <a href="/orders" className={styles.navLink}>
              My Orders
            </a>
          )}

          {currentUser ? (
            <UserProfile />
          ) : (
            <FaUserCircle className={styles.userIcon} />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
