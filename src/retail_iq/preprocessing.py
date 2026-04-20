import pandas as pd
import numpy as np
from .config import RAW_DATA_DIR

def load_raw_data():
    """Load all raw datasets from the data/raw directory."""
    train = pd.read_csv(RAW_DATA_DIR / "train.csv")
    test = pd.read_csv(RAW_DATA_DIR / "test.csv")
    stores = pd.read_csv(RAW_DATA_DIR / "stores.csv")
    oil = pd.read_csv(RAW_DATA_DIR / "oil.csv")
    holidays = pd.read_csv(RAW_DATA_DIR / "holidays_events.csv")
    transactions = pd.read_csv(RAW_DATA_DIR / "transactions.csv")
    
    return train, test, stores, oil, holidays, transactions

def preprocess_dates(dfs):
    """Convert date columns to datetime objects for a list of dataframes."""
    for df in dfs:
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'])
    return dfs

def clean_oil_prices(oil_df):
    """Fill missing oil prices using forward and backward fill."""
    oil_df['dcoilwtico'] = oil_df['dcoilwtico'].ffill().bfill()
    return oil_df

def merge_datasets(train, stores, oil, holidays, transactions):
    """Merge core datasets into a single training dataframe."""
    df = train.copy()
    df = df.merge(stores, on="store_nbr", how="left")
    df = df.merge(oil, on="date", how="left")
    df = df.merge(transactions, on=["store_nbr", "date"], how="left")
    
    # Handle holidays - remove duplicate dates for simplicity in initial merge
    holidays_clean = holidays.drop_duplicates(subset=['date'])
    df = df.merge(holidays_clean, on="date", how="left")
    
    # Rename columns for clarity
    df = df.rename(columns={
        "type_x": "store_type",
        "type_y": "holiday_type"
    })
    
    return df

def detect_outliers_iqr(df):
    """Detect outliers in sales using IQR grouped by store and family."""
    def get_outliers(group):
        Q1 = group['sales'].quantile(0.25)
        Q3 = group['sales'].quantile(0.75)
        IQR = Q3 - Q1
        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR
        group['is_outlier'] = (group['sales'] < lower) | (group['sales'] > upper)
        return group

    return df.groupby(['store_nbr','family'], group_keys=False).apply(get_outliers)
