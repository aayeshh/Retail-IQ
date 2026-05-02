import React, { useEffect, useState } from "react";
import "./Announcements.css";
import PageLayout from "../../components/PageLayout/PageLayout";
import { apiRequest } from "../../api/client";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const data = await apiRequest("/api/announcements/all");
        setAnnouncements(data || []);
      } catch (err) {
        setError(err.message || "Failed to load announcements");
      } finally {
        setLoading(false);
      }
    }
    loadAnnouncements();
  }, []);

  return (
    <PageLayout contentClassName="announcements-page">
          <h1>
            System <span>Announcements</span>
          </h1>
          <p className="subtitle">Latest Updated from Admin - Notice Board</p>

      {loading && <p>Loading announcements...</p>}
      {error && <p>{error}</p>}
      <div className="notice-list">
        {announcements.map((item, index) => {
          const colorClass =
            index % 3 === 0 ? "orange" : index % 3 === 1 ? "green" : "gray";
          const tagClass =
            index % 3 === 0 ? "orange-tag" : index % 3 === 1 ? "green-tag" : "gray-tag";
          return (
            <article className="notice-item" key={item._id}>
              <div className={`badge-icon ${colorClass}`}>📢</div>
              <div className="notice-text">
                <h3>{item.title}</h3>
                <p>{item.message}</p>
              </div>
              <span className={`type-badge ${tagClass}`}>
                {(item.created_by || "admin").toUpperCase()}
              </span>
            </article>
          );
        })}
      </div>
    </PageLayout>
  );
}

export default Announcements;
