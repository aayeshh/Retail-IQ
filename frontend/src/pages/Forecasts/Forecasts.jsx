import React, { useEffect, useState } from "react";
import "./Forecasts.css";
import PageLayout from "../../components/PageLayout/PageLayout";
import { apiRequest } from "../../api/client";

const DASHBOARD_CACHE_KEY = "retailiq_dashboard_overview_cache";

function loadCachedDashboard() {
  try {
    const cached = localStorage.getItem(DASHBOARD_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function saveCachedDashboard(data) {
  try {
    localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage failures.
  }
}

function Forecasts() {
  const cachedData = loadCachedDashboard();
  const [data, setData] = useState(cachedData);
  const [loading, setLoading] = useState(!cachedData);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      if (cachedData) {
        setRefreshing(true);
      }

      try {
        const result = await apiRequest("/api/dashboard/overview");
        if (!isMounted) return;
        setData(result);
        saveCachedDashboard(result);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load dashboard data");
      } finally {
        if (!isMounted) return;
        setLoading(false);
        setRefreshing(false);
      }
    }

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, [cachedData]);

  const totalSales = data?.total_sales ?? 0;
  const totalProducts = data?.total_products ?? 0;
  const avgRating = data?.average_rating ?? 0;
  const totalFeedback = data?.total_feedback ?? 0;
  const promoData = data?.sales_by_promotion || {
    with_promotion: 0,
    without_promotion: 0,
  };

  return (
    <PageLayout>
      <h1>
        Dashboard <span>Overview</span>
      </h1>
      <p className="subtitle">Smart Retail Forecasting - Weekly Snapshot</p>
      {loading && <p>Loading dashboard data...</p>}
      {!loading && refreshing && <p className="small-info">Showing cached dashboard data while refreshing...</p>}
      {error && <p>{error}</p>}

      <div className="stats-grid">
        <article>
          <p className="icon">🛒</p>
          <h4>Total Sales</h4>
          <h3>Rs. {Number(totalSales).toLocaleString()}</h3>
          <small>Live from MongoDB</small>
        </article>
        <article>
          <p className="icon">📦</p>
          <h4>Total Products</h4>
          <h3>{totalProducts}</h3>
          <small>Product catalog size</small>
        </article>
        <article>
          <p className="icon">💬</p>
          <h4>Avg Feedback Rating</h4>
          <h3>{Number(avgRating).toFixed(2)}</h3>
          <small>{totalFeedback} feedback entries</small>
        </article>
      </div>

      <div className="insights-grid">
        <article className="chart-card">
          <h3>
            Monthly <span>Sales Trend</span>
          </h3>
          <div className="mock-bars">
            <div>
              <span className="top"></span>
              <span className="bottom"></span>
              <small>July</small>
            </div>
            <div>
              <span className="top tall"></span>
              <span className="bottom tall"></span>
              <small>August</small>
            </div>
            <div>
              <span className="top"></span>
              <span className="bottom"></span>
              <small>September</small>
            </div>
            <div>
              <span className="top tall"></span>
              <span className="bottom"></span>
              <small>October</small>
            </div>
          </div>
        </article>

        <article className="decompose-card">
          <h3>
            Promotion <span>Impact</span>
          </h3>
          <div className="row">
            <p>🏷️ With Promotion</p>
            <strong>{promoData.with_promotion}</strong>
          </div>
          <div className="line line-85"></div>
          <div className="row">
            <p>📌 Without Promotion</p>
            <strong>{promoData.without_promotion}</strong>
          </div>
          <div className="line line-67"></div>
          <div className="row">
            <p>⚠️ Total Feedback</p>
            <strong>{totalFeedback}</strong>
          </div>
          <div className="line line-45"></div>
        </article>
      </div>
    </PageLayout>
  );
}

export default Forecasts;
