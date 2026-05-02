import React from "react";
import { Link } from "react-router-dom";
import PageLayout from "../../components/PageLayout/PageLayout";
import "./AboutUs.css";

function AboutUs() {
  return (
    <PageLayout contentClassName="about-us-page" showSidebar={false}>
      <section className="about-hero">
        <div className="about-hero-left">
          <p className="about-kicker">About RetailIQ</p>
          <h1>
            We help retail teams
            <br />
            turn uncertainty into
            <span> confident action.</span>
          </h1>
          <p>
            RetailIQ is built for modern retail operations where demand shifts
            fast and planning windows are short. We combine forecasting,
            product intelligence, and execution-ready recommendations to keep
            teams ahead of change.
          </p>
          <div className="about-hero-actions">
            <Link to="/login" className="about-btn primary">
              Login
            </Link>
            <Link to="/contact" className="about-btn secondary">
              Contact Us
            </Link>
          </div>
        </div>
        <div className="about-hero-right">
          <div className="about-visual">📊</div>
          <h3>Retail Intelligence That Works Daily</h3>
          <ul>
            <li>Forecast demand by SKU and category</li>
            <li>Measure promotion impact with clarity</li>
            <li>Support inventory and sales alignment</li>
          </ul>
        </div>
      </section>

      <section className="about-story">
        <article>
          <h2>🌍 Our Mission</h2>
          <p>
            Empower retailers to make smarter, faster, and more profitable
            decisions using practical AI that is understandable and trusted by
            business teams.
          </p>
        </article>
        <article>
          <h2>🧭 Our Vision</h2>
          <p>
            Build a connected decision platform where planning, forecasting,
            and execution operate in one loop for every store and every product.
          </p>
        </article>
      </section>

      <section className="about-pillars">
        <h2>💡 What Makes Us Different</h2>
        <div className="pillars-grid">
          <article>
            <h3>Explainable Forecasts</h3>
            <p>
              We show not only predictions but also the factors behind them, so
              teams can trust and act on insights with confidence.
            </p>
          </article>
          <article>
            <h3>Action Over Noise</h3>
            <p>
              We prioritize recommendations that are easy to execute, reducing
              dashboard overload and helping teams focus on impact.
            </p>
          </article>
          <article>
            <h3>Built for Collaboration</h3>
            <p>
              Sales, inventory, and leadership can work from a shared view of
              demand signals, alerts, and operational priorities.
            </p>
          </article>
        </div>
      </section>
    </PageLayout>
  );
}

export default AboutUs;
