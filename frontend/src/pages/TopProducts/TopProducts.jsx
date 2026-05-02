import React, { useEffect, useState } from "react";
import "./TopProducts.css";
import PageLayout from "../../components/PageLayout/PageLayout";
import { apiRequest } from "../../api/client";

function TopProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTopProducts() {
      setLoading(true);
      setError("");
      try {
        const data = await apiRequest("/api/top-products");
        setProducts(data || []);
      } catch (err) {
        setError(err.message || "Failed to load top products");
      } finally {
        setLoading(false);
      }
    }
    loadTopProducts();
  }, []);

  return (
    <PageLayout contentClassName="top-products-page">
      <div className="tp-header-card">
        <h1>
          Top Products & <span>Performance</span>
        </h1>
        <p className="subtitle">Data-driven rankings of your best-selling items.</p>
      </div>
      {loading && <p>Loading top products...</p>}
      {error && <p className="state-message">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="state-message">No data available. Please upload dataset first.</p>
      )}

      {products.length > 0 && (
        <>
      <div className="tp-highlights">
        <article>
          <p>Top Performer</p>
          <h3>{products[0]?.product_name}</h3>
        </article>
        <article>
          <p>Top Sales Value</p>
          <h3>{Number(products[0]?.total_sales || 0).toLocaleString()}</h3>
        </article>
        <article>
          <p>Total Ranked Products</p>
          <h3>{products.length}</h3>
        </article>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Total Sales</th>
              <th>Rank</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={`${product.product_name}-${index}`}>
                <td>{product.product_name}</td>
                <td>{Number(product.total_sales || 0).toLocaleString()}</td>
                <td>#{product.rank || index + 1}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bar-chart-card">
        <h3>Top 5 Sales Comparison</h3>
        <div className="bar-list">
          {products.map((product) => (
            <div key={product.product_name} className="bar-row">
              <span className="bar-label">{product.product_name}</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${Math.max(
                      5,
                      (Number(product.total_sales || 0) /
                        Number(products[0]?.total_sales || 1)) *
                        100
                    )}%`,
                  }}
                />
              </div>
              <span className="bar-value">{Number(product.total_sales || 0).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      </>
      )}
    </PageLayout>
  );
}

export default TopProducts;
