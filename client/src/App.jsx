import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/HeroSection';
import Categories from './components/Categories';
//import Products from './components/Products';
//import About from './components/About';
//import Footer from './components/Footer';

// You might still have a global CSS file for body/html styles,
// but component-specific styles will now be in .module.css files.
// For example, if you want a global background color:
// import './App.css'; // If you create a global App.css

function App() {
  return (
    // Removed Tailwind classes. If you need a global background,
    // you can apply it via a class in a global CSS file (e.g., App.css)
    // or directly to the body in index.html/index.js global CSS.
    <div className="app-container"> {/* You can add a global class here if needed */}
      <Navbar />
      <main>
        <Hero />
        <Categories />
        
        
      </main>
      
    </div>
  );
}

export default App;
