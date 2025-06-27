import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

export default function Header() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🧘</span>
          <span className="logo-text">Wellness Companion</span>
        </Link>

        <nav className="nav-menu">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/choose" className="nav-link">
                Activities
              </Link>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
              <div className="user-avatar">
                {user.full_name.charAt(0).toUpperCase()}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link highlight">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}