import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DemoBanner from "./components/DemoBanner";
import Home from "./pages/Home";
import Triage from "./pages/Triage";
import Pipeline from "./pages/Pipeline";
import Graphics from "./pages/Graphics";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <HashRouter>
      <DemoBanner />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/triagem" element={<Triage />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/graphics" element={<Graphics />} />
      </Routes>
      <ThemeToggle />
    </HashRouter>
  );
}

export default App;
