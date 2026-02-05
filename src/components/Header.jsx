import React from "react";
import Navbar from "./Navbar";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <h1 className="header-title">VaR App</h1>
        <Navbar />
      </div>
    </header>
  );
}
