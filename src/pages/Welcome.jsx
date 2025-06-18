import { Link } from "react-router-dom";
export default function Welcome() {
  return (
    <div className="container">
      <h1>AI‑Powered Fitness & Lifestyle Companion</h1>
      <p>Your journey to a healthier life starts here.</p>
      <Link to="/register">Get Started</Link> | <Link to="/login">Login</Link>
    </div>
  );
}
