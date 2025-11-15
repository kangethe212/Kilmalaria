import pandas as pd
import numpy as np

print("=" * 70)
print("🔧 FIXING COUNTY NAMES TO MATCH OFFICIAL 47 COUNTIES")
print("=" * 70)

# Load dataset
df = pd.read_csv('malaria_master_dataset.csv')
print(f"\n📊 Original records: {len(df):,}")
print(f"📊 Original counties: {df['county'].nunique()}")

# County name corrections
corrections = {
    'Eldoret': 'Uasin Gishu',  # Eldoret is a city in Uasin Gishu County
    'Elgeyo Marakwet': 'Elgeyo-Marakwet',
    'Taita Taveta': 'Taita-Taveta',
    'Tharaka Nithi': 'Tharaka-Nithi',
    'Trans-Nzoia': 'Trans Nzoia'
}

print("\n🔄 Applying corrections:")
for old_name, new_name in corrections.items():
    count = len(df[df['county'] == old_name])
    if count > 0:
        df.loc[df['county'] == old_name, 'county'] = new_name
        print(f"  ✅ {old_name:20s} → {new_name:20s} ({count:,} records)")

# Remove exact duplicates after merging
print("\n🧹 Removing duplicates after merge...")
before_dedup = len(df)

# Remove duplicates based on county, year, month, date
if 'date' in df.columns:
    df = df.drop_duplicates(subset=['county', 'date'], keep='last')
elif 'year' in df.columns and 'month' in df.columns:
    df = df.drop_duplicates(subset=['county', 'year', 'month'], keep='last')

after_dedup = len(df)
removed = before_dedup - after_dedup
print(f"  Removed {removed:,} duplicates")

# Sort by county and date
if 'date' in df.columns:
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values(['county', 'date'])
elif 'year' in df.columns and 'month' in df.columns:
    df = df.sort_values(['county', 'year', 'month'])

# Save corrected dataset
df.to_csv('malaria_master_dataset.csv', index=False)

print("\n✅ CORRECTIONS COMPLETE!")
print("=" * 70)
print(f"\n📊 FINAL STATISTICS:")
print(f"   Records: {len(df):,}")
print(f"   Counties: {df['county'].nunique()}")
print(f"   Years: {df['year'].min()}-{df['year'].max()}")
print(f"   Total Cases: {df['cases'].sum():,.0f}")

print("\n📋 Final county list:")
counties = sorted(df['county'].unique())
for i, county in enumerate(counties, 1):
    count = len(df[df['county'] == county])
    print(f"  {i:2d}. {county:20s} ({count:,} records)")

print("\n" + "=" * 70)
print("✅ Dataset now has exactly 47 Kenyan counties!")
print("=" * 70)

