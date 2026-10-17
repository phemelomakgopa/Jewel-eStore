import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="page">
    <div className="empty-state">
      <h2>Page not found</h2>
      <p>The link may be old or mistyped. Everything we sell is in the shop.</p>
      <Link to="/products" className="btn btn-primary">
        Browse the shop
      </Link>
    </div>
  </div>
);

export default NotFound;
