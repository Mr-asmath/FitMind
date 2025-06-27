import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            Wellness Companion
          </Link>
          <p className="footer-tagline">
            Your journey to better health starts here
          </p>
        </div>

        <div className="footer-links">
          <div className="link-group">
            <h4>Navigation</h4>
            <Link to="/">Home</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/choose">Activities</Link>
          </div>

          <div className="link-group">
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/dashboard">Profile</Link>
          </div>

          <div className="link-group">
            <h4>Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Wellness Companion. All rights reserved.</p>
      </div>
    </footer>
  );
}