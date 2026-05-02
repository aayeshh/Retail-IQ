import React from "react";
import PageLayout from "../../components/PageLayout/PageLayout";

function Contact() {
  return (
    <PageLayout showSidebar={false}>
      <h1>
        Contact <span>Us</span>
      </h1>
      <p className="subtitle">We are here to help with support, onboarding, and product queries.</p>

      <div className="stats-grid">
        <article>
          <p className="icon">📧</p>
          <h4>Email</h4>
          <h3>support@retailiq.com</h3>
          <small>Response in 24 hours</small>
        </article>
        <article>
          <p className="icon">📞</p>
          <h4>Phone</h4>
          <h3>+92 300 1234567</h3>
          <small>Mon to Fri, 9am to 6pm</small>
        </article>
        <article>
          <p className="icon">🏢</p>
          <h4>Office</h4>
          <h3>Lahore, Pakistan</h3>
          <small>RetailIQ Product Team</small>
        </article>
      </div>
    </PageLayout>
  );
}

export default Contact;
