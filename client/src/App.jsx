import React from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Categories from './components/Categories.jsx';
import Products from './components/Products.jsx';
import About from './components/About.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
       {/* <Hero />*/}
        <Hero />
        <Categories />
        {<Products />}
        <About /> 
        
      </main>
      {<Footer />}
    </div>
  );
}

export default App;

/*function App() {
  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>
      <h1>Hello, React is actually rendering something! 🎉</h1>
      <p>If you see this, your core setup is working.</p>
    </div>
  );
}

export default App;*/