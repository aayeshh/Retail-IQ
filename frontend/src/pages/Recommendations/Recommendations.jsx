import React, { useEffect, useState } from "react";
import "./Recommendations.css";
import PageLayout from "../../components/PageLayout/PageLayout";
import { apiRequest } from "../../api/client";
import { loadCache, saveCache } from "../../utils/cache";

const RECOMMENDATIONS_CACHE_KEY = "retailiq_recommendations_cache";

function Recommendations() {
  const cachedRecommendations = loadCache(RECOMMENDATIONS_CACHE_KEY) || [];
  const [recommendations, setRecommendations] = useState(cachedRecommendations);
  const [loading, setLoading] = useState(cachedRecommendations.length === 0);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadRecommendations() {
      if (cachedRecommendations.length) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");
      try {
        const data = await apiRequest("/api/recommendations");
        if (!isMounted) return;
        setRecommendations(data || []);
        saveCache(RECOMMENDATIONS_CACHE_KEY, data || []);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load recommendations");
      } finally {
        if (!isMounted) return;
        setLoading(false);
        setRefreshing(false);
      }
    }

    loadRecommendations();
    return () => {
      isMounted = false;
    };
  }, [cachedRecommendations.length]);

  return (
    <PageLayout contentClassName="recommendations-page">
      <h1>
        Product <span>Recommendations</span>
      </h1>
      <p className="subtitle">AI-driven suggestions to improve conversion, margin, and stock health.</p>
      {loading && <p>Loading recommendations...</p>}
      {!loading && refreshing && <p className="small-info">Showing cached recommendations while refreshing...</p>}
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
