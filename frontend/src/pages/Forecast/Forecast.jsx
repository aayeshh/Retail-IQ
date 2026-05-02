import React, { useState } from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import { apiRequest } from "../../api/client";
import "./Forecast.css";

const FAMILY_OPTIONS = [
  "AUTOMOTIVE",
  "BABY CARE",
  "BEAUTY",
  "BEVERAGES",
  "BOOKS",
  "BREAD/BAKERY",
  "CELEBRATION",
  "CLEANING",
  "DAIRY",
  "DELI",
  "EGGS",
  "FROZEN FOODS",
  "GROCERY I",
  "GROCERY II",
  "HARDWARE",
  "HOME AND KITCHEN I",
  "HOME AND KITCHEN II",
  "HOME APPLIANCES",
  "HOME CARE",
  "LADIESWEAR",
  "LAWN AND GARDEN",
  "LINGERIE",
  "LIQUOR",
  "MAGAZINES",
  "MEATS",
  "PERSONAL CARE",
  "PET SUPPLIES",
  "PLAYERS AND ELECTRONICS",
  "POULTRY",
  "PREPARED FOODS",
  "PRODUCE",
  "SCHOOL AND OFFICE SUPPLIES",
  "SEAFOOD",
];

function getSalesBand(prediction) {
  if (prediction <= 0) {
    return {
      label: "Very Low Sales",
      message: "Sales are very low. Keep stock very carefully and avoid over-ordering.",
      tone: "very-low",
    };
  }
  if (prediction < 100) {
    return {
      label: "Low Sales",
      message: "Low sales expected. Maintain lean stock and monitor demand closely.",
      tone: "low",
    };
  }
  if (prediction < 1000) {
    return {
      label: "Moderate Sales",
      message: "Moderate sales expected. Keep balanced inventory for steady movement.",
      tone: "moderate",
    };
  }
  if (prediction <= 2000) {
    return {
      label: "Good Sales",
      message: "Good sales expected. Keep strong stock levels to prevent stock-outs.",
      tone: "good",
    };
  }
  return {
    label: "High Sales",
    message: "High sales expected. Increase inventory and prepare for fast turnover.",
    tone: "high",
  };
}

function Forecast() {
  const [storeNbr, setStoreNbr] = useState("1");
  const [family, setFamily] = useState("AUTOMOTIVE");
  const [onpromotion, setOnpromotion] = useState(0);
  const [date, setDate] = useState("2017-01-15");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function onPredict() {
    if (!storeNbr || !family || !date) {
      setError("Store number, family, and date are required.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await apiRequest("/api/forecast/predict", {
        method: "POST",
        body: JSON.stringify({
          store_nbr: Number(storeNbr),
          family,
          onpromotion: Number(onpromotion),
          date,
        }),
      });
      setResult(response);
    } catch (err) {
      setError(err.message || "Prediction failed.");
    } finally {
      setLoading(false);
    }
  }

  const numericPrediction =
    typeof result?.prediction === "number"
      ? result.prediction
      : typeof result?.predicted_sales === "number"
        ? result.predicted_sales
        : null;
  const salesBand = numericPrediction !== null ? getSalesBand(numericPrediction) : null;

  return (
    <PageLayout contentClassName="forecast-page">
      <h1>
        Sales <span>Forecast</span>
      </h1>
      <p className="subtitle">
        Enter store and product family details to get inventory guidance from prediction bands.
      </p>

      <div className="forecast-form-card forecast-card">
        <h3>Forecast Inputs</h3>
        <div className="forecast-form-grid">
          <label>
            Store Number
            <input
              type="number"
              min="1"
              value={storeNbr}
              onChange={(e) => setStoreNbr(e.target.value)}
              placeholder="e.g. 1"
            />
          </label>
          <label>
            Family
            <select value={family} onChange={(e) => setFamily(e.target.value)}>
              {FAMILY_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            On Promotion
            <select
              value={onpromotion}
              onChange={(e) => setOnpromotion(Number(e.target.value))}
            >
              <option value={0}>No (0)</option>
              <option value={1}>Yes (1)</option>
            </select>
          </label>
          <label>
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        </div>
        <button type="button" onClick={onPredict} disabled={loading}>
          {loading ? "Predicting..." : "Predict Sales"}
        </button>
      </div>

      {error && <p className="forecast-error">{error}</p>}

      {result && salesBand && (
        <div className={`forecast-result-card forecast-card ${salesBand.tone}`}>
          <div className="result-header">
            <h3>{salesBand.label}</h3>
            <span className="result-chip">{Math.round(numericPrediction)}</span>
          </div>
          <p className="hint">{salesBand.message}</p>
          <p className="sub-hint">
            Range logic: 0 or less = very low, 0-100 = low, 100-1000 = moderate, 1000-2000 = good, 2000+ = high.
          </p>
        </div>
      )}
    </PageLayout>
  );
}

export default Forecast;
