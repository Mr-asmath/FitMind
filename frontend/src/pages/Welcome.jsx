import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";

export default function Welcome() {
  const navigate = useNavigate();

  // Refs for animation
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    const elements = [
      { ref: titleRef, delay: 0, style: { opacity: 0, transform: "translateY(20px)" } },
      { ref: subtitleRef, delay: 300, style: { opacity: 0, transform: "translateY(20px)" } },
      { ref: buttonsRef, delay: 600, style: { opacity: 0, transform: "scale(0.95)" } },
    ];

    elements.forEach(({ ref, style }) => {
      if (ref.current) {
        Object.assign(ref.current.style, style, {
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          visibility: "hidden",
        });
      }
    });

    const timeouts = elements.map(({ ref, delay }) =>
      setTimeout(() => {
        if (ref.current) {
          Object.assign(ref.current.style, {
            opacity: 1,
            transform: "none",
            visibility: "visible",
          });
        }
      }, delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="welcome-bg">
      <div className="welcome-card">
        <h1 ref={titleRef} className="welcome-title">
          AI‑Powered <span className="highlight">Fitness</span> Companion
        </h1>
        <p ref={subtitleRef} className="welcome-subtitle">
          Your journey to a healthier life starts <span className="highlight">now</span>
        </p>
        <div ref={buttonsRef} className="welcome-buttons">
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="welcome-button primary"
          >
            Get Started
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="welcome-button secondary"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
