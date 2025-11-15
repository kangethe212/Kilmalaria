# CliMalaria Rasa Service

Conversational AI chatbot powered by Rasa for natural language malaria prediction queries.

## Features

- 🤖 DIET (Dual Intent and Entity Transformer) architecture
- 💬 Natural language understanding (NLU)
- 🎯 Intent classification and entity extraction
- 🔄 Custom actions for ML service integration
- 📊 Multi-turn dialogue management

## Architecture

### NLU Pipeline

1. **WhitespaceTokenizer** - Tokenize text
2. **RegexFeaturizer** - Extract regex features
3. **LexicalSyntacticFeaturizer** - Linguistic features
4. **CountVectorsFeaturizer** - Word and character n-grams
5. **DIETClassifier** - Intent & entity classification
6. **EntitySynonymMapper** - Map entity synonyms
7. **ResponseSelector** - Select appropriate responses

### Dialogue Policies

1. **MemoizationPolicy** - Remember exact patterns
2. **TEDPolicy** - Transformer-based dialogue
3. **RulePolicy** - Handle fixed rules

## Intents

### Prediction & Analysis
- `predict_regional` - Get malaria predictions for counties
- `get_county_stats` - Retrieve county statistics
- `ask_county_list` - List all available counties

### Information
- `get_malaria_info` - General malaria information
- `ask_prevention` - Prevention methods
- `ask_symptoms` - Malaria symptoms
- `ask_treatment` - Treatment options

### Conversation
- `greet` - Greetings
- `goodbye` - Farewells
- `thank` - Thank you
- `affirm` / `deny` - Yes/No responses

## Entities

- **county** - Kenyan county names (Nairobi, Mombasa, etc.)
- **months** - Number of months for prediction
- **number** - Numeric values

## Custom Actions

### ActionListCounties
Lists all 18 available counties.

```python
User: "What counties do you cover?"
Bot: "I can provide predictions for: Nairobi, Mombasa, Kisumu..."
```

### ActionPredictMalaria
Gets predictions from ML service and formats response.

```python
User: "Predict malaria in Nairobi for 6 months"
Bot: "📊 Malaria Predictions for Nairobi County
     Forecasting the next 6 months:
     📅 2024-01-01: 45 cases (Rate: 45 per 100k)..."
```

### ActionGetCountyStats
Retrieves historical statistics for a county.

```python
User: "Show me Kisumu statistics"
Bot: "📊 Kisumu County - Malaria Statistics
     Total cases: 5,234
     Average monthly: 145.4..."
```

### ActionMalariaInfo
Provides general malaria information.

### ActionPreventionInfo
Shares malaria prevention methods.

### ActionSymptomsInfo
Lists malaria symptoms.

### ActionTreatmentInfo
Explains treatment options.

## Setup & Training

### Local Development

```bash
# Install Rasa
pip install rasa==3.6.13

# Train the model
rasa train

# Run Rasa server
rasa run --enable-api --cors "*"

# Run actions server (in another terminal)
rasa run actions
```

### Test Interactively

```bash
rasa shell
```

### Train with Debugging

```bash
rasa train --debug
```

### Validate Training Data

```bash
rasa data validate
```

## Docker Deployment

### Rasa Server
```bash
docker build -f Dockerfile -t climalaria-rasa .
docker run -p 5005:5005 climalaria-rasa
```

### Actions Server
```bash
docker build -f Dockerfile.actions -t climalaria-actions .
docker run -p 5055:5055 -e ML_SERVICE_URL=http://ml-service:8000 climalaria-actions
```

## API Endpoints

### REST Webhook (Main Endpoint)
```http
POST http://localhost:5005/webhooks/rest/webhook
Content-Type: application/json

{
  "sender": "user123",
  "message": "Predict malaria in Nairobi"
}
```

Response:
```json
[
  {
    "recipient_id": "user123",
    "text": "📊 Malaria Predictions for Nairobi County..."
  }
]
```

### Health Check
```http
GET http://localhost:5005/
```

## Training Data Structure

### NLU Examples (`data/nlu.yml`)
```yaml
- intent: predict_regional
  examples: |
    - predict malaria in [Nairobi](county)
    - forecast [Kisumu](county) for [6](months) months
    - what will malaria be in [Mombasa](county)
```

### Stories (`data/stories.yml`)
```yaml
- story: prediction flow
  steps:
    - intent: greet
    - action: utter_greet
    - intent: predict_regional
    - action: action_predict_malaria
```

### Rules (`data/rules.yml`)
```yaml
- rule: Say goodbye
  steps:
    - intent: goodbye
    - action: utter_goodbye
```

## Example Conversations

### Prediction Query
```
User: Hi
Bot: Hello! I'm CliMalaria, your malaria prediction assistant...

User: Predict malaria in Nairobi for 3 months
Bot: 📊 Malaria Predictions for Nairobi County
     Forecasting the next 3 months:
     📅 2024-01-01: 45 cases (Rate: 45 per 100k)
     ...

User: Thanks!
Bot: You're welcome! Let me know if you need anything else.
```

### Information Query
```
User: What are malaria symptoms?
Bot: 🌡️ Malaria Symptoms
     Early Symptoms (10-15 days after bite):
     - High fever
     - Chills and shaking
     ...
```

## Configuration Files

- **config.yml** - NLU & dialogue configuration
- **domain.yml** - Intents, entities, slots, actions, responses
- **endpoints.yml** - Action server & tracker store configuration
- **credentials.yml** - Channel credentials (REST, etc.)

## Environment Variables

- `ML_SERVICE_URL` - URL of the ML service (default: http://ml-service:8000)
- `RASA_NLU_LOG_LEVEL` - Logging level (INFO, DEBUG, etc.)

## Performance Tuning

### For Better Accuracy
- Add more training examples per intent (20+ recommended)
- Include diverse phrasings
- Add entity synonyms
- Use lookup tables for counties

### For Faster Training
- Reduce epochs in config.yml
- Use smaller models
- Cache featurizers

## Troubleshooting

**Actions not working**: Check that actions server is running and ML_SERVICE_URL is correct

**Low accuracy**: Add more training examples and validate data

**Slow responses**: Check ML service response time and network latency

## File Structure

```
rasa-service/
├── config.yml          # Rasa configuration
├── domain.yml          # Dialogue domain
├── credentials.yml     # API credentials
├── endpoints.yml       # Service endpoints
├── data/
│   ├── nlu.yml        # NLU training data
│   ├── stories.yml    # Conversation stories
│   └── rules.yml      # Fixed rules
├── actions/
│   ├── __init__.py
│   └── actions.py     # Custom actions
├── models/            # Trained models (generated)
├── Dockerfile         # Rasa server Docker
└── Dockerfile.actions # Actions server Docker
```

## Future Improvements

- [ ] Add more counties and regions
- [ ] Support multiple languages (Swahili)
- [ ] Voice interface integration
- [ ] Sentiment analysis
- [ ] Contextual follow-up questions
- [ ] Export conversation summaries
- [ ] Integration with WhatsApp/Telegram

## License

Part of the CliMalaria project for public health innovation.

