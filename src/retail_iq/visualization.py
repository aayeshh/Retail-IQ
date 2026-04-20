import matplotlib.pyplot as plt
import seaborn as sns
from statsmodels.tsa.seasonal import seasonal_decompose
from .config import PLOT_DIR

def plot_ts_decomposition(df, store_nbr, family, period=365):
    """Plot time-series decomposition for a specific store and family."""
    ts = df[(df['store_nbr'] == store_nbr) & (df['family'] == family)]
    ts = ts.set_index('date').sort_index()
    
    result = seasonal_decompose(ts['sales'], model='additive', period=period)
    
    fig = result.plot()
    fig.set_size_inches(12, 8)
    plt.suptitle(f"Time-Series Decomposition: Store {store_nbr}, Family {family}", fontsize=16)
    plt.tight_layout()
    
    save_path = PLOT_DIR / f"ts_decompose_store{store_nbr}_family{family}.png"
    plt.savefig(save_path)
    plt.close()
    return save_path

def plot_correlation_heatmap(df, filename="correlation_heatmap.png"):
    """Plot correlation heatmap for numerical features."""
    numeric_cols = df.select_dtypes(include='number').columns
    plt.figure(figsize=(12, 10))
    sns.heatmap(df[numeric_cols].corr(), annot=True, fmt=".2f", cmap="coolwarm")
    plt.title("Correlation Heatmap of Numerical Features")
    
    save_path = PLOT_DIR / filename
    plt.savefig(save_path)
    plt.close()
    return save_path

def plot_sales_distribution(df, filename="sales_distribution.png"):
    """Plot histogram of sales distribution."""
    plt.figure(figsize=(10, 5))
    sns.histplot(df['sales'], bins=50, kde=True)
    plt.title("Distribution of Sales")
    
    save_path = PLOT_DIR / filename
    plt.savefig(save_path)
    plt.close()
    return save_path
