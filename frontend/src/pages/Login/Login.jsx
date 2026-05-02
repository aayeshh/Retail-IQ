import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import PageLayout from "../../components/PageLayout/PageLayout";
import { apiRequest } from "../../api/client";

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ text: "", type: "" });

  async function onLogin() {
    if (!email.trim() || !password) {
      setStatus({ text: "Email and password are required.", type: "error" });
      return;
    }

    setSubmitting(true);
    setStatus({ text: "", type: "" });
    try {
      const result = await apiRequest("/api/register/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });
      if (onLoginSuccess) {
        onLoginSuccess(result.user);
      }
      setStatus({
        text: `${result.message}. Welcome ${result.user?.full_name || ""}`.trim(),
        type: "success",
      });
      navigate("/dashboard");
    } catch (err) {
      setStatus({ text: err.message || "Login failed", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageLayout contentClassName="login-page" showSidebar={false}>
      <section className="login-split">
        <div className="login-left">
          <div className="left-logo">RetailIQ</div>
          <div className="left-graphic">🔑</div>
          <p>RETAILIQ - Intelligent Forecasting.</p>
        </div>
        <div className="login-right">
          <h1>Welcome Back to RetailIQ.</h1>
          <p>Sign in to access your forecasts.</p>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {status.text && <p className={`toast ${status.type}`}>{status.text}</p>}
          <button onClick={onLogin} disabled={submitting}>
            {submitting ? "Signing In..." : "Sign In"}
          </button>
          <button
            type="button"
            className="muted-btn"
            onClick={() => navigate("/reset-password")}
          >
            Forgot Password?
          </button>
          <p className="muted">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </section>
    </PageLayout>
  );
}

export default Login;
