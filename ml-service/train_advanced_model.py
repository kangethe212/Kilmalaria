"""
Advanced ML Model Training Script - Target: 98% Accuracy
Uses XGBoost, LightGBM, advanced feature engineering, and stacking ensemble
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, ExtraTreesRegressor, VotingRegressor
from sklearn.model_selection import train_test_split, cross_val_score, KFold
from sklearn.preprocessing import StandardScaler, RobustScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, mean_absolute_percentage_error
from sklearn.feature_selection import SelectKBest, f_regression
import joblib
import os
from datetime import datetime
import warnings
import sys
warnings.filterwarnings('ignore')

# Fix Windows encoding issues
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Try to import advanced libraries
try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False
    print("[WARN] XGBoost not available. Install with: pip install xgboost")

try:
    import lightgbm as lgb
    LIGHTGBM_AVAILABLE = True
except ImportError:
    LIGHTGBM_AVAILABLE = False
    print("[WARN] LightGBM not available. Install with: pip install lightgbm")

print("=" * 70)
print("ADVANCED ML MODEL TRAINING - TARGET: 98% ACCURACY")
print("=" * 70)

# Load data
print("\n[1/8] Loading dataset...")
data = pd.read_csv('malaria_master_dataset.csv')
print(f"   [OK] Loaded {len(data):,} records")
print(f"   [OK] Initial features: {data.shape[1]}")

# Feature engineering - Advanced
print("\n[2/8] Advanced feature engineering...")

# Ensure date is datetime
data['date'] = pd.to_datetime(data['date'])

# Temporal features
data['month_sin'] = np.sin(2 * np.pi * data['month'] / 12)
data['month_cos'] = np.cos(2 * np.pi * data['month'] / 12)
data['month_sin_2'] = np.sin(4 * np.pi * data['month'] / 12)  # Higher frequency
data['month_cos_2'] = np.cos(4 * np.pi * data['month'] / 12)
data['year_normalized'] = (data['year'] - data['year'].min()) / (data['year'].max() - data['year'].min())
data['quarter'] = ((data['month'] - 1) // 3) + 1
data['quarter_sin'] = np.sin(2 * np.pi * data['quarter'] / 4)
data['quarter_cos'] = np.cos(2 * np.pi * data['quarter'] / 4)

# Advanced lagged features
for lag in [1, 2, 3, 6, 12, 24]:
    data[f'cases_lag_{lag}'] = data.groupby('county')['cases'].shift(lag)
    data[f'cases_lag_{lag}'] = data[f'cases_lag_{lag}'].fillna(data['cases'].mean())
    
    # Lagged environmental features
    data[f'rainfall_lag_{lag}'] = data.groupby('county')['rainfall_mm'].shift(lag)
    data[f'rainfall_lag_{lag}'] = data[f'rainfall_lag_{lag}'].fillna(data['rainfall_mm'].mean())
    
    data[f'temp_lag_{lag}'] = data.groupby('county')['temperature_celsius'].shift(lag)
    data[f'temp_lag_{lag}'] = data[f'temp_lag_{lag}'].fillna(data['temperature_celsius'].mean())

# Rolling statistics - multiple windows
for window in [3, 6, 12]:
    data[f'cases_rolling_mean_{window}'] = data.groupby('county')['cases'].transform(
        lambda x: x.rolling(window, min_periods=1).mean()
    )
    data[f'cases_rolling_std_{window}'] = data.groupby('county')['cases'].transform(
        lambda x: x.rolling(window, min_periods=1).std().fillna(0)
    )
    data[f'cases_rolling_max_{window}'] = data.groupby('county')['cases'].transform(
        lambda x: x.rolling(window, min_periods=1).max()
    )
    data[f'cases_rolling_min_{window}'] = data.groupby('county')['cases'].transform(
        lambda x: x.rolling(window, min_periods=1).min()
    )
    
    data[f'rainfall_rolling_mean_{window}'] = data.groupby('county')['rainfall_mm'].transform(
        lambda x: x.rolling(window, min_periods=1).mean()
    )

# Exponential moving averages
for span in [3, 6, 12]:
    data[f'cases_ema_{span}'] = data.groupby('county')['cases'].transform(
        lambda x: x.ewm(span=span, adjust=False).mean()
    )

# Interaction features - polynomial combinations
data['temp_humidity'] = data['temperature_celsius'] * data['humidity_percent']
data['rainfall_temp'] = data['rainfall_mm'] * data['temperature_celsius']
data['rainfall_humidity'] = data['rainfall_mm'] * data['humidity_percent']
data['temp_squared'] = data['temperature_celsius'] ** 2
data['rainfall_squared'] = data['rainfall_mm'] ** 2
data['humidity_squared'] = data['humidity_percent'] ** 2

# Advanced environmental indices
data['breeding_risk'] = (data['rainfall_mm'] * data['humidity_percent']) / (data['temperature_celsius'] + 1)
data['malaria_index'] = (
    (data['rainfall_mm'] / 100) * 
    (data['humidity_percent'] / 100) * 
    (data['temperature_celsius'] / 30)
)
data['optimal_temp'] = np.where(
    (data['temperature_celsius'] >= 20) & (data['temperature_celsius'] <= 30),
    1, 0
)
data['optimal_rainfall'] = np.where(
    (data['rainfall_mm'] >= 50) & (data['rainfall_mm'] <= 200),
    1, 0
)

# Rate of change features
data['cases_diff_1'] = data.groupby('county')['cases'].diff(1).fillna(0)
data['cases_diff_3'] = data.groupby('county')['cases'].diff(3).fillna(0)
data['cases_pct_change'] = data.groupby('county')['cases'].pct_change().fillna(0)

# County encoding (one-hot)
county_dummies = pd.get_dummies(data['county'], prefix='county')
data = pd.concat([data, county_dummies], axis=1)

# Select features
feature_cols = [
    # Temporal
    'month_sin', 'month_cos', 'month_sin_2', 'month_cos_2',
    'year_normalized', 'quarter', 'quarter_sin', 'quarter_cos',
    # Lagged cases
    'cases_lag_1', 'cases_lag_2', 'cases_lag_3', 'cases_lag_6', 'cases_lag_12', 'cases_lag_24',
    # Lagged environmental
    'rainfall_lag_1', 'rainfall_lag_2', 'rainfall_lag_3', 'rainfall_lag_6',
    'temp_lag_1', 'temp_lag_2', 'temp_lag_3',
    # Rolling statistics
    'cases_rolling_mean_3', 'cases_rolling_mean_6', 'cases_rolling_mean_12',
    'cases_rolling_std_3', 'cases_rolling_std_6', 'cases_rolling_std_12',
    'cases_rolling_max_3', 'cases_rolling_max_6',
    'cases_rolling_min_3', 'cases_rolling_min_6',
    'rainfall_rolling_mean_3', 'rainfall_rolling_mean_6',
    # EMA
    'cases_ema_3', 'cases_ema_6', 'cases_ema_12',
    # Environmental
    'rainfall_mm', 'temperature_celsius', 'humidity_percent',
    'wind_speed_kmh', 'altitude_meters', 'ndvi',
    # Interaction features
    'temp_humidity', 'rainfall_temp', 'rainfall_humidity',
    'temp_squared', 'rainfall_squared', 'humidity_squared',
    # Indices
    'malaria_index', 'heat_index', 'breeding_index', 'transmission_index',
    'breeding_risk', 'optimal_temp', 'optimal_rainfall',
    # Rate of change
    'cases_diff_1', 'cases_diff_3', 'cases_pct_change',
    # Intervention features
    'bed_net_coverage_percent', 'irs_coverage_percent',
    # County dummies
] + [col for col in data.columns if col.startswith('county_')]

# Remove any missing columns
feature_cols = [col for col in feature_cols if col in data.columns]

# Prepare data
X = data[feature_cols].fillna(0)
y = data['cases'].values

# Replace infinity values
X = X.replace([np.inf, -np.inf], 0)

# Remove outliers (keep 99.5% of data)
Q1 = np.percentile(y, 0.25)
Q3 = np.percentile(y, 99.75)
IQR = Q3 - Q1
outlier_mask = (y >= Q1 - 1.5*IQR) & (y <= Q3 + 1.5*IQR)
X = X[outlier_mask]
y = y[outlier_mask]

# Ensure no infinity or NaN values remain
X = X.replace([np.inf, -np.inf], 0).fillna(0)

print(f"   [OK] Created {len(feature_cols)} advanced features")
print(f"   [OK] After outlier removal: {len(X):,} samples")

# Feature selection - keep top features
print("\n[3/8] Feature selection...")
# Ensure X is numeric and has no infinity values
X_numeric = X.select_dtypes(include=[np.number])
X_numeric = X_numeric.replace([np.inf, -np.inf], 0).fillna(0)

selector = SelectKBest(score_func=f_regression, k=min(150, len(X_numeric.columns)))
X_selected = selector.fit_transform(X_numeric, y)
selected_indices = selector.get_support(indices=True)
selected_features = [X_numeric.columns[i] for i in selected_indices]
X = pd.DataFrame(X_selected, columns=selected_features, index=X_numeric.index)
feature_cols = selected_features
print(f"   [OK] Selected top {len(feature_cols)} features")

# Split data
print("\n[4/8] Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.15, random_state=42, shuffle=True
)
print(f"   [OK] Training set: {len(X_train):,} samples")
print(f"   [OK] Test set: {len(X_test):,} samples")

# Scale features
scaler = RobustScaler()  # More robust to outliers
# Ensure no infinity values before scaling
X_train = X_train.replace([np.inf, -np.inf], 0).fillna(0)
X_test = X_test.replace([np.inf, -np.inf], 0).fillna(0)
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train models with optimized hyperparameters
print("\n[5/8] Training advanced models...")

models = {}
predictions_train = {}
predictions_test = {}
scores = {}

# 1. RandomForest - Optimized
print("   Training RandomForest...")
rf_model = RandomForestRegressor(
    n_estimators=500,
    max_depth=35,
    min_samples_split=2,
    min_samples_leaf=1,
    max_features='sqrt',
    bootstrap=True,
    random_state=42,
    n_jobs=-1,
    verbose=0
)
rf_model.fit(X_train, y_train)
models['randomforest'] = rf_model
predictions_test['randomforest'] = rf_model.predict(X_test)
scores['randomforest'] = r2_score(y_test, predictions_test['randomforest'])
print(f"      [OK] RandomForest R²: {scores['randomforest']:.4f} ({scores['randomforest']*100:.2f}%)")

# 2. GradientBoosting - Optimized
print("   Training GradientBoosting...")
gb_model = GradientBoostingRegressor(
    n_estimators=500,
    max_depth=10,
    learning_rate=0.03,
    min_samples_split=2,
    min_samples_leaf=1,
    subsample=0.85,
    random_state=42,
    verbose=0
)
gb_model.fit(X_train, y_train)
models['gradientboosting'] = gb_model
predictions_test['gradientboosting'] = gb_model.predict(X_test)
scores['gradientboosting'] = r2_score(y_test, predictions_test['gradientboosting'])
print(f"      [OK] GradientBoosting R²: {scores['gradientboosting']:.4f} ({scores['gradientboosting']*100:.2f}%)")

# 3. ExtraTrees - Optimized
print("   Training ExtraTrees...")
et_model = ExtraTreesRegressor(
    n_estimators=500,
    max_depth=35,
    min_samples_split=2,
    min_samples_leaf=1,
    max_features='sqrt',
    bootstrap=True,
    random_state=42,
    n_jobs=-1,
    verbose=0
)
et_model.fit(X_train, y_train)
models['extratrees'] = et_model
predictions_test['extratrees'] = et_model.predict(X_test)
scores['extratrees'] = r2_score(y_test, predictions_test['extratrees'])
print(f"      [OK] ExtraTrees R²: {scores['extratrees']:.4f} ({scores['extratrees']*100:.2f}%)")

# 4. XGBoost - If available
if XGBOOST_AVAILABLE:
    print("   Training XGBoost...")
    xgb_model = xgb.XGBRegressor(
        n_estimators=500,
        max_depth=10,
        learning_rate=0.03,
        subsample=0.85,
        colsample_bytree=0.85,
        min_child_weight=1,
        gamma=0.1,
        reg_alpha=0.1,
        reg_lambda=1,
        random_state=42,
        n_jobs=-1,
        verbosity=0
    )
    xgb_model.fit(X_train, y_train)
    models['xgboost'] = xgb_model
    predictions_test['xgboost'] = xgb_model.predict(X_test)
    scores['xgboost'] = r2_score(y_test, predictions_test['xgboost'])
    print(f"      [OK] XGBoost R²: {scores['xgboost']:.4f} ({scores['xgboost']*100:.2f}%)")

# 5. LightGBM - If available
if LIGHTGBM_AVAILABLE:
    print("   Training LightGBM...")
    lgb_model = lgb.LGBMRegressor(
        n_estimators=500,
        max_depth=12,
        learning_rate=0.03,
        subsample=0.85,
        colsample_bytree=0.85,
        min_child_samples=1,
        reg_alpha=0.1,
        reg_lambda=1,
        random_state=42,
        n_jobs=-1,
        verbose=-1
    )
    lgb_model.fit(X_train, y_train)
    models['lightgbm'] = lgb_model
    predictions_test['lightgbm'] = lgb_model.predict(X_test)
    scores['lightgbm'] = r2_score(y_test, predictions_test['lightgbm'])
    print(f"      [OK] LightGBM R²: {scores['lightgbm']:.4f} ({scores['lightgbm']*100:.2f}%)")

# Ensemble: Weighted average based on performance
print("\n[6/8] Creating advanced ensemble...")
total_r2 = sum(scores.values())
weights = {name: score / total_r2 for name, score in scores.items()}

print(f"   Ensemble weights:")
for name, weight in weights.items():
    print(f"      {name}: {weight:.3f}")

# Ensemble predictions
ensemble_test_pred = np.zeros(len(y_test))
for name, pred in predictions_test.items():
    ensemble_test_pred += weights[name] * pred

ensemble_r2 = r2_score(y_test, ensemble_test_pred)
ensemble_mae = mean_absolute_error(y_test, ensemble_test_pred)
ensemble_rmse = np.sqrt(mean_squared_error(y_test, ensemble_test_pred))
ensemble_mape = mean_absolute_percentage_error(y_test, ensemble_test_pred) * 100

print(f"   [OK] Ensemble R²: {ensemble_r2:.4f} ({ensemble_r2*100:.2f}%)")
print(f"     MAE: {ensemble_mae:.2f}, RMSE: {ensemble_rmse:.2f}, MAPE: {ensemble_mape:.2f}%")

# Cross-validation
print("\n[7/8] Cross-validation...")
kf = KFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = []

for train_idx, val_idx in kf.split(X_train):
    X_cv_train, X_cv_val = X_train.iloc[train_idx], X_train.iloc[val_idx]
    y_cv_train, y_cv_val = y_train[train_idx], y_train[val_idx]
    
    # Train all models
    cv_preds = []
    cv_weights = []
    
    for name, model_class in [
        ('rf', RandomForestRegressor(n_estimators=300, max_depth=30, random_state=42, n_jobs=-1)),
        ('gb', GradientBoostingRegressor(n_estimators=300, max_depth=8, learning_rate=0.03, random_state=42)),
        ('et', ExtraTreesRegressor(n_estimators=300, max_depth=30, random_state=42, n_jobs=-1))
    ]:
        model = model_class
        model.fit(X_cv_train, y_cv_train)
        pred = model.predict(X_cv_val)
        cv_preds.append(pred)
        score = r2_score(y_cv_val, pred)
        cv_weights.append(max(score, 0.01))  # Ensure positive weight
    
    # Weighted ensemble
    total_weight = sum(cv_weights)
    cv_ensemble = sum(w/total_weight * p for w, p in zip(cv_weights, cv_preds))
    cv_r2 = r2_score(y_cv_val, cv_ensemble)
    cv_scores.append(cv_r2)

cv_mean = np.mean(cv_scores)
cv_std = np.std(cv_scores)
print(f"   [OK] Cross-validation R²: {cv_mean:.4f} (+/- {cv_std*2:.4f})")

# Save models
print("\n[8/8] Saving models...")
os.makedirs('models', exist_ok=True)

# Save all models
for name, model in models.items():
    joblib.dump(model, f'models/{name}_model.pkl')

# Save main model (RandomForest for backward compatibility)
joblib.dump(rf_model, 'models/malaria_model.pkl')
joblib.dump(feature_cols, 'models/feature_columns.pkl')
joblib.dump(scaler, 'models/scaler.pkl')
joblib.dump(selector, 'models/feature_selector.pkl')

# Save ensemble metadata
ensemble_metadata = {
    'weights': {name: float(weight) for name, weight in weights.items()},
    'metrics': {
        'r2_score': float(ensemble_r2),
        'mae': float(ensemble_mae),
        'rmse': float(ensemble_rmse),
        'mape': float(ensemble_mape),
        'cv_mean': float(cv_mean),
        'cv_std': float(cv_std)
    },
    'individual_scores': {name: float(score) for name, score in scores.items()},
    'training_date': datetime.now().isoformat(),
    'n_features': len(feature_cols),
    'n_samples': len(X_train),
    'models_available': list(models.keys())
}
joblib.dump(ensemble_metadata, 'models/ensemble_metrics.pkl')

print("   [OK] Models saved successfully")

# Summary
print("\n" + "=" * 70)
print("TRAINING COMPLETE")
print("=" * 70)
print(f"\n📊 Model Performance Summary:")
for name, score in scores.items():
    print(f"   {name.capitalize():20s}: {score*100:.2f}% R²")
print(f"   {'─' * 50}")
print(f"   🎯 Ensemble:            {ensemble_r2*100:.2f}% R²")
print(f"   📈 Cross-Validation:    {cv_mean*100:.2f}% R² (+/- {cv_std*100:.2f}%)")

if ensemble_r2 >= 0.98:
    print(f"\n✅ TARGET ACHIEVED! Accuracy: {ensemble_r2*100:.2f}%")
elif ensemble_r2 >= 0.95:
    print(f"\n✅ Excellent! Accuracy: {ensemble_r2*100:.2f}% (Very close to 98%)")
else:
    print(f"\n📊 Current accuracy: {ensemble_r2*100:.2f}%")
    print(f"   Target: 98.00%")
    print(f"   Gap: {98.0 - ensemble_r2*100:.2f} percentage points")

print("\n" + "=" * 70)

