import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5001").replace(/\/$/, "");

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed.");
        setLoading(false);
        return;
      }

      // Store token and admin info
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminName", data.admin.name);
      localStorage.setItem("adminEmail", data.admin.email);

      navigate("/admin/dashboard");
    } catch (err) {
      setError("Network error. Is the backend running?");
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-glow"></div>
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-lock-icon">🔐</div>
            <h1>Admin Login</h1>
            <p>URJA 2026 Score Management</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-input-group">
              <label htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                type="email"
                placeholder="admin@urja.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="admin-input-group">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && <div className="admin-error-msg">{error}</div>}

            <button
              type="submit"
              className="admin-login-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="admin-spinner"></span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
