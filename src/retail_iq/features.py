import pandas as pd
import numpy as np

class FastFeatureEngineer:
    """
    Modular Feature Engineering class for Retail-IQ.
    Handles temporal, lag, rolling, and cross-family features.
    """
    def __init__(self, df, transactions=None, oil_price=None, holidays=None, store_meta=None):
        self.df = df.copy()
        self.transactions = transactions
        self.oil_price = oil_price
        self.holidays = holidays
        self.store_meta = store_meta

    def add_temporal_features(self):
        self.df['day_of_week'] = self.df['date'].dt.dayofweek
        self.df['day_of_month'] = self.df['date'].dt.day
        self.df['week_of_year'] = self.df['date'].dt.isocalendar().week
        self.df['month'] = self.df['date'].dt.month
        self.df['quarter'] = self.df['date'].dt.quarter
        self.df['year'] = self.df['date'].dt.year
        self.df['is_weekend'] = self.df['day_of_week'].isin([5,6]).astype(np.uint8)
        return self

    def add_lag_and_rolling(self, lags=[1,7,14,365], windows=[7,14,28]):
        gb = self.df.groupby(['store_nbr','family'], sort=False)
        # Lag features
        for lag in lags:
            self.df[f'sales_lag_{lag}d'] = gb['sales'].shift(lag)
        # Rolling features
        for w in windows:
            self.df[f'sales_roll_mean_{w}d'] = gb['sales'].transform(lambda x: x.shift(1).rolling(w, min_periods=1).mean())
            self.df[f'sales_roll_std_{w}d'] = gb['sales'].transform(lambda x: x.shift(1).rolling(w, min_periods=1).std())
        return self

    def add_onpromotion_features(self):
        gb = self.df.groupby(['store_nbr','family'], sort=False)
        self.df['onpromotion_lag_1d'] = gb['onpromotion'].shift(1)
        self.df['onpromotion_rolling_7d'] = gb['onpromotion'].transform(lambda x: x.shift(1).rolling(7, min_periods=1).mean())
        return self

    def add_macroeconomic_features(self):
        if self.oil_price is not None:
            # Ensure date column exists in oil_price if it's being merged
            if 'date' in self.oil_price.columns:
                 self.df = self.df.merge(self.oil_price, on='date', how='left')
            self.df['dcoilwtico_lag_7d'] = self.df['dcoilwtico'].shift(7)
            self.df['dcoilwtico_rolling_28d'] = self.df['dcoilwtico'].shift(1).rolling(28, min_periods=1).mean()
        return self

    def add_transaction_features(self):
        if self.transactions is not None:
            self.df = self.df.merge(self.transactions, on=['date','store_nbr'], how='left')
            self.df['transactions_lag_7d'] = self.df.groupby('store_nbr')['transactions'].shift(7)
        return self

    def add_store_metadata(self):
        if self.store_meta is not None:
            self.df = self.df.merge(self.store_meta, on='store_nbr', how='left')
            if 'store_type' in self.df.columns:
                self.df['store_type'] = self.df['store_type'].astype('category').cat.codes
        return self

    def add_cannibalization_features(self, top_n=3):
        stores = self.df['store_nbr'].unique()
        cannibal_features = []
        
        for s in stores:
            df_store = self.df[self.df['store_nbr']==s].pivot(index='date', columns='family', values='sales')
            corr = df_store.corr()
            
            for f in df_store.columns:
                # Find top correlated families excluding itself
                corr_f = corr[f].drop(labels=[f])
                top_fams = corr_f.sort_values(ascending=False).head(top_n).index
                df_store[f'{f}_top_corr_mean'] = df_store[top_fams].shift(1).mean(axis=1)
            
            df_store['store_nbr'] = s
            cannibal_features.append(df_store)
        
        cannibal_df = pd.concat(cannibal_features).reset_index()
        id_vars = ['date','store_nbr']
        value_vars = [c for c in cannibal_df.columns if '_top_corr_mean' in c]
        cannibal_long = cannibal_df.melt(id_vars=id_vars, value_vars=value_vars,
                                        var_name='family_feature', value_name='top_corr_mean')
        
        cannibal_long['family'] = cannibal_long['family_feature'].str.replace('_top_corr_mean','')
        cannibal_long = cannibal_long.drop('family_feature', axis=1)
        
        self.df = self.df.merge(cannibal_long, on=['date','store_nbr','family'], how='left')
        return self

    def transform(self):
        return self.df
