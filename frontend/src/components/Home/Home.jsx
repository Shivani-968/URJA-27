import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import TextType from "../TextType/TextType";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  return (
    <main className="urja-homepage">

      {/* ================= HERO SECTION ================= */}
      <section className="hero-section">

        {/* ================= VIDEO BACKGROUND ================= */}
        <div className="video-bg" aria-hidden="true">
          <video
            className="hero-video"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          >
            <source src="/urja-bg.mp4" type="video/mp4" />
          </video>
        </div>

        {/* ================= PINK + BLACK OVERLAY ================= */}
        <div className="video-overlay" aria-hidden="true"></div>

        {/* ================= HERO CONTENT ================= */}
        <div className="hero-content">

          <h1 className="hero-title" aria-label="Welcome to URJA 2027">
            <TextType
              text="Welcome to URJA 2027"
              typingSpeed={90}
              pauseDuration={1800}
              showCursor
              cursorCharacter="_"
              cursorBlinkDuration={0.7}
            />
          </h1>

          <h2
            className="hero-subtitle"
            aria-label="The Clash of Extremes, The Glory of One"
          >
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

          {/* ================= CTA BUTTONS ================= */}
          <div className="hero-buttons">

            <button
              className="hero-btn-primary"
              onClick={() => handleNavigate("/Branch-Leaderboard")}
              aria-label="Go to Branch Leaderboard page"
            >
              Branch Leaderboard
              <ArrowRight className="icon" />
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

        {/* ================= SCROLL INDICATOR ================= */}
        <div className="scroll-indicator" aria-hidden="true">
          <div className="scroll-mouse"></div>
        </div>

      </section>
    </main>
  );
}