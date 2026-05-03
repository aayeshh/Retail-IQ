## 🔍 Overview

**RetailIQ** is a full-stack retail analytics platform that goes beyond simple number forecasting. It helps retail businesses *understand why* demand fluctuates — not just *what* it will be.

Traditional forecasting tools give you a number. RetailIQ gives you the story behind it.

By combining historical sales data with machine learning models and interactive visualizations, RetailIQ enables retail managers to make confident, data-driven decisions around:

- 📦 **Inventory management** — stock the right products at the right time
- 📣 **Promotion planning** — understand which promotions actually drive demand
- 📊 **Sales strategy** — identify seasonal trends and top-performing product lines

> Built as a capstone full-stack project integrating ML-driven analytics with a modern React frontend and a Flask/MongoDB backend.

---

## ✨ Key Features

### 🔐 User Authentication
Secure registration and login system ensuring only authorized users can access forecasting tools and dashboards.

### 📊 Dashboard Overview
A high-level control center displaying key retail KPIs — total sales, product count, promotion statistics, and forecast summaries — through visual cards and charts.

### 📈 Sales Trend Visualization
Interactive line charts and graphs depicting daily, weekly, and monthly sales patterns to surface seasonality, anomalies, and demand shifts over time.

### 🎯 Promotion Impact Analysis
Side-by-side comparison of promotional vs. non-promotional sales periods, helping retailers answer the real question: *Did the promotion actually work?*

### 🗓️ Time Filter Options
Flexible date-range filtering across weekly, monthly, and yearly views — making every analysis instantly adjustable to your business context.

### 🏆 Top Performing Products
Ranked tables and charts showcasing the top 5 best-sellers and highest-growth products based on actual and forecasted performance.

### 💡 Recommendations Engine
AI-generated business recommendations derived from trend and forecast analysis — e.g., *"Stock product X heading into Q4"* or *"Consider discontinuing Y in low-demand months."*

### 📢 Announcements
Admin-controlled notice board for broadcasting system updates, new dataset availability, or model retraining events to all platform users.

### 📰 News & Insights
Curated retail trend articles and demand forecasting tips, adding professional context and continuous learning to the platform experience.

### 💬 Feedback System
In-app feedback submission for users to report issues, suggest improvements, or comment on forecast accuracy — stored in MongoDB for admin review.

### 📖 Help / User Guide
A built-in documentation page covering all major platform features, making onboarding smooth for new users.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, CSS Modules |
| **Backend** | Python, Flask (REST API) |
| **Database** | MongoDB (with Mongoose-style schemas) |
| **ML / Analytics** | Python (scikit-learn, pandas, numpy) |
| **Auth** | JWT / Session-based Authentication |
| **Data Viz** | Recharts / Chart.js |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Client (Browser)                  │
│           React + Vite  ·  Interactive UI           │
└───────────────────────┬─────────────────────────────┘
                        │  HTTP / REST API
┌───────────────────────▼─────────────────────────────┐
│               Flask Backend (Python)                │
│  Auth · Analytics · Forecasting · Recommendations   │
└──────────────┬────────────────────┬─────────────────┘
               │                    │
┌──────────────▼──────┐   ┌─────────▼───────────────┐
│   MongoDB Database  │   │    ML Models (Python)   │
│  Users · Sales Data │   │  Demand Forecasting ·   │
│  Feedback · Alerts  │   │  Promotion Analysis     │
└─────────────────────┘   └─────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- MongoDB (local or Atlas connection string)

### 1. Clone the Repository

```bash
git clone https://github.com/aayeshh/retailiq.git
cd retailiq
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_flask_secret_key
JWT_SECRET=your_jwt_secret
```

Start the Flask server:

```bash
flask run
# API running at http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

---

## 📁 Project Structure

```
retailiq/
├── backend/
│   ├── app.py                  # Flask entry point
│   ├── routes/
│   │   ├── auth.py             # Login & registration
│   │   ├── dashboard.py        # KPI & overview endpoints
│   │   ├── sales.py            # Sales trend data
│   │   ├── promotions.py       # Promotion impact analysis
│   │   ├── products.py         # Top products & forecasts
│   │   ├── recommendations.py  # ML-based suggestions
│   │   ├── feedback.py         # User feedback
│   │   └── announcements.py    # Admin announcements
│   ├── models/                 # MongoDB schemas
│   ├── ml/                     # Forecasting & analytics models
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SalesTrends.jsx
│   │   │   ├── PromotionAnalysis.jsx
│   │   │   ├── TopProducts.jsx
│   │   │   ├── Recommendations.jsx
│   │   │   ├── Announcements.jsx
│   │   │   ├── NewsInsights.jsx
│   │   │   ├── Feedback.jsx
│   │   │   └── Help.jsx
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # Auth & global state
│   │   └── App.jsx
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 👥 Team

This project was built with 💙 by:

| Name | Role |
|---|---|
| **Ayesha Khalid** | Full Stack Developer — Backend, ML Integration, Auth |
| **Uma e Rubab** | Full Stack Developer — Frontend, UI/UX, Dashboard Design |

---




*RetailIQ — Because data should explain itself.*

⭐ If you found this project helpful, consider giving it a star!

</div>
