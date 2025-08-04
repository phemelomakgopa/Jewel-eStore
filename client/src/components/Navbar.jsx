import { FaShoppingCart, FaUser } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="bg-white/60 backdrop-blur-md shadow-md py-4 px-8 flex justify-between items-center font-serif sticky top-0 z-50">
      {/* Logo */}
      <h1 className="text-2xl font-bold italic text-[#1a1a1a] drop-shadow-sm animate-fade-in">
        Jewel Store.
      </h1>

      {/* Links */}
      <ul className="hidden md:flex space-x-10 text-lg text-[#1a1a1a]">
        <li className="hover:underline cursor-pointer transition duration-300">Home</li>
        <li className="hover:underline cursor-pointer transition duration-300">About</li>
        <li className="hover:underline cursor-pointer transition duration-300">Products</li>
        <li className="hover:underline cursor-pointer transition duration-300">Contact</li>
      </ul>

      {/* Icons */}
      <div className="flex items-center gap-4 text-[#1a1a1a] font-medium">
        <span className="cursor-pointer hover:text-blue-600 transition">SIGN IN</span>
        <FaShoppingCart className="cursor-pointer text-xl hover:text-blue-600 transition" />
        <FaUser className="cursor-pointer text-xl hover:text-blue-600 transition" />
      </div>
    </nav>
  );
}

export default Navbar;
