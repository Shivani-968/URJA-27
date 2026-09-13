import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Hyperspeed from "../Hyperspeed/Hyperspeed";
import TextType from "../TextType/TextType";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  // Use useCallback to avoid re-creating functions every render
  const handleNavigate = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  return (
    <main className="urja-homepage">
      {/* 🔸 Hero Section */}
      <section className="hero-section">
        {/* Animated Background */}
        <div className="hyperspeed-bg" aria-hidden="true">
          <Hyperspeed />
        </div>

        {/* Main Content */}
        <div className="hero-content">
          <h1 className="hero-title" aria-label="Welcome to URJA 2026">
            <TextType
              text="Welcome to URJA 2026"
              typingSpeed={90}
              pauseDuration={1800}
              showCursor
              cursorCharacter="_"
              cursorBlinkDuration={0.7}
            />
          </h1>

          <h2 className="hero-subtitle" aria-label="The Clash of Extremes, The Glory of One">
            <TextType
              text="The Clash of Extremes, The Glory of One"
              typingSpeed={75}
              initialDelay={2000}
              pauseDuration={2500}
              showCursor
              cursorCharacter="_"
              cursorBlinkDuration={0.7}
              className="subtitle-typing"
            />
          </h2>

          {/* CTA Buttons */}
          <div className="hero-buttons">
            <button
              className="hero-btn-primary"
              onClick={() => handleNavigate("/Branch-Leaderboard")}
              aria-label="Go to Branch Leaderboard page"
            >
              Branch Leaderboard <ArrowRight className="icon" />
            </button>

            <button
              className="hero-btn-secondary"
              onClick={() => handleNavigate("/points-table")}
              aria-label="Go to Points Table page"
            >
              Points Table
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator" aria-hidden="true">
          <div className="scroll-mouse" />
        </div>
      </section>
    </main>
  );
}
