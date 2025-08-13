import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    let pageName = "";

    // Match pathname to readable title
    switch (location.pathname) {
      case "/":
        pageName = "Home";
        break;
      case "/products":
        pageName = "Products";
        break;
      case "/cart":
        pageName = "Cart";
        break;
      case "/about":
        pageName = "About";
        break;
      case "/contact":
        pageName = "Contact";
        break;
      case "/signin":
        pageName = "Sign In";
        break;
      default:
        pageName = location.pathname.replace("/", ""); // fallback
        break;
    }

    document.title = `Jewel Store - ${pageName}`;
  }, [location]);

  return null; // This component doesn’t render anything
}
