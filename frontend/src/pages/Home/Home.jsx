import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import PageLayout from "../../components/PageLayout/PageLayout";

function Home() {
  return (
    <PageLayout contentClassName="home-page page-wrap" showSidebar={false}>
      <section className="hero-wrap" id="home-hero">
        <div className="hero-left">
          <div className="tag">AI-Powered Retail System</div>
          <div className="hero-badges" aria-label="Highlights">
            <span>📊 Accurate Forecasts</span>
            <span>🛍️ Retail Ready</span>
            <span>⚡ Fast Insights</span>
          </div>
          <h1>
            Smart <span>Demand</span> Forecasting
            <br />
            for Modern Retail
          </h1>
          <p>
            Stop guessing. RetailIQ predicts what your customers buy next and
            explains the demand patterns behind each trend so you can stock,
            price, and plan with confidence.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/forecasts">
              Explore Forecasts
            </Link>
            <Link className="btn btn-secondary" to="/about">
              About Us
            </Link>
          </div>
        </div>

        <div className="hero-right">
          <h3>Core Capabilities</h3>
          <div className="hero-icon" aria-hidden="true">
            📦
          </div>
          <h2>
            From raw sales data
            <br />
            to <span>clear decisions</span>
          </h2>
          <ul>
            <li>Demand forecasting by SKU and category</li>
            <li>Promotion and seasonality impact analysis</li>
            <li>Action-ready inventory recommendations</li>
          </ul>
        </div>
      </section>

      <section className="features-strip">
        <article className="feature-card feature-one">
          <p className="feature-title">📈 Demand Forecasting</p>
          <p className="feature-text">SKU-level projections with explainable trends.</p>
        </article>
        <article className="feature-card feature-two">
          <p className="feature-title">🧠 Product Intelligence</p>
          <p className="feature-text">Top product movers and margin opportunities.</p>
        </article>
        <article className="feature-card feature-three">
          <p className="feature-title">⚡ Action Recommendations</p>
          <p className="feature-text">Promotion and replenishment signals for teams.</p>
        </article>
      </section>

      <section className="showcase">
        <div className="showcase-left">
          <p className="section-kicker">✨ Why Teams Choose RetailIQ</p>
          <h2>Built for practical retail execution, not just dashboards.</h2>
          <p>
            Every insight is designed to trigger an action. From weekly planning
            to day-to-day replenishment, RetailIQ helps your team move from data
            noise to confident decisions.
          </p>
          <div className="showcase-actions">
            <Link to="/about" className="card-link">
              About Us
            </Link>
            <Link to="/contact" className="next-btn">
              Contact Us
            </Link>
          </div>
        </div>
        <div className="showcase-right">
          <article className="insight-card insight-one">
            <h3>🗓️ Weekly Planner</h3>
            <p>Prioritize high-risk SKUs before demand spikes.</p>
          </article>
          <article className="insight-card insight-two">
            <h3>🎯 Promo Optimizer</h3>
            <p>Detect campaigns that lift revenue without margin loss.</p>
          </article>
          <article className="insight-card insight-three">
            <h3>🤝 Ops Alignment</h3>
            <p>Keep sales, inventory, and management on one signal.</p>
          </article>
          <article className="insight-card insight-four">
            <h3>🔁 Continuous Learning</h3>
            <p>Models improve with fresh data and feedback loops.</p>
          </article>
        </div>
      </section>

      <section className="cta-banner">
        <h2>🚀 Ready to modernize your retail decisions?</h2>
        <p>Create your account and start using real-time forecasting workflows today.</p>
        <div className="cta-actions">
          <Link to="/register" className="btn btn-primary">
            Create Account
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Sign In
          </Link>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-brand">
          <h3>RetailIQ</h3>
          <p>AI-powered retail intelligence for smarter growth.</p>
        </div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
        <div className="footer-meta">
          <p>support@retailiq.com</p>
          <p>+92 300 1234567</p>
          <p>© {new Date().getFullYear()} RetailIQ. All rights reserved.</p>
        </div>
      </footer>
    </PageLayout>
  );
}

export default Home;
