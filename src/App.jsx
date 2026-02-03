import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";

import FileSelectPage from "./pages/FileSelectPage";
import VaRSettingsPage from "./pages/VaRSettingsPage";
import PortfolioPage from "./pages/PortfolioPage";
import VaRResultPage from "./pages/VaRResultPage";

function App() {
  return (
    <Router basename="/var-frontend">
      <div style={{ padding: 20 }}>
        <h1>VaR App</h1>

        <nav style={{ marginBottom: 20 }}>
          <NavLink to="/">Load Data</NavLink>{" "}
          <NavLink to="/settings">Settings</NavLink>{" "}
          <NavLink to="/portfolio">Portfolio</NavLink>{" "}
          <NavLink to="/results">Results</NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<FileSelectPage />} />
          <Route path="/settings" element={<VaRSettingsPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/results" element={<VaRResultPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
