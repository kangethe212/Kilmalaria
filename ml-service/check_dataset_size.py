import pandas as pd

df = pd.read_csv('malaria_master_dataset.csv')

print("\n" + "=" * 70)
print("MASTER DATASET STATISTICS")
print("=" * 70)
print(f"\nTotal Records: {len(df):,}")
print(f"Counties: {df['county'].nunique()}")
print(f"Years: {df['year'].min()}-{df['year'].max()}")
print(f"Total Cases: {df['cases'].sum():,.0f}")
print(f"File Size: {df.memory_usage(deep=True).sum() / 1024**2:.1f} MB")

print(f"\nYear Distribution:")
years = df.groupby('year').size().sort_index()
for year, count in years.items():
    pct = (count / len(df)) * 100
    print(f"  {year}: {count:,} ({pct:.1f}%)")

print(f"\nRecords per County:")
print(f"  Average: {df.groupby('county').size().mean():.0f}")
print(f"  Range: {df.groupby('county').size().min()}-{df.groupby('county').size().max()}")

print("\n" + "=" * 70)
if len(df) >= 40000:
    print(f"[OK] TARGET REACHED: {len(df):,} >= 40,000!")
else:
    print(f"[INFO] Need {40000 - len(df):,} more to reach 40,000")
print("=" * 70 + "\n")

