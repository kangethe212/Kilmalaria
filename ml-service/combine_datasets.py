import pandas as pd
import os

print("🔄 COMBINING ALL MALARIA DATASETS INTO ONE FILE...")
print("=" * 60)

# List all dataset files
dataset_files = [
    'malaria_data.csv',
    'malaria_massive_data.csv',
    'malaria_expanded_dataset.csv',
    'malaria_massive_15k_dataset.csv',
    'malaria_final_15k_dataset.csv'
]

# Check which files exist
existing_files = [f for f in dataset_files if os.path.exists(f)]

print(f"\n📂 Found {len(existing_files)} dataset files:")
for file in existing_files:
    size = os.path.getsize(file) / 1024  # KB
    lines = sum(1 for _ in open(file, encoding='utf-8')) - 1  # Exclude header
    print(f"  • {file}: {lines:,} records ({size:.1f} KB)")

# Read all datasets
all_dataframes = []
total_records_before = 0

print("\n🔍 Loading datasets...")
for file in existing_files:
    try:
        df = pd.read_csv(file)
        records = len(df)
        total_records_before += records
        all_dataframes.append(df)
        print(f"  ✅ {file}: {records:,} records loaded")
    except Exception as e:
        print(f"  ❌ {file}: Error - {str(e)}")

# Combine all dataframes
print("\n🔗 Combining datasets...")
combined_df = pd.concat(all_dataframes, ignore_index=True)
print(f"  Total records (with duplicates): {len(combined_df):,}")

# Remove duplicates
print("\n🧹 Removing duplicates...")
# Check columns to determine duplicate criteria
if 'county' in combined_df.columns and 'date' in combined_df.columns:
    # Remove duplicates based on county and date
    combined_df = combined_df.drop_duplicates(subset=['county', 'date'], keep='last')
elif 'county' in combined_df.columns and 'year' in combined_df.columns and 'month' in combined_df.columns:
    # Remove duplicates based on county, year, month
    combined_df = combined_df.drop_duplicates(subset=['county', 'year', 'month'], keep='last')
else:
    # Remove exact duplicates
    combined_df = combined_df.drop_duplicates()

print(f"  Records after removing duplicates: {len(combined_df):,}")
print(f"  Duplicates removed: {total_records_before - len(combined_df):,}")

# Sort by county and date (if date column exists)
if 'date' in combined_df.columns:
    combined_df = combined_df.sort_values(['county', 'date'])
    print("  ✅ Sorted by county and date")
elif 'year' in combined_df.columns and 'month' in combined_df.columns:
    combined_df = combined_df.sort_values(['county', 'year', 'month'])
    print("  ✅ Sorted by county, year, and month")

# Save to master file
master_file = 'malaria_master_dataset.csv'
combined_df.to_csv(master_file, index=False)
master_size = os.path.getsize(master_file) / 1024  # KB

print(f"\n✅ MASTER DATASET CREATED!")
print("=" * 60)
print(f"📊 Master File: {master_file}")
print(f"📈 Total Records: {len(combined_df):,}")
print(f"💾 File Size: {master_size:.1f} KB")
print(f"📁 Columns: {len(combined_df.columns)}")

# Show column names
print(f"\n📋 Columns in master dataset:")
for i, col in enumerate(combined_df.columns, 1):
    print(f"  {i}. {col}")

# Show statistics
if 'county' in combined_df.columns:
    unique_counties = combined_df['county'].nunique()
    print(f"\n🗺️ Coverage: {unique_counties} counties")

if 'year' in combined_df.columns:
    year_range = f"{combined_df['year'].min()}-{combined_df['year'].max()}"
    print(f"📅 Time Range: {year_range}")

if 'cases' in combined_df.columns:
    total_cases = combined_df['cases'].sum()
    avg_cases = combined_df['cases'].mean()
    print(f"🦟 Total Cases: {total_cases:,.0f}")
    print(f"📊 Average Cases: {avg_cases:,.1f}")

print("\n" + "=" * 60)
print("🎯 RECOMMENDATION:")
print(f"   Use '{master_file}' as your primary dataset")
print("   You can delete the other 5 files to save space")
print("=" * 60)

