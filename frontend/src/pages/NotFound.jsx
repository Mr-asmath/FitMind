import { Link } from "react-router-dom";
import { useEffect } from "react";
import "./NotFound.css";

export default function NotFound() {
  useEffect(() => {
    // Animation for elements
    const animateElements = () => {
      const title = document.querySelector(".notfound-title");
      const text = document.querySelector(".notfound-text");
      const button = document.querySelector(".notfound-button");

      if (title && text && button) {
        setTimeout(() => {
          title.style.opacity = "1";
          title.style.transform = "translateY(0)";
        }, 100);

        setTimeout(() => {
          text.style.opacity = "1";
          text.style.transform = "translateY(0)";
        }, 300);

        setTimeout(() => {
          button.style.opacity = "1";
          button.style.transform = "translateY(0)";
        }, 500);
      }
    };

    animateElements();
  }, []);

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-errorcode">
          <span className="error-digit">4</span>
          <span className="error-digit">0</span>
          <span className="error-digit">4</span>
        </div>
        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-text">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="notfound-button">
          Return Home
        </Link>
      </div>

      {/* Decorative elements */}
      <div className="notfound-decoration circle-1"></div>
      <div className="notfound-decoration circle-2"></div>
    </div>
  );
}