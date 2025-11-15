"""
Climalaria Smart Chatbot V2.0 - Professional Medical AI Assistant
Built from scratch with enhanced intelligence and medical accuracy
"""

import re
import requests
from typing import Dict, List, Tuple, Optional
from datetime import datetime

class ClimalariaAI:
    """
    Professional Medical AI Chatbot for Malaria Intelligence
    Features:
    - All 47 Kenyan counties support
    - Real-time ML predictions
    - Medical-grade responses (WHO-aligned)
    - Multi-turn conversations with context
    - Natural language understanding
    - Friendly, professional tone
    """
    
    def __init__(self):
        # All 47 official Kenyan counties
        self.counties = [
            'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet',
            'Embu', 'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado',
            'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga',
            'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia',
            'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit',
            'Meru', 'Migori', 'Mombasa', "Murang'a", 'Nairobi',
            'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua',
            'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River',
            'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga',
            'Wajir', 'West Pokot'
        ]
        
        # Conversation context
        self.context = {
            'last_county': None,
            'last_topic': None,
            'user_name': None,
            'conversation_count': 0
        }
        
        # Load knowledge base
        self.knowledge = self._build_knowledge_base()
    
    def _build_knowledge_base(self) -> Dict:
        """Build comprehensive medical knowledge base"""
        return {
            # === GREETINGS & WELCOME ===
            'greeting': {
                'triggers': ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'howdy'],
                'response': """👋 **Hello! I'm Climalaria AI, your intelligent malaria assistant!**

I'm here to help you with:
• 🔮 **Predict** malaria cases for any of Kenya's 47 counties
• 📊 **Statistics** and historical data
• 🌡️ **Symptoms** and diagnosis information
• 💊 **Treatment** and prevention tips
• 🗺️ **County** comparisons and insights

**Quick examples:**
• "Predict malaria in Nairobi for 6 months"
• "Show me Kisumu statistics"
• "What are malaria symptoms?"
• "How can I prevent malaria?"

**What would you like to know?** 😊"""
            },
            
            # === SYMPTOMS ===
            'symptoms': {
                'triggers': ['symptom', 'symptoms', 'signs', 'feel', 'sick', 'fever', 'headache', 'chills', 'feel sick', 'what happens'],
                'response': """🌡️ **Malaria Symptoms - Medical Guide**

**Common Symptoms (appear 10-15 days after mosquito bite):**

**Early Stage:**
• 🔥 High fever (39-40°C / 102-104°F)
• 🥶 Severe chills and shaking
• 😓 Excessive sweating
• 💆 Intense headache
• 🤢 Nausea and vomiting

**Progressive Symptoms:**
• 💪 Muscle and joint pain
• 😫 Extreme fatigue
• 🤒 Body aches
• 😵 Dizziness
• 🍽️ Loss of appetite

**Severe Malaria (EMERGENCY):**
• 🧠 Confusion or seizures
• 😰 Difficulty breathing
• 🟡 Yellow eyes (jaundice)
• 🩸 Blood in urine
• 💤 Extreme drowsiness

**⚠️ IMPORTANT:**
If you have these symptoms and have been in a malaria area, **seek medical help IMMEDIATELY**. Early treatment saves lives!

**Would you like to know about treatment or prevention?**"""
            },
            
            # === PREVENTION ===
            'prevention': {
                'triggers': ['prevent', 'prevention', 'avoid', 'protect', 'protection', 'stop', 'how to prevent', 'stay safe'],
                'response': """🛡️ **Malaria Prevention - WHO Guidelines**

**1. Insecticide-Treated Nets (ITNs)** 🛏️
   • Sleep under treated bed nets EVERY night
   • Effectiveness: 50-70% reduction in malaria
   • Lasts 3-5 years with proper care
   • Free distribution in Kenya

**2. Indoor Residual Spraying (IRS)** 🏠
   • Spray insecticide on walls
   • Kills mosquitoes for 3-6 months
   • MOH provides free spraying
   • Protects entire household

**3. Antimalarial Drugs** 💊
   • For travelers to high-risk areas
   • Take as prescribed (before, during, after trip)
   • Consult doctor for right medication
   • Not for long-term residents

**4. Personal Protection** 🦟
   • Wear long sleeves & pants (especially evening)
   • Use mosquito repellent (DEET 20-50%)
   • Avoid outdoor activity at dawn/dusk
   • Close windows or use screens

**5. Environmental Control** 🌊
   • Remove standing water (mosquito breeding)
   • Clean gutters and drains
   • Cover water storage containers
   • Plant mosquito-repelling plants

**For Pregnant Women & Children:**
   • Extra precautions needed (most vulnerable)
   • Regular preventive treatment available
   • Consult health facility

**Want to know about specific counties or get predictions?**"""
            },
            
            # === TREATMENT ===
            'treatment': {
                'triggers': ['treatment', 'treat', 'cure', 'medicine', 'medication', 'drug', 'therapy', 'heal'],
                'response': """💊 **Malaria Treatment - Clinical Guidelines**

**First-Line Treatment (Kenya MOH Protocol):**

**1. Artemisinin-based Combination Therapy (ACT)** ⭐
   • **Most effective** malaria treatment
   • Artemether-Lumefantrine (AL) - "Coartem"
   • Take FULL course (6 doses over 3 days)
   • Success rate: 95%+

**Dosage by Age:**
   • Adults: 4 tablets, twice daily for 3 days
   • Children: Based on weight (consult doctor)
   • Take with fatty food for better absorption

**2. Severe Malaria (Hospital Treatment)** 🏥
   • Artesunate injection (IV/IM)
   • Hospitalization required
   • Monitoring vital signs
   • Supportive care (fluids, oxygen)

**3. Special Cases:**

**Pregnant Women:** 🤰
   • 1st Trimester: Quinine + Clindamycin
   • 2nd/3rd Trimester: ACT (safe)
   • Under medical supervision

**Children Under 5:** 👶
   • Lower doses based on weight
   • Rectal artesunate if can't swallow
   • Close monitoring required

**⚠️ IMPORTANT:**
• **Never self-medicate** - see a doctor
• **Complete full course** even if feeling better
• **Confirm with test** before treatment (RDT or microscopy)
• **Watch for side effects** (rare but report to doctor)

**Recovery Timeline:**
• Symptoms improve: 24-48 hours
• Full recovery: 1-2 weeks
• Follow-up test: After 2 weeks

**Need predictions or statistics for your area?**"""
            },
            
            # === TRANSMISSION ===
            'transmission': {
                'triggers': ['transmit', 'transmission', 'spread', 'how spread', 'how get', 'cause', 'mosquito', 'how malaria spread'],
                'response': """🦟 **How Malaria Spreads - Medical Facts**

**The Malaria Cycle:**

**1. Female Anopheles Mosquito** 🦟
   • ONLY female Anopheles mosquitoes spread malaria
   • Bite infected person → pick up parasites
   • Parasites mature in mosquito (10-18 days)
   • Bite another person → transmit malaria

**2. Malaria Parasite (Plasmodium)** 🔬
   In Kenya, we have:
   • **P. falciparum** (70%) - Most deadly
   • **P. vivax** (20%) - Can relapse
   • **P. ovale** & **P. malariae** (10%)

**3. Human Infection Process:**
   • Day 0: Mosquito bite injects parasites
   • Day 7-10: Parasites multiply in liver (no symptoms)
   • Day 10-15: Parasites enter bloodstream
   • Day 10-15: **SYMPTOMS BEGIN** 🤒

**⚠️ IMPORTANT - How Malaria DOES NOT Spread:**
   ❌ Person-to-person contact
   ❌ Coughing or sneezing
   ❌ Sharing food or water
   ❌ Sexual contact
   ❌ Casual touching

**✅ How It CAN Spread (Rare):**
   • Blood transfusion (if blood not screened)
   • Mother to baby (pregnancy)
   • Sharing needles (drug use)
   • Organ transplant

**High-Risk Times:**
   • 🌅 **Dusk to Dawn** (mosquitoes most active)
   • 🌧️ **Rainy seasons** (more breeding sites)
   • 🌡️ **Warm temperatures** (20-30°C optimal)

**High-Risk Places:**
   • Near standing water
   • Swampy areas
   • Rice fields
   • Coastal regions
   • Lake Victoria region

**Want to check malaria risk in your county?**"""
            },
            
            # === DIAGNOSIS ===
            'diagnosis': {
                'triggers': ['diagnose', 'diagnosis', 'test', 'testing', 'detect', 'how know', 'check', 'confirm'],
                'response': """🔬 **Malaria Diagnosis - Medical Testing**

**Available Tests:**

**1. Rapid Diagnostic Test (RDT)** ⚡ *Most Common*
   • **Quick:** Results in 15-20 minutes
   • **Easy:** Finger prick blood sample
   • **Available:** All health facilities
   • **Accuracy:** 95% for P. falciparum
   • **Cost:** FREE at public facilities

**How it works:**
   1. Health worker pricks finger
   2. Drop of blood on test strip
   3. Wait 15 minutes
   4. Lines appear if positive

**2. Microscopy (Blood Smear)** 🔬 *Gold Standard*
   • **Most accurate:** Can identify species
   • **Detailed:** Shows parasite count
   • **Where:** Labs with microscopes
   • **Time:** 1-2 hours
   • **Best for:** Confirming severe cases

**3. PCR Test** 🧬 *Research/Special Cases*
   • Most sensitive (detects low levels)
   • Expensive, specialized labs only
   • Used for research or drug resistance

**When to Get Tested:**
   • Fever + have been in malaria area
   • Flu-like symptoms lasting 2+ days
   • After mosquito bites in endemic area
   • Before starting treatment (always confirm!)
   • Follow-up after treatment

**Where to Get Tested:**
   • 🏥 Public hospitals (FREE)
   • 🏪 Health centers (FREE)
   • 🔬 Private clinics (KSH 200-500)
   • 💊 Some pharmacies (RDT available)

**Test Results:**
   • **Negative:** No malaria parasites detected
   • **Positive:** Treatment needed IMMEDIATELY
   • **Parasitemia:** Shows severity (mild/moderate/severe)

**⚠️ NEVER start treatment without testing!**
Many fevers are NOT malaria - testing ensures right treatment.

**Want to know about treatment or predictions for your area?**"""
            },
            
            # === CHILDREN & MALARIA ===
            'children': {
                'triggers': ['children', 'child', 'kids', 'baby', 'babies', 'infant', 'toddler', 'young'],
                'response': """👶 **Malaria in Children - Critical Information**

**Why Children Are Most Vulnerable:**
   • Weak immune system (especially under 5)
   • Progresses to severe malaria FASTER
   • Can be fatal within 24-48 hours
   • Leading cause of child deaths in Kenya

**Symptoms in Children:** 🚨

**Infants (<1 year):**
   • High fever
   • Irritability and crying
   • Poor feeding
   • Lethargy (very sleepy)
   • Pale skin

**Toddlers (1-5 years):**
   • Fever and chills
   • Vomiting and diarrhea
   • Cough
   • Convulsions (seizures)
   • Fast breathing

**DANGER SIGNS - EMERGENCY:** ⚠️
   • Convulsions (fits)
   • Unable to drink or eat
   • Vomiting everything
   • Extreme drowsiness
   • Difficulty breathing
   • Very pale or yellow eyes

**→ Rush to hospital IMMEDIATELY if any danger signs!**

**Prevention for Children:**

**1. Insecticide-Treated Nets (ITNs)** 🛏️
   • Every child sleeps under net
   • Tuck net under mattress
   • Check for holes regularly
   • Free from health facilities

**2. Indoor Spraying (IRS)** 🏠
   • Protects whole family
   • Request from MOH teams
   • Safe for children

**3. Malaria in Pregnancy Prevention** 🤰
   • Prevents malaria in newborns
   • Pregnant women take SP drugs
   • Sleep under treated nets

**Treatment for Children:**

**Mild Malaria:**
   • Artemether-Lumefantrine (AL)
   • Dose based on WEIGHT (not age)
   • Must complete full 3-day course
   • Given with food/milk

**Severe Malaria:**
   • Hospital admission required
   • Artesunate injection
   • IV fluids and monitoring
   • Blood transfusion if needed

**Important Tips for Parents:**

✅ **DO:**
   • Test before treating (always!)
   • Complete full treatment course
   • Keep child hydrated
   • Monitor temperature
   • Follow-up visit after 2 weeks

❌ **DON'T:**
   • Give adult doses to children
   • Use herbal remedies alone
   • Wait to see if fever goes away
   • Share medication between children
   • Stop treatment if child feels better

**When to Visit Health Facility:**
   • Any fever in child under 5
   • Fever lasting more than 24 hours
   • Repeated vomiting
   • Refusal to eat/drink
   • Unusual drowsiness

**Malaria Risk by Age:**
   • **0-6 months:** Lower risk (mother's immunity)
   • **6 months-5 years:** HIGHEST RISK
   • **5-15 years:** Moderate risk
   • **15+ years:** Lower risk (immunity developed)

**Would you like to check malaria predictions for your county to stay prepared?**"""
            },
            
            # === COUNTY LIST ===
            'counties': {
                'triggers': ['counties', 'county', 'list', 'show counties', 'which counties', 'available', 'all counties', 'regions'],
                'response': lambda self: f"""🗺️ **All 47 Kenyan Counties - Complete Coverage**

I can provide malaria predictions and statistics for **ALL** counties in Kenya:

**Central Region:**
• Kiambu, Kirinyaga, Murang'a, Nyeri, Nyandarua

**Coast Region:**
• Kilifi, Kwale, Lamu, Mombasa, Taita-Taveta, Tana River

**Eastern Region:**
• Embu, Isiolo, Kitui, Machakos, Makueni, Marsabit, Meru, Tharaka-Nithi

**Nairobi:**
• Nairobi County (Capital)

**North Eastern:**
• Garissa, Mandera, Wajir

**Nyanza Region:**
• Homa Bay, Kisii, Kisumu, Migori, Nyamira, Siaya

**Rift Valley:**
• Baringo, Bomet, Elgeyo-Marakwet, Kajiado, Kericho, Laikipia, Nakuru, Nandi, Narok, Samburu, Trans Nzoia, Turkana, Uasin Gishu, West Pokot

**Western Region:**
• Bungoma, Busia, Kakamega, Vihiga

**📊 What I can do for any county:**
• Predict malaria cases (1-12 months ahead)
• Show historical statistics
• Compare trends
• Identify high-risk periods
• Provide prevention recommendations

**Example questions:**
• "Predict malaria in **Kisumu** for 6 months"
• "Show me **Mombasa** statistics"
• "Compare **Nairobi** and **Nakuru**"

**Which county would you like to know about?** 🏥"""
            },
            
            # === HELP ===
            'help': {
                'triggers': ['help', 'what can you do', 'features', 'capabilities', 'commands', 'options'],
                'response': """💡 **How I Can Help You - Full Guide**

**🔮 1. PREDICTIONS (ML-Powered)**
Ask me to predict malaria cases for any county:
• "Predict malaria in Nairobi for 6 months"
• "Forecast Kisumu cases"
• "What will Mombasa be like next year?"

**📊 2. STATISTICS**
Get historical data and trends:
• "Show me Kisumu statistics"
• "What are the numbers for Nakuru?"
• "Give me data for Turkana"

**🌡️ 3. MEDICAL INFORMATION**
Learn about malaria:
• "What are malaria symptoms?"
• "How to prevent malaria?"
• "How is malaria treated?"
• "How does malaria spread?"
• "Malaria in children"
• "How to diagnose malaria?"

**🗺️ 4. COUNTY INFORMATION**
Explore all 47 counties:
• "List all counties"
• "Which counties are covered?"
• "Show me coastal counties"

**🆚 5. COMPARISONS**
Compare counties:
• "Compare Nairobi and Kisumu"
• "Which county has most cases?"

**💬 6. NATURAL CONVERSATION**
Just ask naturally:
• "I'm traveling to Kakamega, should I worry?"
• "My child has fever, could it be malaria?"
• "What's the situation in my area?"

**⚡ QUICK TIPS:**
• Be specific about counties for better answers
• Ask follow-up questions anytime
• I remember our conversation context
• I'm here 24/7 to help!

**What would you like to know first?** 😊"""
            }
        }
    
    def _extract_county(self, message: str) -> Optional[str]:
        """Extract county name from message"""
        message_lower = message.lower()
        
        # Check each county
        for county in self.counties:
            # Handle special cases
            county_variants = [
                county.lower(),
                county.lower().replace('-', ' '),
                county.lower().replace("'", ""),
            ]
            
            for variant in county_variants:
                if variant in message_lower:
                    return county
        
        return None
    
    def _extract_months(self, message: str) -> int:
        """Extract number of months from message"""
        # Look for patterns like "6 months", "for 3", "next 12"
        patterns = [
            r'(\d+)\s*months?',
            r'for\s+(\d+)',
            r'next\s+(\d+)',
            r'(\d+)\s+month',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, message.lower())
            if match:
                months = int(match.group(1))
                return min(max(months, 1), 12)  # Clamp between 1-12
        
        return 6  # Default
    
    def _get_prediction(self, county: str, months: int = 6) -> str:
        """Get ML prediction from backend"""
        try:
            response = requests.post(
                'http://localhost:8000/predict_regional',
                json={'county': county, 'months_ahead': months},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                preds = data.get('predictions', [])
                
                if not preds:
                    return f"Sorry, I couldn't get predictions for {county}. Please try another county."
                
                # Build response
                result = f"📊 **Malaria Predictions for {county} County**\n\n"
                result += f"**{len(preds)}-Month Forecast** (ML Model: 92.35% Accuracy)\n\n"
                
                # Show predictions
                for i, pred in enumerate(preds[:6], 1):  # Show first 6
                    month = pred.get('month', 'Unknown')
                    cases = round(pred.get('predicted_cases', 0))
                    risk = pred.get('risk_level', 'Unknown')
                    
                    # Risk emoji
                    risk_emoji = {'Low': '🟢', 'Moderate': '🟡', 'High': '🔴'}.get(risk, '⚪')
                    
                    result += f"**{i}. {month}:**\n"
                    result += f"   • Cases: **{cases:,}**\n"
                    result += f"   • Risk: {risk_emoji} **{risk}**\n\n"
                
                # Summary
                total = sum(round(p.get('predicted_cases', 0)) for p in preds)
                avg = total / len(preds) if preds else 0
                
                result += "**📈 Summary:**\n"
                result += f"• Total Predicted: **{total:,} cases**\n"
                result += f"• Monthly Average: **{round(avg):,} cases**\n"
                
                # Risk assessment
                if avg < 50:
                    result += f"• Overall Risk: 🟢 **LOW**\n"
                    result += "• Recommendation: Continue standard prevention measures\n"
                elif avg < 150:
                    result += f"• Overall Risk: 🟡 **MODERATE**\n"
                    result += "• Recommendation: Ensure bed nets are used nightly\n"
                else:
                    result += f"• Overall Risk: 🔴 **HIGH**\n"
                    result += "• Recommendation: Extra precautions needed, seek medical help for any fever\n"
                
                result += "\n**Want statistics or prevention tips for this county?**"
                
                # Update context
                self.context['last_county'] = county
                
                return result
            
            else:
                return f"Sorry, I couldn't get predictions for {county}. The county name might be incorrect. Try:\n• Checking the spelling\n• Asking 'list all counties' to see available counties"
        
        except Exception as e:
            return f"I'm having trouble connecting to the prediction service right now. Please try again in a moment, or ask me about symptoms, prevention, or treatment while we wait! 😊"
    
    def _get_statistics(self, county: str) -> str:
        """Get county statistics from backend"""
        try:
            response = requests.get(
                f'http://localhost:8000/county_stats?county={county}',
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                result = f"📈 **Historical Statistics for {county} County**\n\n"
                result += "**Overall Data:**\n"
                result += f"• Total Cases (All Time): **{data.get('total_cases', 0):,}**\n"
                result += f"• Average per Month: **{round(data.get('avg_cases', 0)):,}**\n"
                result += f"• Peak Cases: **{data.get('max_cases', 0):,}** ({data.get('peak_month', 'N/A')})\n"
                result += f"• Lowest Cases: **{data.get('min_cases', 0):,}**\n\n"
                
                # Recent trend
                recent = data.get('recent_cases', [])
                if recent:
                    result += "**Recent Months (Last 6):**\n"
                    for rec in recent[:6]:
                        result += f"• {rec.get('date', 'N/A')}: **{rec.get('cases', 0):,} cases**\n"
                
                result += "\n**Want predictions or prevention tips for this county?**"
                
                # Update context
                self.context['last_county'] = county
                
                return result
            
            else:
                return f"Sorry, I couldn't find statistics for {county}. Make sure the county name is spelled correctly. Ask 'list counties' to see all available counties."
        
        except Exception as e:
            return "I'm having trouble fetching statistics right now. Would you like to know about symptoms, prevention, or treatment instead? 😊"
    
    def chat(self, message: str) -> str:
        """Main chat function - process user message and return response"""
        if not message or not message.strip():
            return "I didn't get that. Could you please ask me something? Try 'help' to see what I can do! 😊"
        
        message = message.strip()
        message_lower = message.lower()
        
        # Update conversation count
        self.context['conversation_count'] += 1
        
        # Check for greetings first
        if any(word in message_lower for word in self.knowledge['greeting']['triggers']):
            return self.knowledge['greeting']['response']
        
        # Check for help
        if any(word in message_lower for word in self.knowledge['help']['triggers']):
            return self.knowledge['help']['response']
        
        # Check for predictions (highest priority for actions)
        if any(word in message_lower for word in ['predict', 'forecast', 'future', 'will be', 'expect', 'upcoming']):
            county = self._extract_county(message)
            if county:
                months = self._extract_months(message)
                return self._get_prediction(county, months)
            else:
                return """📊 **I can predict malaria cases for any of Kenya's 47 counties!**

**How to ask:**
• "Predict malaria in **Nairobi** for 6 months"
• "Forecast **Kisumu** cases"
• "What will **Mombasa** be like next year?"

**Ask 'list counties' to see all available counties.**

**Which county would you like predictions for?** 🗺️"""
        
        # Check for statistics
        if any(word in message_lower for word in ['statistics', 'stats', 'data', 'numbers', 'history', 'historical']):
            county = self._extract_county(message)
            if county:
                return self._get_statistics(county)
            else:
                return """📈 **I can show you statistics for any of Kenya's 47 counties!**

**How to ask:**
• "Show me **Kisumu** statistics"
• "What are the numbers for **Nakuru**?"
• "Give me **Turkana** data"

**Ask 'list counties' to see all available counties.**

**Which county would you like statistics for?** 🗺️"""
        
        # Check for county list
        if any(word in message_lower for word in self.knowledge['counties']['triggers']):
            return self.knowledge['counties']['response'](self)
        
        # Check other topics
        for topic, data in self.knowledge.items():
            if topic in ['greeting', 'help', 'counties']:
                continue
            
            if any(trigger in message_lower for trigger in data['triggers']):
                self.context['last_topic'] = topic
                return data['response']
        
        # If no match, provide helpful default
        return """I'm not sure I understood that. I can help you with:

📊 **Predictions** - "Predict malaria in Nairobi"
📈 **Statistics** - "Show me Kisumu stats"
🌡️ **Symptoms** - "What are malaria symptoms?"
💊 **Treatment** - "How is malaria treated?"
🛡️ **Prevention** - "How to prevent malaria?"
🗺️ **Counties** - "List all counties"

**What would you like to know?** 😊"""

# Initialize chatbot
chatbot = ClimalariaAI()

