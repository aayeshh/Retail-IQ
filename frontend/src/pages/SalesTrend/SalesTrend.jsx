import React, { useEffect, useMemo, useState } from "react";
import "./SalesTrend.css";
import PageLayout from "../../components/PageLayout/PageLayout";
import { apiRequest } from "../../api/client";

function SalesTrend() {
  const [interval, setInterval] = useState("monthly");
  const [salesTrends, setSalesTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSales() {
      setLoading(true);
      setError("");
      try {
        const data = await apiRequest(`/api/sales-trend?interval=${interval}`);
        setSalesTrends(data || []);
      } catch (err) {
        setError(err.message || "Failed to load sales trend");
      } finally {
        setLoading(false);
      }
    }
    loadSales();
  }, [interval]);

  const points = useMemo(() => {
    if (!salesTrends.length) {
      return "";
    }
    const width = 800; // inner width
    const height = 200; // inner height
    const maxSales = Math.max(...salesTrends.map((item) => Number(item.sales || 0)), 1);
    const stepX = salesTrends.length > 1 ? width / (salesTrends.length - 1) : width;

    return salesTrends
      .map((item, index) => {
        const x = Math.round(index * stepX + 60); // offset for Y label
        const y = Math.round(height - (Number(item.sales || 0) / maxSales) * height + 20); // offset for top
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

      {loading && <p>Loading sales trend...</p>}
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
              <line x1="60" y1="20" x2="60" y2="220" stroke="#ccc" strokeWidth="1" />
              <line x1="60" y1="220" x2="860" y2="220" stroke="#ccc" strokeWidth="1" />
              
              {/* Y Axis Labels */}
              <text x="50" y="25" textAnchor="end" fontSize="12" fill="#666">{Math.round(maxVal).toLocaleString()}</text>
              <text x="50" y="120" textAnchor="end" fontSize="12" fill="#666">{Math.round(maxVal/2).toLocaleString()}</text>
              <text x="50" y="220" textAnchor="end" fontSize="12" fill="#666">0</text>
              <text x="15" y="120" transform="rotate(-90 15,120)" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">Sales ($)</text>

              {/* X Axis Label */}
              <text x="460" y="265" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">Time (Monthly)</text>
              
              {/* Data Line */}
              <polyline points={points} />

              {/* Data points (dots) */}
              {salesTrends.map((item, index) => {
                const width = 800;
                const height = 200;
                const stepX = salesTrends.length > 1 ? width / (salesTrends.length - 1) : width;
                const x = Math.round(index * stepX + 60);
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
