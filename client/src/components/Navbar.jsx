import { FaShoppingCart, FaUser } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="bg-[#f3e9dd] shadow-sm py-4 px-8 flex justify-between items-center font-serif">
      {/* Logo */}
      <h1 className="text-2xl font-bold italic text-[#1a1a1a]">Jewel Store.</h1>

      {/* Links */}
      <ul className="hidden md:flex space-x-10 text-lg text-[#1a1a1a]">
        <li className="hover:underline cursor-pointer">Home</li>
        <li className="hover:underline cursor-pointer">About</li>
        <li className="hover:underline cursor-pointer">Products</li>
        <li className="hover:underline cursor-pointer">Contact</li>
      </ul>

      {/* Icons */}
      <div className="flex items-center gap-4 text-[#1a1a1a] font-medium">
        <span className="cursor-pointer">SIGN IN</span>
        <FaShoppingCart className="cursor-pointer text-xl" />
        <FaUser className="cursor-pointer text-xl" />
      </div>
    </nav>
  );
}

export default Navbar;
