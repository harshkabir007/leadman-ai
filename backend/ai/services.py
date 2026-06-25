import google.generativeai as genai
from django.conf import settings
import json

genai.configure(api_key=settings.GEMINI_API_KEY)

def classify_lead(requirement_text):
    """
    Classifies a lead's requirement using Gemini API.
    Returns a tuple (category, priority)
    """
    if not settings.GEMINI_API_KEY:
        return 'Other', 'Medium'

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = f"""
        Analyze the following lead requirement and classify it into exactly one category and one priority level.
        
        Requirement: "{requirement_text}"
        
        Categories to choose from: AI Automation, Website Development, Mobile App, Chatbot, CRM, Data Analytics, Marketing, Other.
        Priority levels to choose from: High, Medium, Low. (High is for clear intent to buy or large budgets. Low is for vague queries).
        
        Return the result strictly as a valid JSON object with keys "category" and "priority", and nothing else.
        """
        response = model.generate_content(prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        result = json.loads(text)
        
        category = result.get('category', 'Other')
        priority = result.get('priority', 'Medium')
        return category, priority
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return 'Other', 'Medium'
