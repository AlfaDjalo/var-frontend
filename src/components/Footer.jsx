import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>© 2026 VaR App. All rights reserved.</p>
        <p>
          <a href="#" className="footer-link">Contact Us</a> |{" "}
          <a href="https://github.com/yourusername/var-frontend" target="_blank" rel="noopener noreferrer" className="footer-link">
            GitHub Repo
          </a>
        </p>
      </div>
    </footer>
  );
}
