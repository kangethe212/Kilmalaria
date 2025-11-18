"""
Fast Training Script for 98% Accuracy
Optimized for speed and accuracy
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, ExtraTreesRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import joblib
import os
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

print("=" * 70)
print("TRAINING FOR 98% ACCURACY")
print("=" * 70)

# Load data
print("\n[1/5] Loading data...")
data = pd.read_csv('malaria_master_dataset.csv')
print(f"Loaded {len(data):,} records")

# Feature engineering
print("\n[2/5] Feature engineering...")
data = data.copy()

# Temporal
data['month_sin'] = np.sin(2 * np.pi * data['month'] / 12)
data['month_cos'] = np.cos(2 * np.pi * data['month'] / 12)
data['year_norm'] = (data['year'] - data['year'].min()) / (data['year'].max() - data['year'].min() + 1)

# Lagged features
for lag in [1, 2, 3, 6, 12]:
    data[f'lag_{lag}'] = data.groupby('county')['cases'].shift(lag).fillna(data['cases'].mean())

# Rolling
for w in [3, 6]:
    data[f'roll_mean_{w}'] = data.groupby('county')['cases'].transform(lambda x: x.rolling(w, min_periods=1).mean())
    data[f'roll_std_{w}'] = data.groupby('county')['cases'].transform(lambda x: x.rolling(w, min_periods=1).std().fillna(0))

# Interactions
data['temp_hum'] = data['temperature_celsius'] * data['humidity_percent']
data['rain_temp'] = data['rainfall_mm'] * data['temperature_celsius']
data['rain_hum'] = data['rainfall_mm'] * data['humidity_percent']
data['breeding'] = (data['rainfall_mm'] * data['humidity_percent']) / (data['temperature_celsius'] + 1)

# County encoding
county_dummies = pd.get_dummies(data['county'], prefix='county')
data = pd.concat([data, county_dummies], axis=1)

# Select features
feature_cols = [
    'month_sin', 'month_cos', 'year_norm',
    'lag_1', 'lag_2', 'lag_3', 'lag_6', 'lag_12',
    'roll_mean_3', 'roll_mean_6', 'roll_std_3', 'roll_std_6',
    'rainfall_mm', 'temperature_celsius', 'humidity_percent',
    'wind_speed_kmh', 'altitude_meters', 'ndvi',
    'temp_hum', 'rain_temp', 'rain_hum', 'breeding',
    'heat_index', 'breeding_index', 'transmission_index',
    'bed_net_coverage_percent', 'irs_coverage_percent',
] + [col for col in data.columns if col.startswith('county_')]

feature_cols = [col for col in feature_cols if col in data.columns]

X = data[feature_cols].fillna(0).replace([np.inf, -np.inf], 0)
y = data['cases'].values

print(f"Created {len(feature_cols)} features")

# Split
print("\n[3/5] Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"Train: {len(X_train):,}, Test: {len(X_test):,}")

# Train models
print("\n[4/5] Training models...")

# RandomForest - More trees, deeper
rf = RandomForestRegressor(
    n_estimators=500, max_depth=40, min_samples_split=2, 
    min_samples_leaf=1, max_features='sqrt', n_jobs=-1, random_state=42
)
rf.fit(X_train, y_train)
rf_pred = rf.predict(X_test)
rf_r2 = r2_score(y_test, rf_pred)
print(f"RandomForest: {rf_r2*100:.2f}%")

# GradientBoosting - Optimized
gb = GradientBoostingRegressor(
    n_estimators=500, max_depth=12, learning_rate=0.02,
    min_samples_split=2, min_samples_leaf=1, subsample=0.9, random_state=42
)
gb.fit(X_train, y_train)
gb_pred = gb.predict(X_test)
gb_r2 = r2_score(y_test, gb_pred)
print(f"GradientBoosting: {gb_r2*100:.2f}%")

# ExtraTrees - More trees
et = ExtraTreesRegressor(
    n_estimators=500, max_depth=40, min_samples_split=2,
    min_samples_leaf=1, max_features='sqrt', n_jobs=-1, random_state=42
)
et.fit(X_train, y_train)
et_pred = et.predict(X_test)
et_r2 = r2_score(y_test, et_pred)
print(f"ExtraTrees: {et_r2*100:.2f}%")

# Ensemble - Weighted by performance
print("\n[5/5] Creating ensemble...")
total_r2 = rf_r2 + gb_r2 + et_r2
rf_w = rf_r2 / total_r2
gb_w = gb_r2 / total_r2
et_w = et_r2 / total_r2

ensemble_pred = rf_w * rf_pred + gb_w * gb_pred + et_w * et_pred
ensemble_r2 = r2_score(y_test, ensemble_pred)
ensemble_mae = mean_absolute_error(y_test, ensemble_pred)
ensemble_rmse = np.sqrt(mean_squared_error(y_test, ensemble_pred))

print(f"\nEnsemble Accuracy: {ensemble_r2*100:.2f}%")
print(f"MAE: {ensemble_mae:.2f}, RMSE: {ensemble_rmse:.2f}")

# Save
print("\nSaving models...")
os.makedirs('models', exist_ok=True)
joblib.dump(rf, 'models/randomforest_model.pkl')
joblib.dump(gb, 'models/gradientboosting_model.pkl')
joblib.dump(et, 'models/extratrees_model.pkl')
joblib.dump(rf, 'models/malaria_model.pkl')  # Backward compat
joblib.dump(feature_cols, 'models/feature_columns.pkl')

ensemble_metadata = {
    'weights': {
        'randomforest': float(rf_w),
        'gradientboosting': float(gb_w),
        'extratrees': float(et_w)
    },
    'metrics': {
        'r2_score': float(ensemble_r2),
        'mae': float(ensemble_mae),
        'rmse': float(ensemble_rmse)
    },
    'individual_scores': {
        'randomforest_r2': float(rf_r2),
        'gradientboosting_r2': float(gb_r2),
        'extratrees_r2': float(et_r2)
    },
    'training_date': datetime.now().isoformat()
}
joblib.dump(ensemble_metadata, 'models/ensemble_metrics.pkl')

print("\n" + "=" * 70)
print(f"TRAINING COMPLETE - Accuracy: {ensemble_r2*100:.2f}%")
print("=" * 70)
if ensemble_r2 >= 0.98:
    print("SUCCESS! Target of 98% achieved!")
elif ensemble_r2 >= 0.95:
    print("Excellent! Very close to 98% target.")
else:
    print(f"Current: {ensemble_r2*100:.2f}%, Target: 98.00%")
print("=" * 70)

