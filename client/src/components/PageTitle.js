import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getProductById, getCategoryLabel } from "../data/products";

const TITLES = {
  "/": "Fine jewellery",
  "/products": "Shop",
  "/about": "About",
  "/contact": "Contact",
  "/signin": "Sign in",
  "/signup": "Create account",
  "/forgotpassword": "Reset password",
  "/cart": "Your cart",
  "/wishlist": "Wishlist",
  "/checkout": "Checkout",
  "/orders": "Your orders",
  "/admin": "Admin",
  "/adminpanel": "Manage products",
};

export default function PageTitle() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    let title = TITLES[pathname];

    const productMatch = pathname.match(/^\/product\/(\d+)/);
    if (productMatch) title = getProductById(productMatch[1])?.name || "Product not found";

    if (pathname === "/products") {
      const params = new URLSearchParams(search);
      if (params.get("q")) title = `Search: ${params.get("q")}`;
      else if (params.get("category")) title = getCategoryLabel(params.get("category"));
    }

    document.title = `${title || "Page not found"} | Jewel Store`;
  }, [pathname, search]);

  return null;
}
