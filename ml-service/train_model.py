"""
Train RandomForest regression model for malaria prediction
Includes feature engineering with temporal and environmental features
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import os

def create_lagged_features(df, lags=[1, 2, 3, 6, 12]):
    """Create lagged features for time series prediction"""
    df = df.sort_values(['county', 'year', 'month'])
    
    for lag in lags:
        df[f'cases_lag_{lag}'] = df.groupby('county')['cases'].shift(lag)
        df[f'rainfall_lag_{lag}'] = df.groupby('county')['rainfall_mm'].shift(lag)
    
    return df

def create_cyclical_features(df):
    """Encode month as cyclical feature (sin/cos transformation)"""
    df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
    df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)
    return df

def engineer_features(df):
    """Create all features for the model"""
    
    # Cyclical encoding for seasonality
    df = create_cyclical_features(df)
    
    # Lagged features for temporal dependencies
    df = create_lagged_features(df, lags=[1, 2, 3, 6, 12])
    
    # Rolling averages
    df = df.sort_values(['county', 'year', 'month'])
    df['cases_rolling_3'] = df.groupby('county')['cases'].transform(
        lambda x: x.rolling(window=3, min_periods=1).mean()
    )
    df['rainfall_rolling_3'] = df.groupby('county')['rainfall_mm'].transform(
        lambda x: x.rolling(window=3, min_periods=1).mean()
    )
    
    # Interaction features
    df['temp_humidity'] = df['temperature_celsius'] * df['humidity_percent']
    df['rainfall_humidity'] = df['rainfall_mm'] * df['humidity_percent']
    
    # County encoding (one-hot)
    df = pd.get_dummies(df, columns=['county'], prefix='county')
    
    return df

def train_model():
    """Train the RandomForest model"""
    
    print("🔄 Loading data...")
    df = pd.read_csv('malaria_data.csv')
    
    print("🛠️  Engineering features...")
    df = engineer_features(df)
    
    # Remove rows with NaN (from lagged features)
    df = df.dropna()
    
    print(f"📊 Training data shape: {df.shape}")
    
    # Define features
    feature_cols = [col for col in df.columns if col not in [
        'date', 'cases', 'rate_per_100k', 'population_100k', 'year', 'month'
    ]]
    
    X = df[feature_cols]
    y = df['cases']
    
    print(f"🎯 Features: {len(feature_cols)}")
    print(f"   Top features: {feature_cols[:10]}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, shuffle=True
    )
    
    print(f"\n📦 Training set: {len(X_train)} samples")
    print(f"📦 Test set: {len(X_test)} samples")
    
    # Train RandomForest
    print("\n🌲 Training RandomForest model...")
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=20,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
        verbose=1
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    print("\n📈 Evaluating model...")
    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)
    
    train_mae = mean_absolute_error(y_train, y_pred_train)
    test_mae = mean_absolute_error(y_test, y_pred_test)
    
    train_rmse = np.sqrt(mean_squared_error(y_train, y_pred_train))
    test_rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
    
    train_r2 = r2_score(y_train, y_pred_train)
    test_r2 = r2_score(y_test, y_pred_test)
    
    print("\n✅ Model Performance:")
    print(f"   Training MAE: {train_mae:.2f} cases")
    print(f"   Test MAE: {test_mae:.2f} cases")
    print(f"   Training RMSE: {train_rmse:.2f} cases")
    print(f"   Test RMSE: {test_rmse:.2f} cases")
    print(f"   Training R²: {train_r2:.4f}")
    print(f"   Test R²: {test_r2:.4f}")
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': feature_cols,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\n🎯 Top 10 Most Important Features:")
    print(feature_importance.head(10).to_string(index=False))
    
    # Save model and feature columns
    os.makedirs('models', exist_ok=True)
    
    joblib.dump(model, 'models/malaria_model.pkl')
    joblib.dump(feature_cols, 'models/feature_columns.pkl')
    joblib.dump(df[['year', 'month']].max().to_dict(), 'models/last_training_date.pkl')
    
    print("\n💾 Model saved to models/malaria_model.pkl")
    print("✅ Training complete!")
    
    return model, feature_cols

if __name__ == "__main__":
    model, features = train_model()

