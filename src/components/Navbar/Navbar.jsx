import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const logo = "/urja-logo-white.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // FIXED: Properly manage body scroll with mobile-only check
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    
    if (isOpen && isMobile) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      // Get the scroll position before removing fixed
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    // Cleanup function - CRITICAL
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <Link to="/" className="navbar-logo-link" onClick={closeMenu}>
        <img
          src={logo}
          alt="URJA Logo"
          className={`navbar-logo ${isOpen ? "hide-logo" : ""}`}
        />
      </Link>

      <div className={`hamburger ${isOpen ? "open" : ""}`} onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        <li style={{ "--item-index": 0 }}>
          <Link to="/" onClick={closeMenu} className={location.pathname === "/" ? "active" : ""}>
            <span className="nav-text">Home</span>
            <span className="nav-glow"></span>
          </Link>
        </li>
        <li style={{ "--item-index": 1 }}>
          <Link to="/team" onClick={closeMenu} className={location.pathname === "/team" ? "active" : ""}>
            <span className="nav-text">Team</span>
            <span className="nav-glow"></span>
          </Link>
        </li>
        <li style={{ "--item-index": 2 }}>
          <Link to="/managers" onClick={closeMenu} className={location.pathname === "/managers" ? "active" : ""}>
            <span className="nav-text">Contributors</span>
            <span className="nav-glow"></span>
          </Link>
        </li>
        <li style={{ "--item-index": 3 }}>
          <Link to="/sports" onClick={closeMenu} className={location.pathname === "/sports" ? "active" : ""}>
            <span className="nav-text">Sports</span>
            <span className="nav-glow"></span>
          </Link>
        </li>
        <li style={{ "--item-index": 4 }}>
          <Link to="/gallery" onClick={closeMenu} className={location.pathname === "/gallery" ? "active" : ""}>
            <span className="nav-text">Gallery</span>
            <span className="nav-glow"></span>
          </Link>
        </li>
        <li style={{ "--item-index": 5 }}>
          <Link to="/pool" onClick={closeMenu} className={location.pathname === "/pool" ? "active" : ""}>
            <span className="nav-text">Pool</span>
            <span className="nav-glow"></span>
          </Link>
        </li>
        <li style={{ "--item-index": 6 }}>
          <Link to="/branch-leaderboard" onClick={closeMenu} className={location.pathname === "/branch-leaderboard" ? "active" : ""}>
            <span className="nav-text">Branch Leaderboard</span>
            <span className="nav-glow"></span>
          </Link>
        </li>
        <li style={{ "--item-index": 7 }}>
          <Link to="/points-table" onClick={closeMenu} className={location.pathname === "/points-table" ? "active" : ""}>
            <span className="nav-text">Points Table</span>
            <span className="nav-glow"></span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
