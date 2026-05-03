import React, { useEffect, useState } from "react";
import "./TopProducts.css";
import PageLayout from "../../components/PageLayout/PageLayout";
import { apiRequest } from "../../api/client";
import { loadCache, saveCache } from "../../utils/cache";

const TOP_PRODUCTS_CACHE_KEY = "retailiq_top_products_cache";

function TopProducts() {
  const cachedProducts = loadCache(TOP_PRODUCTS_CACHE_KEY) || [];
  const [products, setProducts] = useState(cachedProducts);
  const [loading, setLoading] = useState(cachedProducts.length === 0);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadTopProducts() {
      if (cachedProducts.length) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");

      try {
        const data = await apiRequest("/api/top-products");
        if (!isMounted) return;
        setProducts(data || []);
        saveCache(TOP_PRODUCTS_CACHE_KEY, data || []);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load top products");
      } finally {
        if (!isMounted) return;
        setLoading(false);
        setRefreshing(false);
      }
    }

    loadTopProducts();
    return () => {
      isMounted = false;
    };
  }, [cachedProducts.length]);

  return (
    <PageLayout contentClassName="top-products-page">
      <div className="tp-header-card">
        <h1>
          Top Products & <span>Performance</span>
        </h1>
        <p className="subtitle">Data-driven rankings of your best-selling items.</p>
      </div>
      {loading && <p>Loading top products...</p>}
      {!loading && refreshing && <p className="small-info">Showing cached products while refreshing...</p>}
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
