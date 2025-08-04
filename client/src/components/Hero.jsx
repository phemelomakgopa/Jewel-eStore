import React from "react";
import { FaShoppingCart } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-100 via-white to-pink-100 py-20 overflow-hidden">
      {/* Floating Glass Card Background */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="w-[90%] h-[80%] bg-white/20 backdrop-blur-3xl rounded-3xl shadow-inner"></div>
      </div>

      <div className="relative container mx-auto flex flex-col-reverse md:flex-row items-center px-4 md:px-8 z-10">
        {/* Left Side Text */}
        <div className="w-full md:w-1/2 text-center md:text-left animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 drop-shadow-lg">
            Discover the Perfect Jewelry
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto md:mx-0">
            Shop timeless designs and premium craftsmanship for any occasion.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition shadow-md hover:scale-105 duration-300">
            <div className="flex items-center gap-2 justify-center">
              <FaShoppingCart />
              Shop Now
            </div>
          </button>
        </div>

        {/* Right Side Image */}
        <div className="w-full md:w-1/2 mb-10 md:mb-0 flex justify-center animate-fade-in">
          <img
            src="https://via.placeholder.com/400x300.png?text=Product+Preview"
            alt="Hero Jewelry"
            className="rounded-xl shadow-xl hover:scale-105 transition duration-300"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
