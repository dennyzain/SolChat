import Hero from "./components/Hero";
import Features from "./components/Features";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="bg-[#eee] text-white h-screen w-screen">
      <Navbar />
      <Hero />
      <Features />
    </div>
  );
}

export default App;
