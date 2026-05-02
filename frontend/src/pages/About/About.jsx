import React from "react";
import "./About.css";
import PageLayout from "../../components/PageLayout/PageLayout";

function About() {
  return (
    <PageLayout contentClassName="help-page">
          <h1>
            Help & <span>User Guide</span>
          </h1>
          <p className="subtitle">Step-by-step instructions on how to use RetailIQ</p>

          <div className="guide-grid">
            <article className="guide-card">
              <p className="step">Step 01 🏠</p>
              <h3>Open Home Page</h3>
              <p>Start from the Home page and click Explore Dashboard.</p>
            </article>
            <article className="guide-card">
              <p className="step">Step 02 📊</p>
              <h3>View Dashboard</h3>
              <p>See total sales, products, promotions and forecast accuracy.</p>
            </article>
            <article className="guide-card">
              <p className="step">Step 03 🏷️</p>
              <h3>Check Forecasts</h3>
              <p>Go to the forecasts page for product-level prediction signals.</p>
            </article>
            <article className="guide-card">
              <p className="step">Step 04 🔎</p>
              <h3>Read Decomposition</h3>
              <p>Understand baseline demand, promotions and seasonal impact.</p>
            </article>
            <article className="guide-card">
              <p className="step">Step 05 ⚠️</p>
              <h3>Review Alerts</h3>
              <p>Visit cannibalization and risk sections for product conflicts.</p>
            </article>
            <article className="guide-card">
              <p className="step">Step 06 📢</p>
              <h3>Check Announcements</h3>
              <p>Read updates for datasets, model changes and forecast notes.</p>
            </article>
          </div>

          <div className="help-panels">
            <article className="faq-panel">
              <h2>
                Common <span>Questions</span>
              </h2>
              <div className="faq-item">
                <h4>How often are forecasts updated?</h4>
                <p>Every Monday automatically using the latest dataset.</p>
              </div>
              <div className="faq-item">
                <h4>What is cannibalization?</h4>
                <p>When a promo on one product reduces sales of related products.</p>
              </div>
              <div className="faq-item">
                <h4>Who can post announcements?</h4>
                <p>Admin team members can publish update cards and notices.</p>
              </div>
            </article>

            <article className="support-panel">
              <h2>Need More Help?</h2>
              <p>
                <strong>Project Admin:</strong> RetailIQ Team
              </p>
              <p>
                <strong>Email:</strong> admin@retailiq.com
              </p>
              <p>
                <strong>Documentation:</strong> GitHub Repository
              </p>
            </article>
          </div>
    </PageLayout>
  );
}

export default About;
