import React, { useMemo, useState } from "react";
import { BrowserRouter, Navigate, NavLink, Route, Routes } from "react-router-dom";
import About from "./pages/About/About";
import AboutUs from "./pages/AboutUs/AboutUs";
import Announcements from "./pages/Announcements/Announcements";
import Contact from "./pages/Contact/Contact";
import Feedback from "./pages/Feedback/Feedback";
import Forecast from "./pages/Forecast/Forecast";
import Forecasts from "./pages/Forecasts/Forecasts";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import News from "./pages/News/News";
import Recommendations from "./pages/Recommendations/Recommendations";
import Register from "./pages/Register/Register";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import SalesTrend from "./pages/SalesTrend/SalesTrend";
import TopProducts from "./pages/TopProducts/TopProducts";

function AppContent() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("retailiq_user");
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = Boolean(user);

  const privateLinks = useMemo(
    () => [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/forecasts", label: "Forecast" },
      { to: "/salestrend", label: "Sales" },
      { to: "/topproducts", label: "Products" },
      { to: "/recommendations", label: "Recommendations" },
      { to: "/announcements", label: "Announcements" },
      { to: "/news", label: "News" },
      { to: "/feedback", label: "Feedback" },
      { to: "/help", label: "Help" },
    ],
    []
  );

  function handleLogin(userData) {
    setUser(userData);
    localStorage.setItem("retailiq_user", JSON.stringify(userData));
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("retailiq_user");
  }

  function protectedElement(element) {
    return isAuthenticated ? element : <Navigate to="/" replace />;
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">RetailIQ</div>
        <nav className="site-nav" aria-label="Main navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/contact">Contact Us</NavLink>
          {!isAuthenticated && <NavLink to="/login">Login</NavLink>}
          {isAuthenticated &&
            privateLinks.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}
          {isAuthenticated && (
            <button type="button" className="nav-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLogin} />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={protectedElement(<Forecasts />)} />
        <Route path="/forecasts" element={protectedElement(<Forecast />)} />
        <Route path="/salestrend" element={protectedElement(<SalesTrend />)} />
        <Route path="/topproducts" element={protectedElement(<TopProducts />)} />
        <Route path="/recommendations" element={protectedElement(<Recommendations />)} />
        <Route path="/announcements" element={protectedElement(<Announcements />)} />
        <Route path="/news" element={protectedElement(<News />)} />
        <Route path="/feedback" element={protectedElement(<Feedback />)} />
        <Route path="/help" element={protectedElement(<About />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
