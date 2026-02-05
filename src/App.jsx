import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";          // New home page you will create
import FileSelectPage from "./pages/FileSelectPage";  // Load Data page
import VaRSettingsPage from "./pages/VaRSettingsPage";
import PortfolioPage from "./pages/PortfolioPage";
import VaRResultPage from "./pages/VaRResultPage";

import Header from "./components/Header";
import Footer from "./components/Footer";

import "./styles/ui.css";

function App() {
  return (
    <Router basename="/var-frontend">
      <Header />
      <main style={{ maxWidth: 960, margin: "24px auto", padding: "0 16px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/load-data" element={<FileSelectPage />} />
          <Route path="/settings" element={<VaRSettingsPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/results" element={<VaRResultPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
