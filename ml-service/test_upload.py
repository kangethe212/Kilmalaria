"""
Test script for file upload endpoint
Creates a test CSV file matching the template format and tests the upload
"""
import requests
import os
import tempfile

# Create test CSV matching the template format
test_csv_content = """county,temperature,rainfall,humidity,month,year
Nairobi,25.5,120.3,65,3,2024
Mombasa,28.2,80.5,75,3,2024
Kisumu,26.8,150.0,70,3,2024
Nakuru,22.5,95.2,60,3,2024
Eldoret,20.1,110.8,55,3,2024"""

def test_upload():
    # Create temporary CSV file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
        f.write(test_csv_content)
        temp_file = f.name
    
    try:
        print("Testing file upload endpoint...")
        print(f"Created test file: {temp_file}")
        
        # Test the upload
        with open(temp_file, 'rb') as f:
            files = {'file': ('test_upload.csv', f, 'text/csv')}
            response = requests.post('http://localhost:8000/predict_from_file', files=files)
        
        print(f"\nStatus Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Upload successful!")
            print(f"Total records analyzed: {data.get('total_records_analyzed', 0)}")
            print(f"Predictions generated: {len(data.get('detailed_predictions', []))}")
            if data.get('detailed_predictions'):
                print("\nFirst prediction:")
                pred = data['detailed_predictions'][0]
                print(f"  County: {pred['county']}")
                print(f"  Predicted Cases: {pred['epidemiological_forecast']['predicted_cases']}")
                print(f"  Risk Level: {pred['who_classification']['risk_level']}")
        else:
            print("❌ Upload failed!")
            print(f"Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Flask server. Make sure it's running on port 8000")
        print("   Start it with: python app.py")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    finally:
        # Clean up
        if os.path.exists(temp_file):
            os.remove(temp_file)
            print(f"\nCleaned up test file: {temp_file}")

if __name__ == '__main__':
    test_upload()

