"""
Test the new Climalaria AI Chatbot V2.0
"""

from chatbot_v2 import chatbot

print("=" * 80)
print("TESTING CLIMALARIA AI CHATBOT V2.0")
print("=" * 80)

test_questions = [
    "Hello!",
    "What are malaria symptoms?",
    "List all counties",
    "Predict malaria in Nairobi for 6 months",
    "Show me Kisumu statistics",
    "How to prevent malaria?",
    "Malaria in children",
    "Help"
]

for i, question in enumerate(test_questions, 1):
    print(f"\n{'='*80}")
    print(f"TEST {i}/8: {question}")
    print(f"{'='*80}")
    
    response = chatbot.chat(question)
    print(response)
    print()

print("=" * 80)
print("[OK] CHATBOT TESTING COMPLETE!")
print("=" * 80)

