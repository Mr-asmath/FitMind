import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('device_id', data.device_id);
        navigate('/dashboard-calendar');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="body">
      <header></header>
      <div className="auth-container" 
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        marginTop: '50px',
        width:'50%'
        }}>
          <h2 style={{
            color:'#3b82f6'
          }}>Login</h2>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <button
              type="submit"
              className={isLoading ? 'loading' : ''}
              disabled={isLoading}
            >
              {isLoading ? '' : 'Login'}
            </button>

          </form>

          <p>
            Don't have an account?{' '}
            <Link to="/register">Register</Link>
          </p>
        </div>
    </div>
    
  );
}

export default Login;
