import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Categories from '../components/Categories';
import Products from '../components/Products';
import About from '../components/About';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <Categories />
        <Products />
        <About />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;