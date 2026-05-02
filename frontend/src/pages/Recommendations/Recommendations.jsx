import React, { useEffect, useState } from "react";
import "./Recommendations.css";
import PageLayout from "../../components/PageLayout/PageLayout";
import { apiRequest } from "../../api/client";

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecommendations() {
      setLoading(true);
      setError("");
      try {
        const data = await apiRequest("/api/recommendations");
        setRecommendations(data || []);
      } catch (err) {
        setError(err.message || "Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, []);

  return (
    <PageLayout contentClassName="recommendations-page">
      <h1>
        Product <span>Recommendations</span>
      </h1>
      <p className="subtitle">AI-driven suggestions to improve conversion, margin, and stock health.</p>
      {loading && <p>Loading recommendations...</p>}
      {error && <p className="state-message">{error}</p>}
      {!loading && !error && recommendations.length === 0 && (
        <p className="state-message">No data available. Please upload dataset first.</p>
      )}

      {recommendations.length > 0 && (
        <div className="rec-grid">
          {recommendations.map((item) => (
            <article key={item.title} className="rec-card">
              <h3>{item.title}</h3>
              <p>{item.message}</p>
            </article>
          ))}
        </div>
      )}
    </PageLayout>
  );
}

export default Recommendations;
