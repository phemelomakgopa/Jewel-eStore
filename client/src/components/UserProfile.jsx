import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { FaSignOutAlt, FaCog, FaUser } from "react-icons/fa";
import styles from "./UserProfile.module.css";

const UserProfile = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!currentUser) return null;

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const profilePhoto = userProfile?.photo || currentUser?.photoURL;
  const displayName = userProfile?.name || currentUser?.displayName || "User";

  return (
    <div className={styles.userProfile} ref={dropdownRef}>
      <div className={styles.profileIcon} onClick={toggleDropdown}>
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt="Profile"
            className={styles.profileImage}
          />
        ) : (
          <div className={styles.initialsIcon}>{getInitials(displayName)}</div>
        )}
      </div>

      {showDropdown && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{displayName}</div>
              <div className={styles.userEmail}>
                {userProfile?.email || currentUser?.email}
              </div>
            </div>
          </div>

          <div className={styles.dropdownDivider}></div>

          <div className={styles.dropdownItems}>
            <button className={styles.dropdownItem}>
              <FaUser className={styles.dropdownIcon} />
              Profile Settings
            </button>
            <button className={styles.dropdownItem}>
              <FaCog className={styles.dropdownIcon} />
              Account Settings
            </button>
            <button
              className={`${styles.dropdownItem} ${styles.logoutItem}`}
              onClick={handleLogout}
            >
              <FaSignOutAlt className={styles.dropdownIcon} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
