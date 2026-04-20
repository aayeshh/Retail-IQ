import numpy as np
import pandas as pd
from typing import Dict, Tuple, Optional, List
from sklearn.metrics import mean_squared_error, mean_absolute_percentage_error, r2_score


def rmsle(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """
    Root Mean Squared Logarithmic Error.
    Handles zeros with log1p transform.
    """
    y_pred_clipped = np.clip(y_pred, 0, None)
    return np.sqrt(np.mean((np.log1p(y_pred_clipped) - np.log1p(y_true)) ** 2))


def evaluate_model(y_true: np.ndarray, y_pred: np.ndarray,
                   model_name: str = "Model") -> Dict[str, float]:
    """
    Compute all metrics: RMSLE, RMSE, MAPE, R².
    MAPE excludes zero actuals to avoid division by zero.
    """
    # RMSLE (primary metric)
    rmsle_val = rmsle(y_true, y_pred)

    # RMSE
    rmse_val = np.sqrt(mean_squared_error(y_true, y_pred))

    # MAPE (exclude zero actuals)
    mask = y_true > 0
    if mask.sum() > 0:
        mape_val = mean_absolute_percentage_error(y_true[mask], y_pred[mask]) * 100
    else:
        mape_val = np.nan

    # R²
    r2_val = r2_score(y_true, y_pred)

    return {
        'model': model_name,
        'RMSLE': rmsle_val,
        'RMSE': rmse_val,
        'MAPE': mape_val,
        'R2': r2_val
    }


def check_residual_bias(y_true: np.ndarray, y_pred: np.ndarray,
                        threshold_pct: float = 5.0) -> Tuple[bool, float]:
    """
    Check if mean residual exceeds threshold % of mean actual.
    Returns (has_bias, mean_residual_pct).
    """
    residuals = y_true - y_pred
    mean_residual = np.mean(residuals)
    mean_actual = np.mean(y_true)
    residual_pct = (mean_residual / mean_actual) * 100
    has_bias = abs(residual_pct) > threshold_pct
    return has_bias, residual_pct


def create_metrics_table(results: List[Dict[str, float]]) -> pd.DataFrame:
    """Create comparison table from list of metric dicts."""
    return pd.DataFrame(results)


def analyze_residuals(y_true: np.ndarray, y_pred: np.ndarray) -> Dict:
    """Statistical analysis of residuals."""
    residuals = y_true - y_pred
    return {
        'mean_residual': np.mean(residuals),
        'std_residual': np.std(residuals),
        'max_residual': np.max(residuals),
        'min_residual': np.min(residuals),
        'skew_residual': pd.Series(residuals).skew(),
        'kurt_residual': pd.Series(residuals).kurtosis()
    }


def time_series_split(df: pd.DataFrame, n_splits: int = 5,
                     date_col: str = 'date') -> List[Tuple[pd.DataFrame, pd.DataFrame]]:
    """
    Generate train/test splits respecting temporal order.
    Returns list of (train_df, test_df) tuples.
    """
    df = df.sort_values(date_col)
    n_samples = len(df)
    fold_size = n_samples // (n_splits + 1)

    splits = []
    for i in range(n_splits):
        test_start = (i + 1) * fold_size
        test_end = (i + 2) * fold_size if i < n_splits - 1 else n_samples

        train_df = df.iloc[:test_start]
        test_df = df.iloc[test_start:test_end]
        splits.append((train_df, test_df))

    return splits
