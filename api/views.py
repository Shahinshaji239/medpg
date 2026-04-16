from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Car, TestDrive
from .serializers import CarSerializer, TestDriveSerializer
import json, re, os
import google.generativeai as genai
import datetime

class CarViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer

class TestDriveViewSet(viewsets.ModelViewSet):
    queryset = TestDrive.objects.all()
    serializer_class = TestDriveSerializer

genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    generation_config={
        "temperature": 0.1,
        "response_mime_type": "application/json",
    }
)

@api_view(['POST'])
def chat_assistant(request):
    user_message = request.data.get('message', '')
    
    now = datetime.datetime.now()
    current_date_str = now.strftime("%Y-%m-%d")
    current_day = now.strftime("%A")
    
    cars = Car.objects.all()
    cars_context = "Available Cars in our showroom:\n"
    for idx, car in enumerate(cars):
        cars_context += f"{idx}. {car.name} ({car.type}): Price ₹{car.price_inr}. Range: {car.range_km}km. Top Speed: {car.top_speed}km/h. 0-100 km/h in {car.acceleration_0_100}s. Description: {car.description}\n"

    SYSTEM_PROMPT = f"""
    You are Nova, the Aether Motors AI Assistant. Today is {current_day}, {current_date_str}.
    You control the UI for a premium car dealership. You MUST reply with a JSON object containing 'reply' (string) and 'action' (string) + 'payload' (object).
    
    SUPPORTED QUERY TYPES (Exactly 8):
    1. FILTER: Search. (Example: "SUVs under 20 Lakhs" -> action: 'FILTER', payload: {{type: 'SUV', max_price: 2000000}})
    2. COMPARE: Side-by-side. (Example: "Compare X and Y" -> action: 'COMPARE', payload: {{models: ['X', 'Y']}})
    3. NAVIGATE: Section scrolls. (Valid sections: 'models', 'compare', 'engineering', 'book', 'contact')
    4. PREFILL: Form automation. (Example: "Book for Phantom in Kochi" -> action: 'PREFILL', payload: {{model: 'Phantom', city: 'Kochi', date: 'latest'}})
    5. SPOTLIGHT: Visual focus. (Example: "Focus on Phantom" -> action: 'SPOTLIGHT', payload: {{car_name: 'Aether Phantom'}})
    6. INVENTORY: Count stock. (Example: "How many cars?" -> action: 'INVENTORY', payload: {{check: 'total'}})
    7. CURRENCY: Price toggle. (Example: "Show in USD" -> action: 'CURRENCY', payload: {{currency: 'USD'}})
    8. ANALYZE: Technical deep dive. (Example: "Which car has most range?" -> action: 'ANALYZE', payload: {{metric: 'range_km'}})

    RULES:
    - If user asks for "engineering" or "technical specs", set action: 'NAVIGATE' and section: 'engineering'.
    - If user asks for SUVs under 20 Lakhs, convert to action: 'FILTER' and max_price: 2000000.
    """

    prompt = f"""
    {SYSTEM_PROMPT}

    Current Inventory:
    {cars_context}
    
    User Inquiry: {user_message}
    """
    
    try:
        response = model.generate_content(prompt)
        json_response = json.loads(response.text)
        return Response(json_response)
    except Exception as e:
        return Response({
            "action": "NONE",
            "payload": {},
            "reply": "System processing anomaly. Please retry your request.",
            "section": ""
        })
