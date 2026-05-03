import React, { useEffect, useMemo, useState } from "react";
import "./SalesTrend.css";
import PageLayout from "../../components/PageLayout/PageLayout";
import { apiRequest } from "../../api/client";
import { loadCache, saveCache } from "../../utils/cache";

const SALES_TREND_CACHE_KEY = (interval) => `retailiq_sales_trend_cache_${interval}`;
const INTERVAL_LABELS = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};
const INTERVALS = ["daily", "weekly", "monthly"];

const initialCache = {
  daily: loadCache(SALES_TREND_CACHE_KEY("daily")) || [],
  weekly: loadCache(SALES_TREND_CACHE_KEY("weekly")) || [],
  monthly: loadCache(SALES_TREND_CACHE_KEY("monthly")) || [],
};
const initialLoaded = {
  daily: loadCache(SALES_TREND_CACHE_KEY("daily")) !== null,
  weekly: loadCache(SALES_TREND_CACHE_KEY("weekly")) !== null,
  monthly: loadCache(SALES_TREND_CACHE_KEY("monthly")) !== null,
};

function SalesTrend() {
  const [interval, setInterval] = useState("monthly");
  const [salesTrendCache, setSalesTrendCache] = useState(initialCache);
  const [loadedIntervals, setLoadedIntervals] = useState(initialLoaded);
  const [loading, setLoading] = useState(() => !initialLoaded.monthly);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const salesTrends = salesTrendCache[interval] || [];

  useEffect(() => {
    let isMounted = true;
    setError("");
    setRefreshing(true);

    async function loadAllIntervals() {
      const results = await Promise.all(
        INTERVALS.map(async (intervalName) => {
          const cacheKey = SALES_TREND_CACHE_KEY(intervalName);
          try {
            const data = await apiRequest(`/api/sales-trend?interval=${intervalName}`);
            saveCache(cacheKey, data || []);
            return { intervalName, data: data || [] };
          } catch (err) {
            return { intervalName, error: err };
          }
        })
      );

      if (!isMounted) {
        return;
      }

      setSalesTrendCache((prev) => {
        const next = { ...prev };
        results.forEach((result) => {
          if (result.data) {
            next[result.intervalName] = result.data;
          }
        });
        return next;
      });

      setLoadedIntervals((prev) => {
        const next = { ...prev };
        results.forEach((result) => {
          if (result.data) {
            next[result.intervalName] = true;
          }
        });
        return next;
      });

      const failed = results.find((result) => result.error);
      if (failed) {
        setError(failed.error.message || "Failed to load sales trend");
      }

      setLoading(false);
      setRefreshing(false);
    }

    loadAllIntervals();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setLoading(!loadedIntervals[interval]);
  }, [interval, loadedIntervals]);

  const points = useMemo(() => {
    if (!salesTrends.length) {
      return "";
    }
    const width = 800; // inner width
    const height = 200; // inner height
    const yAxisOffset = 100; // more left padding for y-axis labels
    const maxSales = Math.max(...salesTrends.map((item) => Number(item.sales || 0)), 1);
    const stepX = salesTrends.length > 1 ? width / (salesTrends.length - 1) : width;

    return salesTrends
      .map((item, index) => {
        const x = Math.round(index * stepX + yAxisOffset);
        const y = Math.round(height - (Number(item.sales || 0) / maxSales) * height + 20);
        return `${x},${y}`;
      })
      .join(" ");
  }, [salesTrends]);

  const totalSales = useMemo(() => {
    return salesTrends.reduce((sum, item) => sum + Number(item.sales || 0), 0);
  }, [salesTrends]);

  const averageSales = useMemo(() => {
    if (!salesTrends.length) {
      return 0;
    }
    return totalSales / salesTrends.length;
  }, [salesTrends, totalSales]);

  const maxVal = Math.max(...salesTrends.map(it => Number(it.sales || 0)), 1);

  return (
    <PageLayout contentClassName="sales-trend-page">
      <div className="trend-header-card">
        <h1>
          Sales Trend <span>Analytics</span>
        </h1>
        <p className="subtitle">Date vs sales trend from uploaded dataset.</p>
      </div>

      <div className="trend-toolbar">
        <label htmlFor="sales-interval-select">Time Filter</label>
        <select
          id="sales-interval-select"
          value={interval}
          onChange={(event) => setInterval(event.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {loading && <p>Loading sales trend...</p>}
      {!loading && refreshing && <p className="small-info">Showing cached sales trend while refreshing...</p>}
      {error && <p className="state-message">{error}</p>}

      {!loading && !error && salesTrends.length === 0 && (
        <p className="state-message">No data available. Please upload dataset first.</p>
      )}

      {!loading && !error && salesTrends.length > 0 && (
        <div className="line-chart-card">
          <div className="stat-grid">
            <article>
              <p>Total Sales</p>
              <h4>{totalSales.toLocaleString()}</h4>
            </article>
            <article>
              <p>Periods</p>
              <h4>{salesTrends.length}</h4>
            </article>
            <article>
              <p>Average / Period</p>
              <h4>{Math.round(averageSales).toLocaleString()}</h4>
            </article>
          </div>
          <h3>Sales Over Time</h3>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <svg viewBox="0 0 900 280" role="img" aria-label="Sales trend line chart" style={{ height: 'auto' }}>
              {/* Axes */}
              <line x1="100" y1="20" x2="100" y2="220" stroke="#ccc" strokeWidth="1" />
              <line x1="100" y1="220" x2="860" y2="220" stroke="#ccc" strokeWidth="1" />
              
              {/* Y Axis Labels */}
              <text x="90" y="25" textAnchor="end" fontSize="12" fill="#666">{Math.round(maxVal).toLocaleString()}</text>
              <text x="90" y="120" textAnchor="end" fontSize="12" fill="#666">{Math.round(maxVal / 2).toLocaleString()}</text>
              <text x="90" y="220" textAnchor="end" fontSize="12" fill="#666">0</text>
              <text x="20" y="120" transform="rotate(-90 20 120)" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">Sales ($)</text>

              {/* X Axis Label */}
              <text x="480" y="274" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">Time ({INTERVAL_LABELS[interval]})</text>
              
              {/* Data Line */}
              <polyline points={points} />

              {/* Data points (dots) */}
              {salesTrends.map((item, index) => {
                const width = 800;
                const height = 200;
                const yAxisOffset = 100;
                const stepX = salesTrends.length > 1 ? width / (salesTrends.length - 1) : width;
                const x = Math.round(index * stepX + yAxisOffset);
                const y = Math.round(height - (Number(item.sales || 0) / maxVal) * height + 20);
                return <circle key={index} cx={x} cy={y} r="4" fill="#f4b12d" />;
              })}
            </svg>
          </div>
          <p className="summary-text" style={{ textAlign: 'center' }}>
            Total Sales: <strong>{totalSales.toLocaleString()}</strong> across{" "}
            <strong>{salesTrends.length}</strong> periods
          </p>
          <div className="trend-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Sales</th>
                </tr>
              </thead>
              <tbody>
                {salesTrends.map((item) => (
                  <tr key={item.period}>
                    <td>{item.period}</td>
                    <td>{Number(item.sales || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

export default SalesTrend;
