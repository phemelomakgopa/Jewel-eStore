import Navbar from './components/Navbar';
import Hero from "./components/Hero";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Next: Hero section */}
      <Hero />
    </div>
  );
}

export default App;
