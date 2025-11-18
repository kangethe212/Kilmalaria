"""
Feature Engineering Functions for Predictions
Matches the advanced feature engineering from train_advanced_model.py
"""

import pandas as pd
import numpy as np

def create_advanced_features(df):
    """Create all advanced features matching training script"""
    df = df.copy()
    
    # Ensure date is datetime if present
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'])
    
    # Temporal features
    df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
    df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)
    df['month_sin_2'] = np.sin(4 * np.pi * df['month'] / 12)
    df['month_cos_2'] = np.cos(4 * np.pi * df['month'] / 12)
    
    if 'year' in df.columns:
        year_min = df['year'].min() if len(df) > 0 else 2014
        year_max = df['year'].max() if len(df) > 0 else 2025
        if year_max > year_min:
            df['year_normalized'] = (df['year'] - year_min) / (year_max - year_min)
        else:
            df['year_normalized'] = 0
    
    df['quarter'] = ((df['month'] - 1) // 3) + 1
    df['quarter_sin'] = np.sin(2 * np.pi * df['quarter'] / 4)
    df['quarter_cos'] = np.cos(2 * np.pi * df['quarter'] / 4)
    
    # Lagged features (will be filled with defaults if not available)
    for lag in [1, 2, 3, 6, 12, 24]:
        if f'cases_lag_{lag}' not in df.columns:
            df[f'cases_lag_{lag}'] = df['cases'].mean() if 'cases' in df.columns else 0
        
        if f'rainfall_lag_{lag}' not in df.columns:
            df[f'rainfall_lag_{lag}'] = df['rainfall_mm'].mean() if 'rainfall_mm' in df.columns else 0
        
        if f'temp_lag_{lag}' not in df.columns:
            df[f'temp_lag_{lag}'] = df['temperature_celsius'].mean() if 'temperature_celsius' in df.columns else 0
    
    # Rolling statistics
    for window in [3, 6, 12]:
        if 'cases' in df.columns:
            df[f'cases_rolling_mean_{window}'] = df['cases'].rolling(window, min_periods=1).mean()
            df[f'cases_rolling_std_{window}'] = df['cases'].rolling(window, min_periods=1).std().fillna(0)
            df[f'cases_rolling_max_{window}'] = df['cases'].rolling(window, min_periods=1).max()
            df[f'cases_rolling_min_{window}'] = df['cases'].rolling(window, min_periods=1).min()
        else:
            df[f'cases_rolling_mean_{window}'] = 0
            df[f'cases_rolling_std_{window}'] = 0
            df[f'cases_rolling_max_{window}'] = 0
            df[f'cases_rolling_min_{window}'] = 0
        
        if 'rainfall_mm' in df.columns:
            df[f'rainfall_rolling_mean_{window}'] = df['rainfall_mm'].rolling(window, min_periods=1).mean()
        else:
            df[f'rainfall_rolling_mean_{window}'] = 0
    
    # Exponential moving averages
    for span in [3, 6, 12]:
        if 'cases' in df.columns:
            df[f'cases_ema_{span}'] = df['cases'].ewm(span=span, adjust=False).mean()
        else:
            df[f'cases_ema_{span}'] = 0
    
    # Interaction features
    if 'temperature_celsius' in df.columns and 'humidity_percent' in df.columns:
        df['temp_humidity'] = df['temperature_celsius'] * df['humidity_percent']
    else:
        df['temp_humidity'] = 0
    
    if 'rainfall_mm' in df.columns and 'temperature_celsius' in df.columns:
        df['rainfall_temp'] = df['rainfall_mm'] * df['temperature_celsius']
    else:
        df['rainfall_temp'] = 0
    
    if 'rainfall_mm' in df.columns and 'humidity_percent' in df.columns:
        df['rainfall_humidity'] = df['rainfall_mm'] * df['humidity_percent']
    else:
        df['rainfall_humidity'] = 0
    
    # Polynomial features
    if 'temperature_celsius' in df.columns:
        df['temp_squared'] = df['temperature_celsius'] ** 2
    else:
        df['temp_squared'] = 0
    
    if 'rainfall_mm' in df.columns:
        df['rainfall_squared'] = df['rainfall_mm'] ** 2
    else:
        df['rainfall_squared'] = 0
    
    if 'humidity_percent' in df.columns:
        df['humidity_squared'] = df['humidity_percent'] ** 2
    else:
        df['humidity_squared'] = 0
    
    # Environmental indices
    if all(col in df.columns for col in ['rainfall_mm', 'humidity_percent', 'temperature_celsius']):
        df['breeding_risk'] = (df['rainfall_mm'] * df['humidity_percent']) / (df['temperature_celsius'] + 1)
        df['malaria_index'] = (
            (df['rainfall_mm'] / 100) * 
            (df['humidity_percent'] / 100) * 
            (df['temperature_celsius'] / 30)
        )
    else:
        df['breeding_risk'] = 0
        df['malaria_index'] = 0
    
    if 'temperature_celsius' in df.columns:
        df['optimal_temp'] = np.where(
            (df['temperature_celsius'] >= 20) & (df['temperature_celsius'] <= 30),
            1, 0
        )
    else:
        df['optimal_temp'] = 0
    
    if 'rainfall_mm' in df.columns:
        df['optimal_rainfall'] = np.where(
            (df['rainfall_mm'] >= 50) & (df['rainfall_mm'] <= 200),
            1, 0
        )
    else:
        df['optimal_rainfall'] = 0
    
    # Rate of change features
    if 'cases' in df.columns:
        df['cases_diff_1'] = df['cases'].diff(1).fillna(0)
        df['cases_diff_3'] = df['cases'].diff(3).fillna(0)
        df['cases_pct_change'] = df['cases'].pct_change().fillna(0)
    else:
        df['cases_diff_1'] = 0
        df['cases_diff_3'] = 0
        df['cases_pct_change'] = 0
    
    # Fill any remaining NaN values
    df = df.fillna(0)
    
    return df

