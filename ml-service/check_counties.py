import pandas as pd

# Official 47 counties of Kenya
OFFICIAL_COUNTIES = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet',
    'Embu', 'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado',
    'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga',
    'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia',
    'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit',
    'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi',
    'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua',
    'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River',
    'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga',
    'Wajir', 'West Pokot'
]

print("=" * 70)
print("🔍 CHECKING COUNTIES IN DATASET")
print("=" * 70)

# Load dataset
df = pd.read_csv('malaria_master_dataset.csv')
dataset_counties = sorted(df['county'].unique())

print(f"\n📊 Counties in dataset: {len(dataset_counties)}")
print(f"✅ Official Kenya counties: {len(OFFICIAL_COUNTIES)}")
print(f"❌ Extra counties: {len(dataset_counties) - len(OFFICIAL_COUNTIES)}")

print("\n📋 Counties in dataset:")
for i, county in enumerate(dataset_counties, 1):
    official = '✅' if county in OFFICIAL_COUNTIES else '❌ INVALID'
    print(f"  {i:2d}. {county:20s} {official}")

# Find invalid counties
invalid_counties = [c for c in dataset_counties if c not in OFFICIAL_COUNTIES]

if invalid_counties:
    print(f"\n❌ INVALID COUNTIES FOUND: {len(invalid_counties)}")
    for county in invalid_counties:
        count = len(df[df['county'] == county])
        print(f"  • {county} ({count:,} records)")
    
    print("\n🔧 These counties need to be removed or corrected!")
else:
    print("\n✅ All counties are valid!")

print("=" * 70)

