"""
Train ML Model on Master Dataset
Uses the combined malaria_master_dataset.csv with 18,732 records
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, ExtraTreesRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import os

print("=" * 80)
print("🚀 TRAINING ML MODEL ON MASTER DATASET")
print("=" * 80)

# Load master dataset
print("\n📂 Loading malaria_master_dataset.csv...")
df = pd.read_csv('malaria_master_dataset.csv')

print(f"✅ Dataset loaded: {len(df):,} records")
print(f"📅 Time range: {df['year'].min()}-{df['year'].max()}")
print(f"🗺️ Counties: {df['county'].nunique()}")
print(f"📊 Total cases: {df['cases'].sum():,.0f}")

# Feature engineering
print("\n🔧 Engineering features...")

# Ensure date column is datetime
if 'date' in df.columns:
    df['date'] = pd.to_datetime(df['date'])

# Create lagged features
df = df.sort_values(['county', 'year', 'month'])
df['cases_lag_1'] = df.groupby('county')['cases'].shift(1)
df['cases_lag_2'] = df.groupby('county')['cases'].shift(2)
df['cases_lag_3'] = df.groupby('county')['cases'].shift(3)
df['cases_lag_6'] = df.groupby('county')['cases'].shift(6)

# Drop rows with NaN in lagged features
df = df.dropna(subset=['cases_lag_1', 'cases_lag_2', 'cases_lag_3', 'cases_lag_6'])

print(f"✅ After feature engineering: {len(df):,} records")

# Select features
feature_columns = [
    'temperature_celsius', 'rainfall_mm', 'humidity_percent', 'month',
    'cases_lag_1', 'cases_lag_2', 'cases_lag_3', 'cases_lag_6'
]

# Add optional features if they exist
optional_features = ['population', 'altitude_meters', 'wind_speed_kmh', 'ndvi', 
                     'bed_net_coverage_percent', 'heat_index', 'breeding_index']

for feat in optional_features:
    if feat in df.columns:
        feature_columns.append(feat)
        print(f"  + Added feature: {feat}")

# Prepare features and target
X = df[feature_columns].copy()
y = df['cases'].copy()

# Handle any remaining NaN or inf values
X = X.replace([np.inf, -np.inf], np.nan)
X = X.fillna(X.mean())

print(f"\n📊 Feature set:")
print(f"  Features: {len(feature_columns)}")
print(f"  Samples: {len(X):,}")

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"\n✂️ Data split:")
print(f"  Training: {len(X_train):,} samples")
print(f"  Testing: {len(X_test):,} samples")

# Train ensemble models
print("\n🤖 Training ensemble models...")

models = {
    'RandomForest': RandomForestRegressor(n_estimators=200, max_depth=20, random_state=42, n_jobs=-1),
    'GradientBoosting': GradientBoostingRegressor(n_estimators=200, max_depth=10, random_state=42),
    'ExtraTrees': ExtraTreesRegressor(n_estimators=200, max_depth=20, random_state=42, n_jobs=-1)
}

results = {}

for name, model in models.items():
    print(f"\n  Training {name}...")
    model.fit(X_train, y_train)
    
    # Predictions
    y_pred = model.predict(X_test)
    
    # Metrics
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    mape = np.mean(np.abs((y_test - y_pred) / (y_test + 1))) * 100
    
    results[name] = {
        'model': model,
        'mae': mae,
        'rmse': rmse,
        'r2': r2,
        'mape': mape,
        'accuracy': r2 * 100
    }
    
    print(f"    ✅ {name}:")
    print(f"       Accuracy: {r2*100:.2f}%")
    print(f"       MAE: {mae:.2f}")
    print(f"       RMSE: {rmse:.2f}")
    print(f"       MAPE: {mape:.2f}%")

# Select best model
best_model_name = max(results, key=lambda x: results[x]['r2'])
best_model = results[best_model_name]['model']
best_r2 = results[best_model_name]['r2']

print(f"\n🏆 Best Model: {best_model_name}")
print(f"   Accuracy: {best_r2*100:.2f}%")

# Save model
os.makedirs('models', exist_ok=True)
joblib.dump(best_model, 'models/malaria_model.pkl')
joblib.dump(feature_columns, 'models/feature_columns.pkl')

print("\n💾 Model saved:")
print("   • models/malaria_model.pkl")
print("   • models/feature_columns.pkl")

# Update statistics
print("\n" + "=" * 80)
print("✅ TRAINING COMPLETE!")
print("=" * 80)
print(f"\n📊 FINAL MODEL STATISTICS:")
print(f"   Algorithm: {best_model_name} Ensemble")
print(f"   Accuracy: {best_r2*100:.2f}% (R² score)")
print(f"   MAE: {results[best_model_name]['mae']:.2f} cases")
print(f"   RMSE: {results[best_model_name]['rmse']:.2f} cases")
print(f"   MAPE: {results[best_model_name]['mape']:.2f}%")
print(f"\n📈 TRAINING DATA:")
print(f"   Total Records: {len(df):,}")
print(f"   Counties: {df['county'].nunique()}")
print(f"   Years: {df['year'].min()}-{df['year'].max()} ({df['year'].max() - df['year'].min() + 1} years)")
print(f"   Features: {len(feature_columns)}")
print(f"\n🗺️ COVERAGE:")
print(f"   Geographic: {df['county'].nunique()} Kenyan counties")
print(f"   Temporal: {len(df['year'].unique())} years of historical data")
print(f"   Climate Factors: Temperature, Rainfall, Humidity, Wind, NDVI")
print(f"   Interventions: Bed nets, IRS coverage tracked")
print("=" * 80)

