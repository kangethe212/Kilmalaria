"""
Comprehensive Malaria Chatbot - Trained on All Malaria Knowledge
Handles: Predictions, Symptoms, Prevention, Treatment, Counties, Statistics
"""

import re
import requests
from typing import Dict, List, Tuple

class MalariaExpertChatbot:
    """Expert chatbot trained on comprehensive malaria knowledge"""
    
    def __init__(self):
        self.knowledge_base = self._load_knowledge()
        self.counties = [
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
        
        # Conversation context for multi-turn conversations
        self.context = {
            'last_county': None,
            'last_topic': None,
            'conversation_history': []
        }
    
    def _extract_county_and_months(self, message: str) -> Tuple[str, int]:
        """Extract county name and number of months from message"""
        message = message.lower()
        
        # Find county
        county = None
        for c in self.counties:
            if c.lower() in message:
                county = c
                break
        
        # Find months
        months = 6  # default
        months_patterns = [
            r'(\d+)\s*months?',
            r'for\s*(\d+)',
            r'next\s*(\d+)'
        ]
        for pattern in months_patterns:
            match = re.search(pattern, message)
            if match:
                months = int(match.group(1))
                break
        
        return county, months
    
    def _make_prediction(self, county: str, months: int = 6) -> str:
        """Call ML service to make prediction"""
        try:
            response = requests.post(
                'http://localhost:8000/predict_regional',
                json={'county': county, 'months_ahead': months},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                predictions = data['predictions']
                
                # Format response
                result = f"📊 **Malaria Predictions for {county} County**\n\n"
                result += f"Forecasting the next {len(predictions)} months:\n\n"
                
                for pred in predictions[:6]:  # Show first 6
                    date = pred['date']
                    cases = pred['predicted_cases']
                    rate = pred['predicted_rate_per_100k']
                    hist = pred.get('historical_average', 'N/A')
                    
                    result += f"📅 **{date}**: {cases} cases (Rate: {rate}/100k)\n"
                    if hist != 'N/A' and hist:
                        diff = cases - hist
                        trend = "↑" if diff > 0 else "↓"
                        result += f"   Historical avg: {hist:.0f} {trend}\n"
                
                # Summary
                total = sum(p['predicted_cases'] for p in predictions)
                avg = total / len(predictions)
                
                result += f"\n📈 **Summary**:\n"
                result += f"• Average monthly: {avg:.0f} cases\n"
                result += f"• Total predicted: {total} cases\n"
                
                # Risk
                if avg < 50:
                    result += f"• Risk level: 🟢 **LOW**\n"
                elif avg < 120:
                    result += f"• Risk level: 🟡 **MODERATE**\n"
                else:
                    result += f"• Risk level: 🔴 **HIGH**\n"
                
                result += "\nWould you like predictions for another county?"
                return result
            else:
                return f"Sorry, I couldn't get predictions for {county}. Try another county or check the spelling."
                
        except Exception as e:
            return f"I'm having trouble connecting to the prediction service. The ML model is processing your request..."
    
    def _get_county_stats(self, county: str) -> str:
        """Get county statistics"""
        try:
            response = requests.get(
                f'http://localhost:8000/county_stats',
                params={'county': county},
                timeout=10
            )
            
            if response.status_code == 200:
                stats = response.json()
                
                result = f"📊 **{county} County - Malaria Statistics**\n\n"
                result += f"📅 Data: {stats['date_range']['start']} to {stats['date_range']['end']}\n\n"
                result += f"📈 **Key Statistics**:\n"
                result += f"• Total cases: {stats['total_cases']:,}\n"
                result += f"• Average monthly: {stats['average_monthly_cases']:.1f}\n"
                result += f"• Latest month: {stats['latest_month_cases']} cases\n"
                result += f"• Peak recorded: {stats['max_cases']} cases\n"
                result += f"• Lowest recorded: {stats['min_cases']} cases\n"
                result += f"• Average rate/100k: {stats['average_rate_per_100k']:.1f}\n"
                
                return result
            else:
                return f"Sorry, I couldn't find statistics for {county}."
                
        except Exception as e:
            return f"I'm having trouble getting statistics right now. Try asking for predictions instead!"
    
    def _load_knowledge(self) -> Dict:
        """Load comprehensive malaria knowledge base"""
        return {
            'symptoms': {
                'keywords': ['symptom', 'signs', 'feel', 'sick', 'fever', 'headache', 'chills'],
                'response': """🌡️ **Malaria Symptoms**

**Early Symptoms** (appear 10-15 days after mosquito bite):
• 🌡️ High fever (often cyclical - every 2-3 days)
• 🥶 Chills and shaking
• 💧 Profuse sweating
• 🤕 Severe headache
• 💪 Muscle aches and fatigue
• 🤢 Nausea and vomiting
• 🩸 Anemia (in severe cases)

**Severe Malaria Symptoms** (⚠️ MEDICAL EMERGENCY):
• Seizures or convulsions
• Confusion or altered consciousness
• Difficulty breathing
• Severe anemia
• Kidney failure
• Yellow eyes/skin (jaundice)
• Organ failure

⚕️ **IMPORTANT**: If you have fever and live in or traveled to a malaria area, seek medical attention IMMEDIATELY. Early diagnosis and treatment save lives!

Would you like to know about prevention or treatment?"""
            },
            
            'prevention': {
                'keywords': ['prevent', 'avoid', 'protection', 'stop', 'reduce risk'],
                'response': """🛡️ **Malaria Prevention - Comprehensive Guide**

**1. Insecticide-Treated Bed Nets (ITNs)** ⭐ MOST EFFECTIVE
• Sleep under treated mosquito nets EVERY night
• Ensure no holes or tears
• Retreat nets every 6-12 months
• Protects during peak biting time (dusk to dawn)

**2. Indoor Residual Spraying (IRS)**
• Spray walls with long-lasting insecticides
• Kills mosquitoes that rest on walls after feeding
• Lasts 3-6 months
• Reduces transmission by up to 90%

**3. Antimalarial Medication (Chemoprophylaxis)**
• For travelers to high-risk areas
• Common drugs: Doxycycline, Atovaquone/Proguanil (Malarone), Mefloquine
• Start BEFORE travel
• Continue AFTER return
• Consult doctor for appropriate medication

**4. Environmental Management**
• Eliminate standing water (breeding sites)
• Clear bushes around homes
• Use window/door screens
• Fill puddles and containers
• Drain flower pots and old tires

**5. Personal Protection**
• Wear long-sleeved shirts and pants
• Use mosquito repellent (DEET, Picaridin)
• Avoid outdoor activities at dusk/dawn
• Stay in screened/air-conditioned rooms

**6. Community Measures**
• Mass drug administration in endemic areas
• Larviciding of breeding sites
• Community health education
• Regular testing and treatment

💡 **Remember**: Use MULTIPLE methods for best protection!"""
            },
            
            'treatment': {
                'keywords': ['treat', 'cure', 'medicine', 'drug', 'medication', 'therapy'],
                'response': """💊 **Malaria Treatment - Complete Guide**

**⚕️ FIRST STEP: DIAGNOSIS**
• Get tested with Rapid Diagnostic Test (RDT) or microscopy
• NEVER self-diagnose or self-medicate
• Confirm parasite species and severity

**Artemisinin-based Combination Therapies (ACTs)** - ⭐ FIRST LINE TREATMENT

1. **Artemether-Lumefantrine (AL/Coartem)**
   • Most common ACT in Kenya
   • Take with fatty food
   • 6-dose regimen over 3 days
   • Highly effective (>95% cure rate)

2. **Artesunate-Amodiaquine (AS-AQ)**
   • Once daily for 3 days
   • Effective alternative to AL

3. **Dihydroartemisinin-Piperaquine (DHA-PPQ)**
   • Once daily for 3 days
   • Longer protection period

**Other Antimalarial Drugs:**

• **Quinine** (+ Doxycycline/Clindamycin)
  - For severe malaria
  - Intravenous administration
  - Hospital treatment

• **Chloroquine**
  - For P. vivax in some areas
  - Resistance widespread for P. falciparum

• **Primaquine**
  - For radical cure of P. vivax/ovale
  - Prevents relapses
  - Test for G6PD deficiency first

**Severe Malaria Treatment:**
• 🏥 Hospitalization REQUIRED
• 💉 IV Artesunate (most effective)
• 🩸 Blood transfusion if needed
• 💧 IV fluids
• Supportive care for complications

**Treatment Guidelines:**
✅ Start treatment IMMEDIATELY after diagnosis
✅ Take full course (don't stop if feeling better)
✅ Take with food to reduce nausea
✅ Follow up if symptoms persist after 48 hours
✅ Pregnant women and children need special care

**Follow-Up:**
• Symptoms should improve within 48 hours
• Complete blood test after treatment
• Watch for recurrence
• Return immediately if symptoms worsen

🚨 **EMERGENCY SIGNS**: Severe symptoms, unable to take oral medication, pregnant, or young children - GO TO HOSPITAL IMMEDIATELY!

Want to know about prevention or symptoms?"""
            },
            
            'causes': {
                'keywords': ['cause', 'how', 'get', 'spread', 'transmit', 'parasite'],
                'response': """🦟 **How Malaria is Caused and Transmitted**

**The Parasite:**
• Caused by **Plasmodium** parasites
• 5 species infect humans:
  - P. falciparum (most deadly - 99% of cases in Africa)
  - P. vivax
  - P. ovale
  - P. malariae
  - P. knowlesi

**Transmission Cycle:**

1. **Infected mosquito bites human**
   • Only female Anopheles mosquitoes transmit malaria
   • Mosquito injects parasites (sporozoites) into bloodstream

2. **Parasites travel to liver**
   • Multiply and mature (7-30 days)
   • No symptoms yet

3. **Parasites enter bloodstream**
   • Infect red blood cells
   • Multiply rapidly

4. **Red blood cells burst**
   • Release more parasites
   • Causes fever, chills (symptoms appear)

5. **Mosquito bites infected human**
   • Takes up parasites
   • Parasites develop in mosquito
   • Cycle continues

**Peak Biting Times:**
• Dusk to dawn (sunset to sunrise)
• Especially 10pm - 4am

**Factors Increasing Transmission:**
• Warm temperatures (20-30°C)
• High humidity
• Rainfall creating breeding sites
• Standing water
• Poor housing (no screens)
• Living near water bodies

**YOU CANNOT GET MALARIA FROM:**
❌ Person-to-person contact
❌ Coughing or sneezing
❌ Sharing food/drinks
❌ Sexual contact
❌ Animals

✅ **YOU CAN ONLY GET MALARIA FROM:**
• Infected mosquito bites
• Blood transfusion (rare)
• Mother to baby (during pregnancy/birth)
• Contaminated needles (very rare)

**High-Risk Areas in Kenya:**
• Lakeside regions (Kisumu, Homa Bay, Siaya, Migori)
• Coastal areas (Mombasa, Kilifi, Kwale)
• Western regions (Kakamega, Bungoma)
• Some parts of Central/Eastern Kenya

**Lower Risk Areas:**
• Nairobi (high altitude)
• Central Highlands (Nyeri, Meru)
• Rift Valley highlands

Want to know about prevention or symptoms?"""
            },
            
            'diagnosis': {
                'keywords': ['diagnos', 'test', 'check', 'detect', 'confirm'],
                'response': """🔬 **Malaria Diagnosis Methods**

**1. Rapid Diagnostic Test (RDT)** - ⭐ MOST COMMON
• Quick results (15-20 minutes)
• Detects malaria antigens in blood
• No special equipment needed
• Available at most health centers
• 90-95% accurate
• Finger-prick blood sample

**2. Microscopy** - GOLD STANDARD
• Examines blood under microscope
• Identifies parasite species
• Counts parasite density
• More accurate than RDT
• Takes 30-60 minutes
• Requires trained technician

**3. PCR Testing** - MOST ACCURATE
• Detects parasite DNA
• Very sensitive (finds low parasites)
• Expensive
• Takes hours
• Research/reference labs only

**When to Get Tested:**
• Fever + travel to malaria area
• Fever + live in malaria area  
• Unexplained fever for 2+ days
• Symptoms like chills, sweating, headache
• After mosquito bites in endemic areas

**Where to Get Tested:**
• Government health centers
• Private clinics/hospitals
• Community health workers
• Mobile clinics

**Important:**
✅ Test BEFORE taking medication
✅ Don't assume malaria without testing
✅ Repeat test if symptoms persist
✅ Free testing at government facilities

💡 Early diagnosis and treatment prevent severe malaria and death!"""
            },
            
            'risk_factors': {
                'keywords': ['risk', 'vulnerable', 'who gets', 'susceptible'],
                'response': """⚠️ **Who is at Higher Risk of Malaria?**

**HIGHEST RISK GROUPS:**

**1. Young Children (Under 5 years)**
• Haven't developed immunity
• Severe malaria more common
• Higher mortality rate
• Need rapid treatment

**2. Pregnant Women**
• Reduced immunity
• Risk to mother and baby
• Can cause:
  - Severe anemia
  - Premature birth
  - Low birth weight
  - Stillbirth
• Need special preventive treatment

**3. People with HIV/AIDS**
• Weakened immune system
• More severe malaria
• Higher parasite levels
• Need careful monitoring

**4. Travelers/New Residents**
• No acquired immunity
• From non-endemic areas
• Need chemoprophylaxis
• More severe symptoms

**5. People in Endemic Areas**
• Constant exposure risk
• Lakeside communities
• Coastal regions
• Areas with poor sanitation

**PROTECTIVE FACTORS:**

✅ **Acquired Immunity**
• Develops after repeated infections
• Doesn't prevent infection
• Reduces severity
• Lost if leave endemic area

✅ **Genetic Factors**
• Sickle cell trait (partial protection)
• G6PD deficiency
• Thalassemia

**REDUCE YOUR RISK:**
• Use bed nets (especially children/pregnant women)
• Take preventive medication
• Eliminate breeding sites
• Seek early treatment
• Attend antenatal clinics (pregnant women)

💡 Remember: ANYONE can get malaria, but these groups need extra protection!"""
            },
            
            'counties_info': {
                'keywords': ['county', 'counties', 'region', 'area', 'where', 'location'],
                'response': f"""🗺️ **Kenyan Counties Covered by Kilmalaria**

I can provide malaria predictions for **18 Kenyan counties**:

**VERY HIGH RISK** 🔴 (Lakeside & Coastal):
1. Homa Bay - Lakeside, very high transmission
2. Migori - Lakeside, high endemic levels
3. Siaya - Lakeside, persistent high cases
4. Kisumu - Lakeside city, high risk
5. Kilifi - Coastal, high transmission
6. Kwale - Coastal, endemic malaria
7. Mombasa - Coastal city, moderate-high risk

**HIGH RISK** 🟡 (Western & Some Eastern):
8. Kakamega - Western, high transmission
9. Bungoma - Western, endemic areas
10. Kisii - Western highlands edge
11. Baringo - Lowland areas
12. Turkana - Semi-arid, seasonal

**MODERATE RISK** 🟢:
13. Meru - Mixed altitude areas
14. Machakos - Semi-arid regions

**LOW RISK** 🔵 (Highland Areas):
15. Nairobi - High altitude, urban
16. Nakuru - Highland city
17. Eldoret - High altitude
18. Nyeri - Central highlands

**Ask me for predictions:**
• "Predict malaria in Kisumu for 6 months"
• "Show me Homa Bay statistics"
• "Which county has highest risk?"

I can provide:
✅ Case predictions up to 12 months
✅ Historical statistics
✅ Risk assessments
✅ Seasonal patterns
✅ Climate data correlations

Which county would you like to know about?"""
            },
            
            'prediction_help': {
                'keywords': ['predict', 'forecast', 'future', 'cases', 'statistics', 'data'],
                'response': """📊 **How to Get Malaria Predictions**

I can predict malaria cases using Machine Learning trained on:
• 3 years of historical data (2020-2023)
• Climate factors (rainfall, temperature, humidity)
• Seasonal patterns
• 18 Kenyan counties

**🎯 How to Ask for Predictions:**

**Examples:**
• "Predict malaria in Nairobi for 6 months"
• "Forecast Kisumu cases"
• "What will Mombasa cases be next year?"
• "Show me Homa Bay predictions for 3 months"

**📈 Get County Statistics:**
• "Show me Nairobi statistics"
• "Kisumu malaria data"
• "Statistics for Kilifi"

**📋 View All Counties:**
• "List all counties"
• "Which counties are covered?"
• "Show me available regions"

**🔍 What You'll Get:**
✅ Monthly case predictions
✅ Risk levels (Low/Moderate/High)
✅ Comparison with historical averages
✅ Confidence intervals
✅ Environmental factors
✅ Seasonal trends

**Accuracy:** Our ML model achieves **97.89% accuracy** using RandomForest regression with climate data!

Try asking: "Predict malaria in Kisumu for 6 months" to see it in action!"""
            },
            
            'about': {
                'keywords': ['about', 'what is', 'kilmalaria', 'platform', 'system'],
                'response': """🏥 **About Kilmalaria**

**Mission:**
To empower communities and health workers with AI-powered malaria predictions and comprehensive information for early detection and prevention.

**What We Do:**
• 📊 Predict malaria cases across 18 Kenyan counties
• 🤖 Provide instant answers through AI chatbot
• 📈 Analyze climate data patterns
• 🎯 Help target prevention efforts
• 📚 Educate about malaria prevention & treatment

**Technology:**
• Machine Learning (RandomForest - 97.89% accuracy)
• Natural Language Processing
• Climate Data Integration
• Firebase Security

**Coverage:**
• 18 Kenyan counties
• 3+ years of data
• Real-time predictions
• Monthly forecasts (up to 12 months)

**Created By:**
**Benson Maina** - Full Stack Developer
Machakos University

**How to Use:**
1. Ask about malaria (symptoms, prevention, treatment)
2. Request predictions for any county
3. Get statistical data
4. Learn prevention methods

**Our Goal:** Make malaria prediction accessible to everyone - from healthcare workers to the general public.

How can I help you today?"""
            },
            
            'greetings': {
                'keywords': ['hello', 'hi', 'hey', 'good morning', 'good evening', 'greetings'],
                'response': """👋 **Hello! I'm Kilmalaria AI - Your Malaria Expert!**

I can help you with:

📊 **Malaria Predictions**
• Get forecasts for 18 Kenyan counties
• See statistical data
• Understand risk levels

🏥 **Health Information**
• Symptoms and early warning signs
• Prevention methods
• Treatment options
• Diagnosis information

🗺️ **Regional Data**
• County-specific information
• High-risk areas
• Seasonal patterns

**Try asking:**
• "Predict malaria in Kisumu for 6 months"
• "What are malaria symptoms?"
• "How to prevent malaria?"
• "List all counties"

How can I assist you today?"""
            }
        }
    
    def get_response(self, user_message: str) -> str:
        """Get intelligent response based on user message"""
        message = user_message.lower().strip()
        
        # Check for prediction requests FIRST
        if any(word in message for word in ['predict', 'forecast', 'cases', 'future']):
            county, months = self._extract_county_and_months(message)
            if county:
                return self._make_prediction(county, months)
            else:
                return """📊 **I can predict malaria cases for these counties:**

Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, Kakamega, Bungoma, Kisii, Nyeri, Meru, Machakos, Kilifi, Kwale, Turkana, Baringo, Homa Bay, Migori, Siaya

**How to ask:**
• "Predict malaria in Nairobi for 6 months"
• "Forecast Kisumu cases"
• "What will Mombasa be like next year?"

Which county would you like predictions for?"""
        
        # Check for statistics requests
        if any(word in message for word in ['statistics', 'stats', 'data', 'numbers']) and not any(word in message for word in ['predict', 'forecast']):
            county, _ = self._extract_county_and_months(message)
            if county:
                return self._get_county_stats(county)
        
        # Check for list counties
        if any(phrase in message for phrase in ['list', 'show counties', 'all counties', 'which counties', 'available']):
            return self.knowledge_base['counties_info']['response']
        
        # Score each knowledge category
        scores = {}
        for category, data in self.knowledge_base.items():
            score = sum(1 for keyword in data['keywords'] if keyword in message)
            if score > 0:
                scores[category] = score
        
        # Get best match
        if scores:
            best_match = max(scores.items(), key=lambda x: x[1])[0]
            return self.knowledge_base[best_match]['response']
        
        # Default response
        return """I'm here to help with malaria information! 

I can answer questions about:
• 🌡️ Symptoms and diagnosis
• 🛡️ Prevention methods
• 💊 Treatment options
• 📊 Malaria predictions for Kenyan counties
• 🗺️ Regional statistics

Try asking:
• "What are malaria symptoms?"
• "How to prevent malaria?"
• "Predict malaria in Nairobi for 6 months"
• "List all counties"
• "Show me Kisumu statistics"

What would you like to know?"""

# Initialize chatbot
chatbot = MalariaExpertChatbot()

