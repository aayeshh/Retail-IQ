import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import PageLayout from "../../components/PageLayout/PageLayout";
import { apiRequest } from "../../api/client";
import { saveCache } from "../../utils/cache";

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

      try {
        const dashboardData = await apiRequest("/api/dashboard/overview");
        saveCache("retailiq_dashboard_overview_cache", dashboardData);
      } catch {
        // Prefetch failed; dashboard will still load normally.
      }

      navigate("/dashboard");

      const backgroundPrefetch = async () => {
        try {
          const [topProducts, recommendations, salesTrend] = await Promise.all([
            apiRequest("/api/top-products"),
            apiRequest("/api/recommendations"),
            apiRequest("/api/sales-trend?interval=monthly"),
          ]);
          saveCache("retailiq_top_products_cache", topProducts);
          saveCache("retailiq_recommendations_cache", recommendations);
          saveCache("retailiq_sales_trend_cache_monthly", salesTrend);
        } catch {
          // No action needed if prefetch fails.
        }
      };

      void backgroundPrefetch();
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
