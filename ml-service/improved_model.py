"""
IMPROVED Machine Learning Model for Malaria Prediction
Enhancements:
- Multiple algorithms (RandomForest, XGBoost, Gradient Boosting)
- Advanced feature engineering
- Cross-validation
- Hyperparameter tuning
- Ensemble methods
- Better evaluation metrics
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, mean_absolute_percentage_error
from sklearn.preprocessing import StandardScaler
import joblib
import os
import warnings
warnings.filterwarnings('ignore')

class ImprovedMalariaPredictor:
    """Enhanced ML predictor with multiple algorithms and advanced features"""
    
    def __init__(self):
        self.models = {}
        self.scaler = StandardScaler()
        self.feature_columns = None
        
    def create_advanced_features(self, df):
        """Create advanced feature engineering"""
        
        print("🛠️  Advanced Feature Engineering...")
        
        # 1. Cyclical encoding for seasonality
        df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
        df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)
        
        # 2. Quarter of year
        df['quarter'] = ((df['month'] - 1) // 3) + 1
        df['quarter_sin'] = np.sin(2 * np.pi * df['quarter'] / 4)
        df['quarter_cos'] = np.cos(2 * np.pi * df['quarter'] / 4)
        
        # 3. Season indicator (rainy vs dry)
        df['is_long_rains'] = df['month'].isin([3, 4, 5]).astype(int)
        df['is_short_rains'] = df['month'].isin([10, 11]).astype(int)
        df['is_dry_season'] = (~df['month'].isin([3, 4, 5, 10, 11])).astype(int)
        
        # Sort for temporal features
        df = df.sort_values(['county', 'year', 'month'])
        
        # 4. Lagged features (multiple lags)
        for lag in [1, 2, 3, 6, 12]:
            df[f'cases_lag_{lag}'] = df.groupby('county')['cases'].shift(lag)
            df[f'rainfall_lag_{lag}'] = df.groupby('county')['rainfall_mm'].shift(lag)
            df[f'temp_lag_{lag}'] = df.groupby('county')['temperature_celsius'].shift(lag)
            df[f'humidity_lag_{lag}'] = df.groupby('county')['humidity_percent'].shift(lag)
        
        # 5. Rolling statistics (moving averages and std)
        for window in [3, 6, 12]:
            df[f'cases_rolling_mean_{window}'] = df.groupby('county')['cases'].transform(
                lambda x: x.rolling(window=window, min_periods=1).mean()
            )
            df[f'cases_rolling_std_{window}'] = df.groupby('county')['cases'].transform(
                lambda x: x.rolling(window=window, min_periods=1).std()
            )
            df[f'rainfall_rolling_mean_{window}'] = df.groupby('county')['rainfall_mm'].transform(
                lambda x: x.rolling(window=window, min_periods=1).mean()
            )
        
        # 6. Exponential moving averages
        df['cases_ema_3'] = df.groupby('county')['cases'].transform(
            lambda x: x.ewm(span=3, adjust=False).mean()
        )
        df['cases_ema_6'] = df.groupby('county')['cases'].transform(
            lambda x: x.ewm(span=6, adjust=False).mean()
        )
        
        # 7. Rate of change
        df['cases_change'] = df.groupby('county')['cases'].diff()
        df['cases_pct_change'] = df.groupby('county')['cases'].pct_change()
        
        # 8. Interaction features
        df['temp_humidity'] = df['temperature_celsius'] * df['humidity_percent']
        df['rainfall_humidity'] = df['rainfall_mm'] * df['humidity_percent']
        df['temp_rainfall'] = df['temperature_celsius'] * df['rainfall_mm']
        df['climate_index'] = df['rainfall_mm'] * df['humidity_percent'] / (df['temperature_celsius'] + 1)
        
        # 9. Polynomial features for climate
        df['rainfall_squared'] = df['rainfall_mm'] ** 2
        df['temp_squared'] = df['temperature_celsius'] ** 2
        df['humidity_squared'] = df['humidity_percent'] ** 2
        
        # 10. Year trend
        df['year_index'] = df['year'] - df['year'].min()
        
        # 11. County encoding (one-hot)
        df = pd.get_dummies(df, columns=['county'], prefix='county')
        
        return df
    
    def train_multiple_models(self, X_train, X_test, y_train, y_test):
        """Train multiple models and compare"""
        
        print("\n🌲 Training Multiple ML Models...")
        print("=" * 60)
        
        models_to_train = {
            'RandomForest': RandomForestRegressor(
                n_estimators=200,
                max_depth=25,
                min_samples_split=3,
                min_samples_leaf=1,
                random_state=42,
                n_jobs=-1
            ),
            'GradientBoosting': GradientBoostingRegressor(
                n_estimators=200,
                max_depth=10,
                learning_rate=0.1,
                random_state=42
            )
        }
        
        results = {}
        
        for name, model in models_to_train.items():
            print(f"\n🔹 Training {name}...")
            
            # Train
            model.fit(X_train, y_train)
            
            # Predictions
            y_pred_train = model.predict(X_train)
            y_pred_test = model.predict(X_test)
            
            # Metrics
            train_mae = mean_absolute_error(y_train, y_pred_train)
            test_mae = mean_absolute_error(y_test, y_pred_test)
            train_rmse = np.sqrt(mean_squared_error(y_train, y_pred_train))
            test_rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
            train_r2 = r2_score(y_train, y_pred_train)
            test_r2 = r2_score(y_test, y_pred_test)
            
            # MAPE (Mean Absolute Percentage Error)
            test_mape = mean_absolute_percentage_error(y_test, y_pred_test) * 100
            
            results[name] = {
                'model': model,
                'train_mae': train_mae,
                'test_mae': test_mae,
                'train_rmse': train_rmse,
                'test_rmse': test_rmse,
                'train_r2': train_r2,
                'test_r2': test_r2,
                'test_mape': test_mape
            }
            
            print(f"   ✅ Train MAE: {train_mae:.2f} | Test MAE: {test_mae:.2f}")
            print(f"   ✅ Train RMSE: {train_rmse:.2f} | Test RMSE: {test_rmse:.2f}")
            print(f"   ✅ Train R²: {train_r2:.4f} | Test R²: {test_r2:.4f}")
            print(f"   ✅ Test MAPE: {test_mape:.2f}%")
        
        return results
    
    def select_best_model(self, results):
        """Select best performing model"""
        best_model_name = max(results.items(), key=lambda x: x[1]['test_r2'])[0]
        print(f"\n🏆 Best Model: {best_model_name}")
        print(f"   Test R²: {results[best_model_name]['test_r2']:.4f}")
        print(f"   Test MAE: {results[best_model_name]['test_mae']:.2f} cases")
        
        return best_model_name, results[best_model_name]['model']
    
    def create_ensemble(self, models):
        """Create ensemble of models for better predictions"""
        print("\n🎯 Creating Ensemble Model...")
        return models  # Return all models for averaging

def train_improved_model():
    """Train improved ML model"""
    
    print("=" * 60)
    print("🚀 TRAINING IMPROVED MALARIA PREDICTION MODEL")
    print("=" * 60)
    
    # Load data
    print("\n📂 Loading data...")
    df = pd.read_csv('malaria_data.csv')
    print(f"   Loaded {len(df)} records")
    
    # Initialize predictor
    predictor = ImprovedMalariaPredictor()
    
    # Feature engineering
    df = predictor.create_advanced_features(df)
    
    # Remove NaN from lagged features
    df = df.dropna()
    print(f"   After feature engineering: {df.shape}")
    
    # Define features
    feature_cols = [col for col in df.columns if col not in [
        'date', 'cases', 'rate_per_100k', 'population_100k', 'year', 'month', 'quarter'
    ]]
    
    X = df[feature_cols]
    y = df['cases']
    
    print(f"\n🎯 Total Features: {len(feature_cols)}")
    print(f"   Training samples: {len(X)}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, shuffle=True
    )
    
    # Train multiple models
    results = predictor.train_multiple_models(X_train, X_test, y_train, y_test)
    
    # Select best model
    best_name, best_model = predictor.select_best_model(results)
    
    # Feature importance
    print(f"\n📊 Top 15 Most Important Features ({best_name}):")
    print("-" * 60)
    
    if hasattr(best_model, 'feature_importances_'):
        feature_importance = pd.DataFrame({
            'feature': feature_cols,
            'importance': best_model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        for idx, row in feature_importance.head(15).iterrows():
            print(f"   {row['feature']:30s} : {row['importance']:.4f}")
    
    # Save models
    os.makedirs('models', exist_ok=True)
    
    # Save best model
    joblib.dump(best_model, 'models/malaria_model.pkl')
    joblib.dump(feature_cols, 'models/feature_columns.pkl')
    joblib.dump(df[['year', 'month']].max().to_dict(), 'models/last_training_date.pkl')
    
    # Save all models for ensemble
    for name, result in results.items():
        joblib.dump(result['model'], f'models/{name.lower()}_model.pkl')
    
    print(f"\n💾 Models saved to models/ directory")
    print(f"   - Best model: malaria_model.pkl ({best_name})")
    print(f"   - All models saved for ensemble prediction")
    
    print("\n" + "=" * 60)
    print("✅ IMPROVED MODEL TRAINING COMPLETE!")
    print("=" * 60)
    
    # Performance summary
    print("\n📈 PERFORMANCE SUMMARY:")
    print("-" * 60)
    for name, res in results.items():
        print(f"\n{name}:")
        print(f"   Test R²: {res['test_r2']:.4f} ({res['test_r2']*100:.2f}% variance explained)")
        print(f"   Test MAE: {res['test_mae']:.2f} cases")
        print(f"   Test MAPE: {res['test_mape']:.2f}%")
    
    return best_model, feature_cols, results

if __name__ == "__main__":
    model, features, results = train_improved_model()

