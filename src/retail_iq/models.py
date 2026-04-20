import numpy as np
import pandas as pd
from typing import Tuple, List, Dict, Optional
import json
from pathlib import Path


class GDLinearRegressor:
    """
    Linear Regression with Gradient Descent from scratch (NumPy only).
    Supports L1 (Lasso) and L2 (Ridge) regularization.
    Target: log1p(sales), predictions: expm1.
    """

    def __init__(self, learning_rate: float = 0.001, iterations: int = 1000,
                 l1_penalty: float = 0.0, l2_penalty: float = 0.0,
                 random_state: int = 42):
        self.lr = learning_rate
        self.iterations = iterations
        self.l1 = l1_penalty
        self.l2 = l2_penalty
        self.random_state = random_state
        self.theta: Optional[np.ndarray] = None
        self.loss_history: List[float] = []
        self.feature_means_: Optional[np.ndarray] = None
        self.feature_stds_: Optional[np.ndarray] = None

    def _normalize(self, X: np.ndarray, fit: bool = True) -> np.ndarray:
        """Z-score normalization."""
        if fit:
            self.feature_means_ = np.mean(X, axis=0)
            self.feature_stds_ = np.std(X, axis=0)
            self.feature_stds_ = np.where(self.feature_stds_ == 0, 1, self.feature_stds_)
        return (X - self.feature_means_) / self.feature_stds_

    def fit(self, X: np.ndarray, y: np.ndarray) -> 'GDLinearRegressor':
        """
        Fit model. X: (n_samples, n_features), y: raw sales values.
        Internally transforms y -> log1p(y).
        """
        np.random.seed(self.random_state)
        X_norm = self._normalize(X, fit=True)
        y_log = np.log1p(y)

        m, n = X_norm.shape
        self.theta = np.zeros(n)
        self.loss_history = []

        for i in range(self.iterations):
            preds = X_norm @ self.theta
            errors = preds - y_log

            # Gradient with L2 (Ridge) and L1 (Lasso) regularization
            l2_term = (self.l2 / m) * self.theta
            l1_term = (self.l1 / m) * np.sign(self.theta)
            gradient = (2 / m) * (X_norm.T @ errors) + l2_term + l1_term

            self.theta -= self.lr * gradient
            mse = np.mean(errors ** 2)
            self.loss_history.append(mse)

        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Predict raw sales values (inverse of log1p)."""
        if self.theta is None:
            raise ValueError("Model not fitted. Call fit() first.")
        X_norm = self._normalize(X, fit=False)
        preds_log = X_norm @ self.theta
        return np.expm1(preds_log)

    def get_params(self) -> Dict:
        return {
            'learning_rate': self.lr,
            'iterations': self.iterations,
            'l1_penalty': self.l1,
            'l2_penalty': self.l2,
            'random_state': self.random_state
        }


class SeasonalNaive:
    """
    Seasonal Naive baseline: predict last year's same day value.
    Uses 365-day lag within each (store_nbr, family) group.
    """

    def __init__(self, lag_days: int = 365):
        self.lag_days = lag_days
        self.last_values_: Dict[Tuple[int, str], float] = {}

    def fit(self, df: pd.DataFrame) -> 'SeasonalNaive':
        """
        Store last observed value per (store_nbr, family) for forecasting.
        df must have: store_nbr, family, date, sales
        """
        df = df.sort_values(['store_nbr', 'family', 'date'])
        grouped = df.groupby(['store_nbr', 'family'])

        for (store, family), group in grouped:
            last_row = group.iloc[-self.lag_days:]
            if len(last_row) >= self.lag_days:
                self.last_values_[(store, family)] = last_row.iloc[-1]['sales']

        return self

    def predict(self, df: pd.DataFrame) -> pd.Series:
        """
        Generate predictions by looking up 365-day lag.
        Returns Series aligned with df index.
        """
        df = df.copy()
        df['pred'] = df.groupby(['store_nbr', 'family'])['sales'].shift(self.lag_days)
        return df['pred']


class ModelPersistence:
    """Handle save/load with verification."""

    @staticmethod
    def save_model(model, path: Path, params_path: Optional[Path] = None):
        """Save model using joblib, optionally save params as JSON."""
        import joblib
        joblib.dump(model, path)

        if params_path and hasattr(model, 'get_params'):
            with open(params_path, 'w') as f:
                json.dump(model.get_params(), f, indent=2)

    @staticmethod
    def load_model(path: Path):
        """Load model and verify."""
        import joblib
        return joblib.load(path)

    @staticmethod
    def verify_reload(model, X_test: np.ndarray, path: Path) -> bool:
        """Verify reloaded model produces identical predictions."""
        import joblib
        original_preds = model.predict(X_test)
        reloaded = joblib.load(path)
        reloaded_preds = reloaded.predict(X_test)
        return np.allclose(original_preds, reloaded_preds)
