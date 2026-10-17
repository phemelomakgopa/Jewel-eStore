import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaBoxOpen, FaHeart, FaChartLine } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import styles from "./UserProfile.module.css";

const getInitials = (name) =>
  (name || "U")
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

const UserProfile = () => {
  const { currentUser, userProfile, logout, isAdmin } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!currentUser) return null;

  const handleLogout = async () => {
    setOpen(false);
    try {
      await logout();
      notify("You're signed out.");
      navigate("/");
    } catch {
      notify("Couldn't sign you out. Try again.", { tone: "error" });
    }
  };

  const photo = userProfile?.photo || currentUser.photoURL;
  const displayName = userProfile?.name || currentUser.displayName || currentUser.email;

  return (
    <div className={styles.userProfile} ref={ref}>
      <button
        type="button"
        className={styles.profileIcon}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        {photo ? (
          <img src={photo} alt="" className={styles.profileImage} referrerPolicy="no-referrer" />
        ) : (
          <span className={styles.initialsIcon}>{getInitials(displayName)}</span>
        )}
      </button>

      {open && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.dropdownHeader}>
            <div className={styles.userName}>{displayName}</div>
            <div className={styles.userEmail}>{currentUser.email}</div>
          </div>
          <Link to="/orders" className={styles.dropdownItem} role="menuitem" onClick={() => setOpen(false)}>
            <FaBoxOpen className={styles.dropdownIcon} /> Your orders
          </Link>
          <Link to="/wishlist" className={styles.dropdownItem} role="menuitem" onClick={() => setOpen(false)}>
            <FaHeart className={styles.dropdownIcon} /> Wishlist
          </Link>
          {isAdmin && (
            <Link to="/admin" className={styles.dropdownItem} role="menuitem" onClick={() => setOpen(false)}>
              <FaChartLine className={styles.dropdownIcon} /> Admin dashboard
            </Link>
          )}
          <button type="button" className={`${styles.dropdownItem} ${styles.logoutItem}`} role="menuitem" onClick={handleLogout}>
            <FaSignOutAlt className={styles.dropdownIcon} /> Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
