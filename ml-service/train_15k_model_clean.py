"""
Train ML Model on 15,300+ Records - Clean Output
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, ExtraTreesRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import os
import warnings
warnings.filterwarnings('ignore')

# Suppress pandas output
pd.options.mode.chained_assignment = None

print("\n" + "=" * 70)
print(" " * 15 + "CLIMALARIA - ML MODEL TRAINING")
print("=" * 70 + "\n")

# Load
print("1. Loading dataset...")
df = pd.read_csv('malaria_final_15k_dataset.csv')
print(f"   ✅ {len(df):,} records loaded")
print(f"   📅 {df['year'].min()}-{df['year'].max()}")
print(f"   🗺️ {df['county'].nunique()} counties")

# Feature engineering
print("\n2. Feature engineering...")
df['county_encoded'] = pd.Categorical(df['county']).codes
df['intervention_encoded'] = pd.Categorical(df['intervention']).codes
df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)
df['quarter'] = ((df['month'] - 1) // 3) + 1
df['heat_index'] = df['temperature'] * df['humidity'] / 100
df['temp_rainfall'] = df['temperature'] * df['rainfall'] / 100

# Handle NaN/Inf
df = df.replace([np.inf, -np.inf], np.nan)
df = df.fillna(df.mean())

features = [
    'temperature', 'rainfall', 'humidity', 'month', 'quarter',
    'month_sin', 'month_cos', 'elevation', 'population',
    'county_encoded', 'intervention_encoded', 'is_rainy_season',
    'cases_lag_1', 'cases_lag_2', 'heat_index', 'temp_rainfall'
]

X = df[features]
y = df['cases']
print(f"   ✅ {len(features)} features ready")

# Split
print("\n3. Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"   Training: {len(X_train):,}")
print(f"   Testing: {len(X_test):,}")

# Train
print("\n4. Training models...")

models = {}

print("   - RandomForest...", end=" ")
rf = RandomForestRegressor(n_estimators=200, max_depth=20, random_state=42, n_jobs=-1)
rf.fit(X_train, y_train)
models['RandomForest'] = rf
print("✅")

print("   - GradientBoosting...", end=" ")
gb = GradientBoostingRegressor(n_estimators=200, max_depth=10, random_state=42)
gb.fit(X_train, y_train)
models['GradientBoosting'] = gb
print("✅")

print("   - ExtraTrees...", end=" ")
et = ExtraTreesRegressor(n_estimators=200, max_depth=20, random_state=42, n_jobs=-1)
et.fit(X_train, y_train)
models['ExtraTrees'] = et
print("✅")

# Evaluate
print("\n5. Model Performance:")
print("   " + "-" * 66)
print(f"   {'Model':<20} {'R²':<12} {'MAE':<12} {'RMSE':<12}")
print("   " + "-" * 66)

best_r2 = -1
best_model = None
best_name = ""

for name, model in models.items():
    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    
    print(f"   {name:<20} {r2:>6.4f}      {mae:>6.2f}      {rmse:>6.2f}")
    
    if r2 > best_r2:
        best_r2 = r2
        best_model = model
        best_name = name

print("   " + "-" * 66)
print(f"   🏆 Best: {best_name} ({best_r2*100:.2f}% accuracy)")

# Save
print("\n6. Saving model...")
os.makedirs('models', exist_ok=True)
joblib.dump(best_model, 'models/malaria_model.pkl')
joblib.dump(features, 'models/feature_columns.pkl')
df.to_csv('malaria_data.csv', index=False)
print("   ✅ Model: models/malaria_model.pkl")
print("   ✅ Data: malaria_data.csv")

# Summary
print("\n" + "=" * 70)
print(" " * 20 + "TRAINING COMPLETE!")
print("=" * 70)
print(f"\n🎯 Dataset: {len(df):,} records (2023-2025: {len(df[df['year']>=2023]):,})")
print(f"🤖 Model: {best_name} Ensemble")
print(f"📊 Accuracy: {best_r2*100:.2f}%")
print(f"📉 MAE: {mean_absolute_error(y_test, best_model.predict(X_test)):.2f} cases")
print(f"✅ Ready for production!")
print("=" * 70 + "\n")

