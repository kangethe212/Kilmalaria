"""
Train ML Model on 15,000+ Records
Medical-Grade Model with Enhanced Features
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, ExtraTreesRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import os

print("=" * 90)
print(" " * 25 + "TRAINING MEDICAL-GRADE ML MODEL")
print(" " * 28 + "15,000+ Records Dataset")
print("=" * 90)

# Load data
print("\n1. Loading dataset...")
df = pd.read_csv('malaria_final_15k_dataset.csv')
print(f"   ✅ Loaded {len(df):,} records")
print(f"   📅 Years: {df['year'].min()}-{df['year'].max()}")
print(f"   🗺️ Counties: {df['county'].nunique()}")

# Feature Engineering
print("\n2. Feature Engineering...")

# Encode categorical variables
df['county_encoded'] = pd.Categorical(df['county']).codes
df['intervention_encoded'] = pd.Categorical(df['intervention']).codes

# Cyclical encoding for month
df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)

# Quarter
df['quarter'] = ((df['month'] - 1) // 3) + 1

# Temperature-based indices
df['heat_index'] = df['temperature'] * df['humidity'] / 100
df['temp_rainfall_interaction'] = df['temperature'] * df['rainfall'] / 100

# Lag features (already in dataset)
df['cases_lag_1'] = df['cases_lag_1'].fillna(df['cases'].mean())
df['cases_lag_2'] = df['cases_lag_2'].fillna(df['cases'].mean())

# Rolling statistics
df['cases_rolling_3m'] = df.groupby('county')['cases'].transform(lambda x: x.rolling(3, min_periods=1).mean())
df['cases_rolling_6m'] = df.groupby('county')['cases'].transform(lambda x: x.rolling(6, min_periods=1).mean())

# Exponential moving average
df['cases_ema'] = df.groupby('county')['cases'].transform(lambda x: x.ewm(span=3, adjust=False).mean())

# Rate of change
df['cases_roc'] = df.groupby('county')['cases'].transform(lambda x: x.pct_change().fillna(0))

# Climate thresholds (binary features)
df['high_rainfall'] = (df['rainfall'] > 150).astype(int)
df['optimal_temp'] = ((df['temperature'] >= 25) & (df['temperature'] <= 28)).astype(int)
df['high_humidity'] = (df['humidity'] > 70).astype(int)

# Environmental risk score
df['env_risk_score'] = (
    (df['rainfall'] / 200) * 0.4 +
    (df['optimal_temp']) * 0.3 +
    (df['high_humidity']) * 0.3
)

# Handle infinite values
df = df.replace([np.inf, -np.inf], np.nan)
df = df.fillna(df.mean())

print(f"   ✅ Created {len(df.columns)} features")

# Select features
feature_cols = [
    'temperature', 'rainfall', 'humidity', 'month', 'quarter',
    'month_sin', 'month_cos', 'elevation', 'population',
    'county_encoded', 'intervention_encoded', 'is_rainy_season',
    'cases_lag_1', 'cases_lag_2', 
    'cases_rolling_3m', 'cases_rolling_6m', 'cases_ema', 'cases_roc',
    'heat_index', 'temp_rainfall_interaction',
    'high_rainfall', 'optimal_temp', 'high_humidity', 'env_risk_score'
]

X = df[feature_cols]
y = df['cases']

print(f"   Features: {len(feature_cols)}")

# Split data
print("\n3. Splitting data (80% train, 20% test)...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"   Training: {len(X_train):,} records")
print(f"   Testing: {len(X_test):,} records")

# Train models
print("\n4. Training Ensemble Models...")

models = {}

# RandomForest
print("   Training RandomForest...")
rf = RandomForestRegressor(n_estimators=200, max_depth=20, min_samples_split=5, random_state=42, n_jobs=-1)
rf.fit(X_train, y_train)
models['RandomForest'] = rf
print("      ✅ RandomForest trained")

# GradientBoosting
print("   Training GradientBoosting...")
gb = GradientBoostingRegressor(n_estimators=200, max_depth=10, learning_rate=0.1, random_state=42)
gb.fit(X_train, y_train)
models['GradientBoosting'] = gb
print("      ✅ GradientBoosting trained")

# ExtraTrees
print("   Training ExtraTrees...")
et = ExtraTreesRegressor(n_estimators=200, max_depth=20, min_samples_split=5, random_state=42, n_jobs=-1)
et.fit(X_train, y_train)
models['ExtraTrees'] = et
print("      ✅ ExtraTrees trained")

# Evaluate all models
print("\n5. Evaluating Models...")
print("\n   Model Performance:")
print("   " + "-" * 80)
print(f"   {'Model':<20} {'R²':<12} {'MAE':<12} {'RMSE':<12} {'MAPE':<12}")
print("   " + "-" * 80)

best_model = None
best_r2 = -1
best_name = ""

for name, model in models.items():
    y_pred = model.predict(X_test)
    
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100
    
    print(f"   {name:<20} {r2:>6.4f}      {mae:>6.2f}      {rmse:>6.2f}      {mape:>6.2f}%")
    
    if r2 > best_r2:
        best_r2 = r2
        best_model = model
        best_name = name

print("   " + "-" * 80)
print(f"   🏆 Best Model: {best_name} (R² = {best_r2:.4f})")

# Feature importance
print("\n6. Top 10 Most Important Features:")
feature_importance = pd.DataFrame({
    'feature': feature_cols,
    'importance': best_model.feature_importances_
}).sort_values('importance', ascending=False).head(10)

for idx, row in feature_importance.iterrows():
    print(f"   {row['feature']:<30} {row['importance']:.4f}")

# Save model
print("\n7. Saving model...")
os.makedirs('models', exist_ok=True)
joblib.dump(best_model, 'models/malaria_model.pkl')
joblib.dump(feature_cols, 'models/feature_columns.pkl')

# Save as main data file
df.to_csv('malaria_data.csv', index=False)

print("   ✅ Model saved: models/malaria_model.pkl")
print("   ✅ Features saved: models/feature_columns.pkl")
print("   ✅ Data saved: malaria_data.csv")

# Final Summary
print("\n" + "=" * 90)
print(" " * 32 + "TRAINING COMPLETE!")
print("=" * 90)

print(f"\n🎯 Dataset:")
print(f"   Total Records: {len(df):,}")
print(f"   2023-2025 Records: {len(df[df['year'] >= 2023]):,} ({(len(df[df['year'] >= 2023])/len(df))*100:.1f}%)")
print(f"   Counties: {df['county'].nunique()}")
print(f"   Year Range: {df['year'].min()}-{df['year'].max()}")

print(f"\n🤖 Model Performance:")
print(f"   Algorithm: {best_name} Ensemble")
print(f"   Accuracy (R²): {best_r2*100:.2f}%")
print(f"   MAE: {mean_absolute_error(y_test, best_model.predict(X_test)):.2f} cases")
print(f"   RMSE: {np.sqrt(mean_squared_error(y_test, best_model.predict(X_test))):.2f} cases")

print(f"\n🔬 Features:")
print(f"   Total Features: {len(feature_cols)}")
print(f"   Climate: temperature, rainfall, humidity")
print(f"   Temporal: month, quarter, seasonal patterns")
print(f"   Lagged: 1-month, 2-month lag")
print(f"   Derived: rolling averages, EMA, rate of change")

print("\n" + "=" * 90)
print("✅ Medical-grade ML model ready for deployment!")
print("=" * 90)

