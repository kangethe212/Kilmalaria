"""
Custom Rasa Actions for CliMalaria Chatbot
Interfaces with ML Service for predictions and statistics
"""

from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import requests
import os

# ML Service URL
ML_SERVICE_URL = os.getenv('ML_SERVICE_URL', 'http://ml-service:8000')

# List of all counties
COUNTIES = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kakamega',
    'Bungoma', 'Kisii', 'Nyeri', 'Meru', 'Machakos', 'Kilifi',
    'Kwale', 'Turkana', 'Baringo', 'Homa Bay', 'Migori', 'Siaya'
]


class ActionListCounties(Action):
    """List all available counties"""
    
    def name(self) -> Text:
        return "action_list_counties"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        try:
            response = requests.get(f"{ML_SERVICE_URL}/counties", timeout=10)
            response.raise_for_status()
            data = response.json()
            
            counties_list = ", ".join(data['counties'])
            message = f"I can provide malaria predictions for the following {data['count']} Kenyan counties:\n\n{counties_list}\n\nWhich county would you like to know about?"
            
            dispatcher.utter_message(text=message)
            
        except Exception as e:
            dispatcher.utter_message(
                text=f"Sorry, I'm having trouble accessing the county list right now. Here are the counties I know: {', '.join(COUNTIES[:6])}..."
            )
        
        return []


class ActionPredictMalaria(Action):
    """Predict malaria cases for a specific county"""
    
    def name(self) -> Text:
        return "action_predict_malaria"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Extract county and months from entities
        county = tracker.get_slot("county")
        months_ahead = tracker.get_slot("months_ahead")
        
        # Default months if not specified
        if not months_ahead:
            months_ahead = 6
        else:
            months_ahead = int(float(months_ahead))
        
        # Validate county
        if not county:
            dispatcher.utter_message(
                text="Please specify which county you'd like predictions for. For example, 'predict malaria in Nairobi'."
            )
            return []
        
        # Capitalize county name
        county = county.title()
        
        # Validate county exists
        if county not in COUNTIES:
            dispatcher.utter_message(
                text=f"Sorry, I don't have data for '{county}'. Please choose from: {', '.join(COUNTIES[:5])}... Type 'list counties' to see all."
            )
            return []
        
        # Make prediction request
        try:
            payload = {
                "county": county,
                "months_ahead": min(max(months_ahead, 1), 12)  # Clamp between 1-12
            }
            
            response = requests.post(
                f"{ML_SERVICE_URL}/predict_regional",
                json=payload,
                timeout=30
            )
            response.raise_for_status()
            data = response.json()
            
            # Format response
            predictions = data['predictions']
            
            message = f"📊 **Malaria Predictions for {county} County**\n\n"
            message += f"Forecasting the next {len(predictions)} months:\n\n"
            
            for pred in predictions[:6]:  # Show first 6 months
                date = pred['date']
                cases = pred['predicted_cases']
                rate = pred['predicted_rate_per_100k']
                hist_avg = pred.get('historical_average', 'N/A')
                
                message += f"📅 **{date}**: {cases} cases (Rate: {rate} per 100k)\n"
                if hist_avg != 'N/A' and hist_avg:
                    diff = cases - hist_avg
                    trend = "↑" if diff > 0 else "↓"
                    message += f"   Historical avg: {hist_avg:.0f} cases {trend}\n"
                message += "\n"
            
            if len(predictions) > 6:
                message += f"\n_(Showing first 6 of {len(predictions)} months)_\n"
            
            # Add summary
            total_predicted = sum(p['predicted_cases'] for p in predictions)
            avg_predicted = total_predicted / len(predictions)
            
            message += f"\n📈 **Summary**:\n"
            message += f"- Average monthly cases: {avg_predicted:.0f}\n"
            message += f"- Total predicted cases: {total_predicted}\n"
            
            # Risk assessment
            if avg_predicted < 50:
                risk = "LOW"
                emoji = "🟢"
            elif avg_predicted < 120:
                risk = "MODERATE"
                emoji = "🟡"
            else:
                risk = "HIGH"
                emoji = "🔴"
            
            message += f"- Risk level: {emoji} **{risk}**\n"
            
            dispatcher.utter_message(text=message)
            
        except requests.exceptions.Timeout:
            dispatcher.utter_message(
                text="Sorry, the prediction service is taking too long to respond. Please try again."
            )
        except requests.exceptions.RequestException as e:
            dispatcher.utter_message(
                text=f"Sorry, I'm having trouble getting predictions right now. Please try again later."
            )
        except Exception as e:
            dispatcher.utter_message(
                text=f"An error occurred while making predictions. Please try again."
            )
        
        return [SlotSet("county", None), SlotSet("months_ahead", None)]


class ActionGetCountyStats(Action):
    """Get statistics for a specific county"""
    
    def name(self) -> Text:
        return "action_get_county_stats"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        county = tracker.get_slot("county")
        
        if not county:
            dispatcher.utter_message(
                text="Which county's statistics would you like to see?"
            )
            return []
        
        county = county.title()
        
        if county not in COUNTIES:
            dispatcher.utter_message(
                text=f"Sorry, I don't have data for '{county}'. Please choose a valid Kenyan county."
            )
            return []
        
        try:
            response = requests.get(
                f"{ML_SERVICE_URL}/county_stats",
                params={"county": county},
                timeout=10
            )
            response.raise_for_status()
            stats = response.json()
            
            message = f"📊 **{county} County - Malaria Statistics**\n\n"
            message += f"📅 Data Period: {stats['date_range']['start']} to {stats['date_range']['end']}\n\n"
            message += f"📈 **Key Statistics**:\n"
            message += f"- Total cases (historical): {stats['total_cases']:,}\n"
            message += f"- Average monthly cases: {stats['average_monthly_cases']:.1f}\n"
            message += f"- Latest month cases: {stats['latest_month_cases']}\n"
            message += f"- Peak cases recorded: {stats['max_cases']}\n"
            message += f"- Lowest cases recorded: {stats['min_cases']}\n"
            message += f"- Average rate per 100k: {stats['average_rate_per_100k']:.1f}\n"
            
            dispatcher.utter_message(text=message)
            
        except Exception as e:
            dispatcher.utter_message(
                text="Sorry, I couldn't retrieve the statistics right now. Please try again."
            )
        
        return [SlotSet("county", None)]


class ActionMalariaInfo(Action):
    """Provide general malaria information"""
    
    def name(self) -> Text:
        return "action_malaria_info"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        message = """🦟 **About Malaria**

Malaria is a life-threatening disease caused by Plasmodium parasites transmitted through the bites of infected female Anopheles mosquitoes.

**Key Facts**:
- Caused by Plasmodium parasites (P. falciparum most deadly)
- Transmitted by infected Anopheles mosquitoes
- Preventable and curable with early diagnosis
- Endemic in tropical and subtropical regions
- High-risk areas include lakeside and coastal regions in Kenya

**Would you like to know about**:
- Prevention methods
- Symptoms
- Treatment options"""
        
        dispatcher.utter_message(text=message)
        return []


class ActionPreventionInfo(Action):
    """Provide malaria prevention information"""
    
    def name(self) -> Text:
        return "action_prevention_info"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        message = """🛡️ **Malaria Prevention Methods**

**1. Insecticide-Treated Bed Nets (ITNs)**
- Sleep under treated mosquito nets every night
- Most effective prevention method
- Protects while you sleep (peak biting time)

**2. Indoor Residual Spraying (IRS)**
- Spray walls with long-lasting insecticides
- Kills mosquitoes that rest on walls

**3. Antimalarial Medication**
- Take prophylactic drugs if traveling to high-risk areas
- Consult healthcare provider for appropriate medication

**4. Environmental Management**
- Eliminate standing water (mosquito breeding sites)
- Clear bushes around living areas
- Use window screens

**5. Personal Protection**
- Wear long-sleeved clothing
- Use mosquito repellent
- Avoid outdoor activities at dawn/dusk

💡 Prevention is better than cure! Use multiple methods for best protection."""
        
        dispatcher.utter_message(text=message)
        return []


class ActionSymptomsInfo(Action):
    """Provide malaria symptoms information"""
    
    def name(self) -> Text:
        return "action_symptoms_info"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        message = """🌡️ **Malaria Symptoms**

**Early Symptoms** (appear 10-15 days after mosquito bite):
- 🌡️ High fever (often cyclical - every 2-3 days)
- 🥶 Chills and shaking
- 💧 Profuse sweating
- 🤕 Headache
- 💪 Muscle aches and fatigue
- 🤢 Nausea and vomiting
- 🩸 Anemia (in severe cases)

**Severe Malaria Symptoms** (medical emergency):
- ⚠️ Seizures
- ⚠️ Confusion or altered consciousness
- ⚠️ Difficulty breathing
- ⚠️ Severe anemia
- ⚠️ Kidney failure
- ⚠️ Yellow eyes/skin (jaundice)

**⚕️ IMPORTANT**: 
- Seek medical attention immediately if you have fever and live/traveled to malaria area
- Early diagnosis and treatment can save lives
- Don't self-medicate - get tested first!

Type 'treatment' to learn about malaria treatment options."""
        
        dispatcher.utter_message(text=message)
        return []


class ActionTreatmentInfo(Action):
    """Provide malaria treatment information"""
    
    def name(self) -> Text:
        return "action_treatment_info"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        message = """💊 **Malaria Treatment**

**Diagnosis First**:
- ✅ Get tested with rapid diagnostic test (RDT) or microscopy
- ✅ Confirm parasite species and severity
- ✅ Never self-diagnose or self-medicate

**Treatment Options**:

**1. Artemisinin-based Combination Therapies (ACTs)** - FIRST LINE
- Most effective treatment
- Examples: Artemether-Lumefantrine (AL/Coartem)
- Complete full course even if you feel better

**2. Other Antimalarial Drugs**:
- Quinine (with antibiotics for severe cases)
- Chloroquine (for P. vivax in some areas)
- Primaquine (for radical cure of P. vivax/ovale)

**Severe Malaria Treatment**:
- 🏥 Hospitalization required
- 💉 Intravenous artesunate
- 🩸 Supportive care (fluids, blood transfusion if needed)

**⚕️ Important Guidelines**:
- Start treatment immediately after diagnosis
- Take medication exactly as prescribed
- Complete full treatment course
- Follow up if symptoms persist
- Pregnant women and children need special consideration

**Prevention After Treatment**:
- Continue using bed nets
- Take preventive measures
- Get tested if symptoms return

🚨 **Seek emergency care if**: severe symptoms, unable to take oral medication, pregnancy, or young children."""
        
        dispatcher.utter_message(text=message)
        return []

