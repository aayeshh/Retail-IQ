import React from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import "./News.css";

function News() {
  return (
    <PageLayout contentClassName="news-page">
      <h1>
        Retail <span>News</span>
      </h1>
      <p className="subtitle">
        Latest updates from industry trends, market movement, and demand signals.
      </p>

      <div className="news-grid">
        <article className="news-card featured">
          <p className="tag">Market Update</p>
          <h3>Consumer essentials demand rises ahead of festive week</h3>
          <p>
            Regional demand forecasts indicate a higher basket value in urban
            stores. Teams should prioritize inventory for top 40 SKUs.
          </p>
        </article>

        <article className="news-card">
          <p className="tag">Supply Chain</p>
          <h3>Lead times improve for packaged goods suppliers</h3>
          <p>
            Average replenishment windows dropped from 11 to 8 days, reducing
            stockout risk for fast-moving categories.
          </p>
        </article>

        <article className="news-card">
          <p className="tag">Pricing</p>
          <h3>Competitor discounts trigger weekend price pressure</h3>
          <p>
            Recommended action: dynamic discount cap of 12% for priority
            categories while preserving margin on premium SKUs.
          </p>
        </article>

        <article className="news-card">
          <p className="tag">Customer Behavior</p>
          <h3>Bundle offers show strongest conversion in apparel</h3>
          <p>
            Cross-sell pairings increased conversion by 18% this month compared
            to standalone promotions.
          </p>
        </article>
      </div>
    </PageLayout>
  );
}

export default News;
