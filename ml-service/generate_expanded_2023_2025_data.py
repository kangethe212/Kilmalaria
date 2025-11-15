"""
Generate Expanded Malaria Dataset - Focus on 2023, 2024, 2025
Target: 15,000+ total records with emphasis on recent years
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

# All 47 Kenyan counties
ALL_COUNTIES = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kakamega',
    'Bungoma', 'Kisii', 'Nyeri', 'Meru', 'Machakos', 'Kilifi',
    'Kwale', 'Turkana', 'Baringo', 'Homa Bay', 'Migori', 'Siaya',
    'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Tana River',
    'Lamu', 'Taita Taveta', 'Kajiado', 'Makueni', 'Nyandarua', 'Nyamira',
    'Kirinyaga', 'Murang\'a', 'Kiambu', 'Embu', 'Tharaka-Nithi', 'Kitui',
    'Laikipia', 'Samburu', 'Trans-Nzoia', 'Uasin Gishu', 'Elgeyo-Marakwet',
    'Nandi', 'West Pokot', 'Kericho', 'Bomet', 'Vihiga', 'Nyandarua'
]

# County characteristics (population and malaria endemicity)
COUNTY_PROFILES = {
    # High burden counties (Lake region)
    'Kisumu': {'pop': 1200000, 'base_incidence': 350, 'climate_sensitivity': 1.3, 'altitude': 1131},
    'Homa Bay': {'pop': 1200000, 'base_incidence': 380, 'climate_sensitivity': 1.4, 'altitude': 1200},
    'Migori': {'pop': 1100000, 'base_incidence': 360, 'climate_sensitivity': 1.3, 'altitude': 1200},
    'Siaya': {'pop': 1000000, 'base_incidence': 340, 'climate_sensitivity': 1.3, 'altitude': 1200},
    'Busia': {'pop': 900000, 'base_incidence': 320, 'climate_sensitivity': 1.2, 'altitude': 1200},
    
    # Coastal counties
    'Mombasa': {'pop': 1400000, 'base_incidence': 250, 'climate_sensitivity': 1.1, 'altitude': 10},
    'Kilifi': {'pop': 1500000, 'base_incidence': 280, 'climate_sensitivity': 1.2, 'altitude': 20},
    'Kwale': {'pop': 900000, 'base_incidence': 290, 'climate_sensitivity': 1.2, 'altitude': 100},
    'Lamu': {'pop': 150000, 'base_incidence': 220, 'climate_sensitivity': 1.0, 'altitude': 5},
    'Taita Taveta': {'pop': 400000, 'base_incidence': 200, 'climate_sensitivity': 0.9, 'altitude': 800},
    'Tana River': {'pop': 300000, 'base_incidence': 310, 'climate_sensitivity': 1.2, 'altitude': 100},
    
    # Western highlands
    'Kakamega': {'pop': 1900000, 'base_incidence': 280, 'climate_sensitivity': 1.1, 'altitude': 1535},
    'Bungoma': {'pop': 1700000, 'base_incidence': 270, 'climate_sensitivity': 1.1, 'altitude': 1400},
    'Vihiga': {'pop': 600000, 'base_incidence': 260, 'climate_sensitivity': 1.0, 'altitude': 1500},
    
    # Rift Valley
    'Nakuru': {'pop': 2200000, 'base_incidence': 150, 'climate_sensitivity': 0.8, 'altitude': 1850},
    'Uasin Gishu': {'pop': 1100000, 'base_incidence': 140, 'climate_sensitivity': 0.7, 'altitude': 2000},
    'Trans-Nzoia': {'pop': 1000000, 'base_incidence': 160, 'climate_sensitivity': 0.8, 'altitude': 1800},
    'Baringo': {'pop': 700000, 'base_incidence': 200, 'climate_sensitivity': 1.0, 'altitude': 1000},
    'Elgeyo-Marakwet': {'pop': 450000, 'base_incidence': 130, 'climate_sensitivity': 0.7, 'altitude': 2100},
    'Nandi': {'pop': 900000, 'base_incidence': 180, 'climate_sensitivity': 0.9, 'altitude': 1800},
    'Kericho': {'pop': 900000, 'base_incidence': 170, 'climate_sensitivity': 0.9, 'altitude': 2000},
    'Bomet': {'pop': 900000, 'base_incidence': 160, 'climate_sensitivity': 0.8, 'altitude': 1900},
    
    # Central Kenya (Lower malaria)
    'Nairobi': {'pop': 4500000, 'base_incidence': 80, 'climate_sensitivity': 0.5, 'altitude': 1795},
    'Kiambu': {'pop': 2400000, 'base_incidence': 90, 'climate_sensitivity': 0.5, 'altitude': 1800},
    'Nyeri': {'pop': 800000, 'base_incidence': 70, 'climate_sensitivity': 0.4, 'altitude': 1800},
    'Murang\'a': {'pop': 1000000, 'base_incidence': 85, 'climate_sensitivity': 0.5, 'altitude': 1500},
    'Kirinyaga': {'pop': 600000, 'base_incidence': 95, 'climate_sensitivity': 0.6, 'altitude': 1400},
    'Nyandarua': {'pop': 650000, 'base_incidence': 75, 'climate_sensitivity': 0.4, 'altitude': 2400},
    
    # Eastern Kenya
    'Machakos': {'pop': 1400000, 'base_incidence': 120, 'climate_sensitivity': 0.7, 'altitude': 1500},
    'Makueni': {'pop': 1000000, 'base_incidence': 130, 'climate_sensitivity': 0.7, 'altitude': 1000},
    'Kitui': {'pop': 1200000, 'base_incidence': 140, 'climate_sensitivity': 0.8, 'altitude': 1100},
    'Embu': {'pop': 600000, 'base_incidence': 100, 'climate_sensitivity': 0.6, 'altitude': 1500},
    'Meru': {'pop': 1500000, 'base_incidence': 110, 'climate_sensitivity': 0.6, 'altitude': 1500},
    'Tharaka-Nithi': {'pop': 400000, 'base_incidence': 120, 'climate_sensitivity': 0.7, 'altitude': 1400},
    
    # Nyanza region
    'Kisii': {'pop': 1300000, 'base_incidence': 200, 'climate_sensitivity': 0.9, 'altitude': 1700},
    'Nyamira': {'pop': 650000, 'base_incidence': 190, 'climate_sensitivity': 0.9, 'altitude': 1700},
    
    # Arid/Semi-arid (Lower burden)
    'Turkana': {'pop': 1000000, 'base_incidence': 100, 'climate_sensitivity': 0.6, 'altitude': 500},
    'Marsabit': {'pop': 400000, 'base_incidence': 90, 'climate_sensitivity': 0.5, 'altitude': 1300},
    'Samburu': {'pop': 300000, 'base_incidence': 95, 'climate_sensitivity': 0.5, 'altitude': 900},
    'Isiolo': {'pop': 300000, 'base_incidence': 110, 'climate_sensitivity': 0.6, 'altitude': 1100},
    'Garissa': {'pop': 850000, 'base_incidence': 85, 'climate_sensitivity': 0.5, 'altitude': 150},
    'Wajir': {'pop': 800000, 'base_incidence': 80, 'climate_sensitivity': 0.5, 'altitude': 250},
    'Mandera': {'pop': 1000000, 'base_incidence': 75, 'climate_sensitivity': 0.4, 'altitude': 250},
    
    # Other counties
    'Kajiado': {'pop': 1100000, 'base_incidence': 105, 'climate_sensitivity': 0.6, 'altitude': 1600},
    'Laikipia': {'pop': 520000, 'base_incidence': 115, 'climate_sensitivity': 0.7, 'altitude': 1800},
    'West Pokot': {'pop': 600000, 'base_incidence': 150, 'climate_sensitivity': 0.8, 'altitude': 1900},
    'Eldoret': {'pop': 500000, 'base_incidence': 135, 'climate_sensitivity': 0.7, 'altitude': 2100}
}

def generate_climate_data(county, month, year):
    """Generate realistic climate data based on county, month, and year"""
    profile = COUNTY_PROFILES.get(county, {'pop': 500000, 'base_incidence': 150, 'climate_sensitivity': 0.8, 'altitude': 1000})
    altitude = profile['altitude']
    
    # Temperature (decreases with altitude)
    base_temp = 28 - (altitude / 300)  # Roughly 1°C per 300m
    
    # Seasonal variation
    if month in [12, 1, 2, 3]:  # Hot dry season
        temp_variation = random.uniform(2, 4)
    elif month in [4, 5]:  # Long rains
        temp_variation = random.uniform(-2, 0)
    elif month in [6, 7, 8]:  # Cool dry season
        temp_variation = random.uniform(-3, -1)
    else:  # Short rains
        temp_variation = random.uniform(-1, 1)
    
    temperature = base_temp + temp_variation + random.uniform(-2, 2)
    
    # Rainfall patterns
    if month in [4, 5]:  # Long rains
        rainfall = random.uniform(100, 250)
    elif month in [10, 11, 12]:  # Short rains
        rainfall = random.uniform(60, 150)
    else:  # Dry seasons
        rainfall = random.uniform(10, 80)
    
    # Coastal areas get more rain
    if altitude < 200:
        rainfall *= 1.2
    
    # Humidity (inversely related to altitude, positively to rainfall)
    base_humidity = 70 - (altitude / 100)
    humidity = base_humidity + (rainfall / 10) + random.uniform(-10, 10)
    humidity = max(30, min(95, humidity))
    
    # Climate change trend (slight warming, variable rainfall)
    year_factor = (year - 2020) * 0.05
    temperature += year_factor
    
    return round(temperature, 1), round(rainfall, 1), round(humidity, 1)

def calculate_malaria_cases(county, month, year, temperature, rainfall, humidity):
    """Calculate malaria cases with realistic patterns"""
    profile = COUNTY_PROFILES.get(county, {'pop': 500000, 'base_incidence': 150, 'climate_sensitivity': 0.8, 'altitude': 1000})
    
    base_cases = profile['base_incidence']
    sensitivity = profile['climate_sensitivity']
    population = profile['pop']
    
    # Climate impact
    climate_factor = 1.0
    
    # Temperature effect (optimal 25-28°C)
    if 25 <= temperature <= 28:
        climate_factor *= 1.3
    elif 22 <= temperature < 25:
        climate_factor *= 1.1
    elif 28 < temperature <= 32:
        climate_factor *= 1.1
    elif temperature < 20:
        climate_factor *= 0.7
    elif temperature > 35:
        climate_factor *= 0.6
    
    # Rainfall effect (1-2 months lag)
    if rainfall > 150:
        climate_factor *= 1.4
    elif rainfall > 100:
        climate_factor *= 1.2
    elif rainfall > 50:
        climate_factor *= 1.0
    else:
        climate_factor *= 0.8
    
    # Humidity effect
    if humidity > 70:
        climate_factor *= 1.1
    elif humidity < 50:
        climate_factor *= 0.9
    
    # Seasonal patterns
    if month in [5, 6, 11, 12]:  # Peak months (after rains)
        seasonal_factor = 1.3
    elif month in [4, 10]:  # Rising
        seasonal_factor = 1.1
    else:
        seasonal_factor = 1.0
    
    # Year-over-year improvement (interventions working)
    if year >= 2023:
        intervention_factor = 1 - ((year - 2022) * 0.03)  # 3% annual reduction
    else:
        intervention_factor = 1.0
    
    # Calculate cases
    cases = base_cases * climate_factor * seasonal_factor * sensitivity * intervention_factor
    cases = cases * (population / 1000000)  # Adjust for population
    
    # Add random variation
    cases *= random.uniform(0.85, 1.15)
    
    return max(5, int(cases))

print("=" * 80)
print("GENERATING EXPANDED DATASET: 2023-2025 FOCUS")
print("=" * 80)

# Load existing data to avoid duplicates
print("\n1. Loading existing data...")
try:
    existing_df = pd.read_csv('malaria_massive_data.csv')
    print(f"   Found {len(existing_df)} existing records")
    existing_records = set(zip(existing_df['county'], existing_df['year'], existing_df['month']))
except FileNotFoundError:
    print("   No existing data found, starting fresh")
    existing_records = set()

# Generate new data
print("\n2. Generating new records...")
new_records = []
years_focus = [2023, 2024, 2025]
months = range(1, 13)

record_count = 0
for county in ALL_COUNTIES:
    for year in years_focus:
        for month in months:
            # Check if record already exists
            if (county, year, month) not in existing_records:
                # Generate climate data
                temperature, rainfall, humidity = generate_climate_data(county, month, year)
                
                # Calculate cases
                cases = calculate_malaria_cases(county, month, year, temperature, rainfall, humidity)
                
                # Create date
                date = datetime(year, month, 1).strftime('%Y-%m-%d')
                
                # Population
                profile = COUNTY_PROFILES.get(county, {'pop': 500000, 'base_incidence': 150, 'climate_sensitivity': 0.8, 'altitude': 1000})
                population = profile['pop']
                
                # Interventions (increasing over time)
                if year == 2023:
                    intervention = random.choice(['none', 'LLIN', 'IRS'])
                elif year == 2024:
                    intervention = random.choice(['LLIN', 'IRS', 'IRS+LLIN'])
                else:  # 2025
                    intervention = random.choice(['IRS', 'IRS+LLIN', 'IRS+LLIN+SMC'])
                
                # Additional metrics
                incidence_per_1000 = round((cases / population) * 1000, 2)
                avg_temp_7days = temperature + random.uniform(-1, 1)
                cumulative_rainfall = rainfall + random.uniform(-20, 20)
                season = 'wet' if month in [3, 4, 5, 10, 11, 12] else 'dry'
                
                new_records.append({
                    'county': county,
                    'year': year,
                    'month': month,
                    'week': random.randint(1, 4),
                    'date': date,
                    'cases': cases,
                    'temperature': temperature,
                    'rainfall': rainfall,
                    'humidity': humidity,
                    'avg_temp_7days': round(avg_temp_7days, 2),
                    'cumulative_rainfall': round(cumulative_rainfall, 2),
                    'elevation': profile['altitude'],
                    'population': population,
                    'intervention': intervention,
                    'incidence_per_1000': incidence_per_1000,
                    'cases_lag_1': cases + random.randint(-20, 20),
                    'cases_lag_2': cases + random.randint(-30, 30),
                    'season': season,
                    'is_rainy_season': 1 if season == 'wet' else 0
                })
                
                record_count += 1
                
                if record_count % 500 == 0:
                    print(f"   Generated {record_count} records...")

print(f"\n3. Generated {record_count} new records for 2023-2025")

# Create DataFrame
new_df = pd.DataFrame(new_records)

# Combine with existing data
if len(existing_records) > 0:
    combined_df = pd.concat([existing_df, new_df], ignore_index=True)
else:
    combined_df = new_df

# Sort by county, year, month
combined_df = combined_df.sort_values(['county', 'year', 'month']).reset_index(drop=True)

# Save
output_file = 'malaria_expanded_dataset.csv'
combined_df.to_csv(output_file, index=False)

print(f"\n4. Dataset saved: {output_file}")
print(f"   Total records: {len(combined_df):,}")
print(f"   Counties: {combined_df['county'].nunique()}")
print(f"   Year range: {combined_df['year'].min()}-{combined_df['year'].max()}")

# Statistics
print("\n5. Dataset Statistics:")
print(f"   Records per year:")
for year in sorted(combined_df['year'].unique()):
    count = len(combined_df[combined_df['year'] == year])
    print(f"      {year}: {count:,} records")

print(f"\n   Total 2023-2025: {len(combined_df[combined_df['year'] >= 2023]):,} records")
print(f"   Average cases: {combined_df['cases'].mean():.1f}")
print(f"   Total cases: {combined_df['cases'].sum():,}")

print("\n" + "=" * 80)
print("DATASET GENERATION COMPLETE!")
print("=" * 80)
print(f"\n✅ Created: {output_file}")
print(f"✅ Total Records: {len(combined_df):,}")
print(f"✅ Ready for training!")

