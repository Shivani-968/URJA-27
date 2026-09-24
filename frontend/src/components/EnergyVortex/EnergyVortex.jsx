import React from "react";
import "./EnergyVortex.css";

const particles = Array.from({ length: 24 });

export default function EnergyVortex() {
  return (
    <div className="energy-vortex">
      {/* Main glow */}
      <div className="vortex-core"></div>

      {/* Rotating energy rings */}
      <div className="vortex-ring ring-1"></div>
      <div className="vortex-ring ring-2"></div>
      <div className="vortex-ring ring-3"></div>
      <div className="vortex-ring ring-4"></div>

      {/* Energy trails */}
      <div className="energy-trail trail-1"></div>
      <div className="energy-trail trail-2"></div>
      <div className="energy-trail trail-3"></div>

      {/* Floating particles */}
      <div className="vortex-particles">
        {particles.map((_, index) => (
          <span
            key={index}
            className="vortex-particle"
            style={{
              "--i": index,
              "--delay": `${index * 0.25}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}