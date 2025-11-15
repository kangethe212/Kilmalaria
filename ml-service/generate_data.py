"""
Generate synthetic malaria case data for 18 Kenyan counties
Simulates 3 years of monthly data (2020-2023) with environmental factors
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# 18 Kenyan counties with varying malaria risk profiles
COUNTIES = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kakamega',
    'Bungoma', 'Kisii', 'Nyeri', 'Meru', 'Machakos', 'Kilifi',
    'Kwale', 'Turkana', 'Baringo', 'Homa Bay', 'Migori', 'Siaya'
]

# Risk profiles (baseline cases per 100k population)
RISK_PROFILES = {
    'Nairobi': 20,      # Low risk (urban, higher altitude)
    'Mombasa': 150,     # High risk (coastal)
    'Kisumu': 180,      # Very high risk (lakeside)
    'Nakuru': 40,       # Low-moderate risk
    'Eldoret': 30,      # Low risk (high altitude)
    'Kakamega': 120,    # High risk
    'Bungoma': 140,     # High risk
    'Kisii': 100,       # Moderate-high risk
    'Nyeri': 25,        # Low risk (high altitude)
    'Meru': 60,         # Moderate risk
    'Machakos': 50,     # Moderate risk
    'Kilifi': 160,      # Very high risk (coastal)
    'Kwale': 170,       # Very high risk (coastal)
    'Turkana': 90,      # Moderate risk
    'Baringo': 110,     # Moderate-high risk
    'Homa Bay': 200,    # Very high risk (lakeside)
    'Migori': 190,      # Very high risk (lakeside)
    'Siaya': 195,       # Very high risk (lakeside)
}

def generate_synthetic_data():
    """Generate 3 years of monthly malaria case data"""
    
    np.random.seed(42)  # For reproducibility
    
    # Date range: Jan 2020 to Dec 2023 (3 years)
    start_date = datetime(2020, 1, 1)
    end_date = datetime(2023, 12, 31)
    
    data = []
    
    for county in COUNTIES:
        base_rate = RISK_PROFILES[county]
        current_date = start_date
        
        while current_date <= end_date:
            month = current_date.month
            year = current_date.year
            
            # Seasonal patterns (malaria peaks in rainy seasons)
            # Long rains: March-May, Short rains: October-November
            if month in [3, 4, 5]:  # Long rains
                seasonal_factor = 1.5
                rainfall = np.random.uniform(100, 250)
            elif month in [10, 11]:  # Short rains
                seasonal_factor = 1.3
                rainfall = np.random.uniform(80, 180)
            else:  # Dry seasons
                seasonal_factor = 0.7
                rainfall = np.random.uniform(10, 80)
            
            # Temperature (varies by month and region)
            if 'coast' in ['Mombasa', 'Kilifi', 'Kwale'] and county in ['Mombasa', 'Kilifi', 'Kwale']:
                base_temp = 28
            elif county in ['Nyeri', 'Eldoret']:  # Highland areas
                base_temp = 18
            else:
                base_temp = 24
            
            temp_variation = 3 * np.sin(2 * np.pi * month / 12)
            temperature = base_temp + temp_variation + np.random.normal(0, 1)
            
            # Humidity (correlates with rainfall)
            humidity = 50 + (rainfall / 5) + np.random.normal(0, 5)
            humidity = np.clip(humidity, 40, 95)
            
            # Calculate cases with environmental factors
            environmental_factor = 1.0
            
            # Higher temperatures increase mosquito breeding (up to a point)
            if 20 <= temperature <= 30:
                environmental_factor *= 1.2
            
            # Higher humidity increases transmission
            if humidity > 60:
                environmental_factor *= 1.15
            
            # More rainfall increases breeding sites
            if rainfall > 100:
                environmental_factor *= 1.25
            
            # Calculate final case count
            expected_cases = base_rate * seasonal_factor * environmental_factor
            
            # Add random variation
            cases = int(np.random.poisson(expected_cases))
            
            # Add some year-over-year trend (slight decrease due to interventions)
            year_factor = 1.0 - (0.05 * (year - 2020))
            cases = int(cases * year_factor)
            
            # Ensure non-negative
            cases = max(0, cases)
            
            data.append({
                'county': county,
                'year': year,
                'month': month,
                'date': current_date.strftime('%Y-%m-%d'),
                'cases': cases,
                'rainfall_mm': round(rainfall, 2),
                'temperature_celsius': round(temperature, 2),
                'humidity_percent': round(humidity, 2),
                'population_100k': 1.0,  # Normalized per 100k
                'rate_per_100k': cases  # Since population is normalized
            })
            
            # Move to next month
            if month == 12:
                current_date = datetime(year + 1, 1, 1)
            else:
                current_date = datetime(year, month + 1, 1)
    
    # Create DataFrame
    df = pd.DataFrame(data)
    
    # Save to CSV
    df.to_csv('malaria_data.csv', index=False)
    print(f"✅ Generated {len(df)} records for {len(COUNTIES)} counties")
    print(f"📅 Date range: {df['date'].min()} to {df['date'].max()}")
    print(f"📊 Total cases: {df['cases'].sum():,}")
    print("\nSample data:")
    print(df.head(10))
    
    return df

if __name__ == "__main__":
    df = generate_synthetic_data()

