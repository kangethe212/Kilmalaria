# CliMalaria ML Service

Flask-based machine learning service for malaria case prediction using RandomForest regression.

## Features

- 🤖 RandomForest regression model (100 trees, depth 20)
- 📊 Trained on 3 years of synthetic malaria data
- 🗺️ Predictions for 18 Kenyan counties
- ⚡ Fast API endpoints for predictions and statistics
- 🔄 Automatic feature engineering with lagged and cyclical features

## Model Details

### Algorithm
- **RandomForest Regressor**
- 100 decision trees
- Max depth: 20
- Min samples split: 5
- Min samples leaf: 2

### Features
1. **Temporal Features**:
   - Cyclical encoding (sin/cos) for month
   - Lagged cases (1, 2, 3, 6, 12 months)
   - Rolling averages (3-month window)

2. **Environmental Features**:
   - Rainfall (mm)
   - Temperature (°C)
   - Humidity (%)
   - Interaction features (temp × humidity, rainfall × humidity)

3. **Spatial Features**:
   - County one-hot encoding (18 counties)

### Training Data
- **Time period**: 2020-2023 (36 months)
- **Counties**: 18 Kenyan counties
- **Records**: ~650 training samples
- **Features**: 50+ after engineering

## API Endpoints

### 1. Health Check
```http
GET /health
```

Response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "data_loaded": true
}
```

### 2. Get Counties
```http
GET /counties
```

Response:
```json
{
  "counties": ["Nairobi", "Mombasa", ...],
  "count": 18
}
```

### 3. Get County Statistics
```http
GET /county_stats?county=Nairobi
```

Response:
```json
{
  "county": "Nairobi",
  "total_cases": 1543,
  "average_monthly_cases": 42.86,
  "max_cases": 89,
  "min_cases": 12,
  "latest_month_cases": 45,
  "average_rate_per_100k": 42.86
}
```

### 4. Predict Regional Cases
```http
POST /predict_regional
Content-Type: application/json

{
  "county": "Nairobi",
  "months_ahead": 6
}
```

Response:
```json
{
  "county": "Nairobi",
  "predictions": [
    {
      "month": 1,
      "year": 2024,
      "date": "2024-01-01",
      "predicted_cases": 45,
      "predicted_rate_per_100k": 45,
      "historical_average": 42.5,
      "environmental_factors": {
        "rainfall_mm": 45.2,
        "temperature_celsius": 23.5,
        "humidity_percent": 62.3
      }
    }
  ],
  "months_predicted": 6
}
```

## Setup & Usage

### Local Development

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Generate training data
python generate_data.py

# Train the model
python train_model.py

# Run the service
python app.py
```

Service will be available at `http://localhost:8000`

### Docker

```bash
# Build image
docker build -t climalaria-ml .

# Run container
docker run -p 8000:8000 climalaria-ml
```

## Data Generation

The `generate_data.py` script creates synthetic malaria data with:

- **Seasonal patterns**: Higher cases during rainy seasons (Mar-May, Oct-Nov)
- **Environmental correlation**: Cases increase with rainfall and optimal temperatures
- **Regional variation**: Different baseline rates based on county risk profiles
- **Temporal trends**: Slight year-over-year decrease simulating interventions

### County Risk Profiles

| Risk Level | Counties |
|------------|----------|
| **Very High** (>180 cases/100k) | Homa Bay, Migori, Siaya, Kisumu |
| **High** (120-180) | Mombasa, Kilifi, Kwale, Kakamega, Bungoma |
| **Moderate** (60-120) | Baringo, Turkana, Kisii, Meru |
| **Low** (<60) | Nairobi, Eldoret, Nyeri, Nakuru, Machakos |

## Model Performance

Typical performance metrics:
- **Test MAE**: 8-12 cases
- **Test RMSE**: 12-18 cases
- **Test R²**: 0.75-0.85

## File Structure

```
ml-service/
├── app.py              # Flask API application
├── generate_data.py    # Synthetic data generation
├── train_model.py      # Model training script
├── requirements.txt    # Python dependencies
├── Dockerfile         # Docker configuration
├── models/            # Saved model artifacts (generated)
│   ├── malaria_model.pkl
│   ├── feature_columns.pkl
│   └── last_training_date.pkl
└── malaria_data.csv   # Generated training data
```

## Dependencies

- Flask 3.0.0
- Flask-CORS 4.0.0
- scikit-learn 1.3.2
- pandas 2.1.3
- numpy 1.26.2
- joblib 1.3.2
- gunicorn 21.2.0 (production server)

## Future Improvements

- [ ] Real historical malaria data integration
- [ ] Additional environmental features (altitude, vegetation)
- [ ] Model retraining pipeline
- [ ] Model versioning and A/B testing
- [ ] Advanced models (XGBoost, LSTM)
- [ ] Uncertainty quantification
- [ ] Spatial autocorrelation features

## License

Part of the CliMalaria project for public health research.

