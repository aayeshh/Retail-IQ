import React, { useEffect, useState } from "react";
import "./Feedback.css";
import PageLayout from "../../components/PageLayout/PageLayout";
import { apiRequest } from "../../api/client";

function Feedback() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ text: "", type: "" });
  const [recentFeedback, setRecentFeedback] = useState([]);

  async function loadFeedback() {
    try {
      const all = await apiRequest("/api/feedback/all");
      setRecentFeedback((all || []).slice(0, 3));
    } catch (err) {
      setStatus({ text: err.message || "Failed to load feedback", type: "error" });
    }
  }

  useEffect(() => {
    loadFeedback();
  }, []);

  async function onSubmit() {
    if (!name.trim() || !message.trim()) {
      setStatus({ text: "Name and comments are required.", type: "error" });
      return;
    }

    setSubmitting(true);
    setStatus({ text: "", type: "" });
    try {
      await apiRequest("/api/feedback/submit", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          rating,
          category: "general",
        }),
      });
      setStatus({ text: "Saved to MongoDB successfully.", type: "success" });
      setName("");
      setEmail("");
      setMessage("");
      setRating(5);
      await loadFeedback();
    } catch (err) {
      setStatus({ text: err.message || "Failed to submit feedback", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageLayout contentClassName="feedback-page">
          <h1>Your Feedback & Suggestions</h1>
          <p className="subtitle">We're constantly improving, help us build a better tool.</p>
          <div className="fb-grid">
            <article>
              <h3>Step 01<br/>Rating</h3>
              <p>{Array.from({ length: rating }).map(() => "⭐").join(" ")}</p>
              <small>Overall Rating</small>
              <input
                type="range"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              />
            </article>
            <article>
              <h3>Step 02<br/>Comments</h3>
              <input
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <textarea
                placeholder="What did you like? What can we do better?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </article>
            <article>
              <h3>Step 03<br/>Recent Feedback</h3>
              {recentFeedback.map((item) => (
                <p className="light" key={item._id}>💡 {item.message}</p>
              ))}
            </article>
          </div>
          {status.text && <p className={`feedback-toast ${status.type}`}>{status.text}</p>}
          <div className="fb-actions"><button onClick={onSubmit} disabled={submitting}>{submitting ? "Submitting..." : "Submit Feedback"}</button></div>
    </PageLayout>
  );
}

export default Feedback;
