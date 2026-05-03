import React from "react";
import { NavLink } from "react-router-dom";

const sideLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/forecasts", label: "Forecast" },
  { to: "/salestrend", label: "Sales Trend" },
  { to: "/topproducts", label: "Top Products" },
  { to: "/recommendations", label: "Recommendations" },
  { to: "/announcements", label: "Announcements" },
  { to: "/news", label: "News" },
  { to: "/feedback", label: "Feedback" },
  { to: "/help", label: "Help" },
];

function PageLayout({ children, contentClassName = "", showSidebar = true }) {
  return (
    <main className="inner-page">
      <div className={`inner-body ${showSidebar ? "" : "no-sidebar"}`.trim()}>
        {showSidebar && (
          <aside className="left-menu" aria-label="Page navigation">
            {sideLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end>
                {link.label}
              </NavLink>
            ))}
          </aside>
        )}
        <section className={`inner-content ${contentClassName}`.trim()}>
          {children}
        </section>
      </div>
    </main>
  );
}

export default PageLayout;
