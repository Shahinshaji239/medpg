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

    prompt = f"""
    You are Nova, the Aether Motors AI Assistant. Today is {current_day}, {current_date_str}.
    You MUST reply with a JSON object containing 'reply', 'action', 'payload', and 'section'.

    PRIORITY RULES (FOLLOW STRICTLY):
    1. Navigation/Fleet: If user says "show cars", "fleet", "inventory", or "go to [X]" -> action: 'NAVIGATE', section: 'models' (or [X]).
    2. Specific Car/Recs: If asked about a specific car (e.g. "show phantom") or recommendation (e.g. "best for family") -> action: 'SPOTLIGHT', payload: {{"car_name": "Full Name"}}, section: 'models'.
    3. Currency: If asked to switch to Dollars/USD or INR -> action: 'CURRENCY', payload: {{"currency": "USD" or "INR"}}, section: 'models'.
    4. Comparison: If 2+ cars -> action: 'COMPARE', payload: {{"models": [...]}}, section: 'compare'.
    5. Booking: If reserve/test drive -> action: 'PREFILL', payload: {{...}}, section: 'book'.

    RULES:
    - YOU CAN AND MUST SWITCH CURRENCY when asked.
    - Use exact Car Names from inventory.
    - Dates: YYYY-MM-DD.

    Inventory:
    {cars_context}

    User: {user_message}
    """
    
    try:
        response = model.generate_content(prompt)
        json_response = json.loads(response.text)
        print(f"--- AI COMMAND: {json_response['action']} ---") # DEBUG LOG
        return Response(json_response)
    except Exception as e:
        print(f"--- AI ERROR: {str(e)} ---")
        return Response({
            "action": "NONE",
            "payload": {},
            "reply": f"Internal mapping error: {str(e)}",
            "section": "hero"
        })
