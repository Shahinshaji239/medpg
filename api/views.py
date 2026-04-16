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
    model_name="gemini-1.5-flash",
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
    You are the AI assistant for Aether Motors, a premium car dealership.
    Today is {current_day}, {current_date_str}. Use this to resolve relative dates (e.g., "this Saturday", "tomorrow").

    Analyze the user's message and determine the correct UI action to take.
    Return a JSON response exactly in this format WITHOUT markdown blocks:
    {{
        "action": "<ACTION_NAME>",
        "payload": <PAYLOAD_OBJECT>,
        "reply": "<Your conversational reply to the user using the details around our cars>",
        "section": "<Section ID to scroll to>"
    }}
    
    Current Inventory:
    {cars_context}
    
    Possible Actions:
    1. FILTER: {{"type": "SUV", "max_price": 2000000}}. Section: "models".
    2. COMPARE: {{"models": ["<car_name_1>", "<car_name_2>"]}}. Section: "compare".
    3. PREFILL_FORM: Extract city and date (YYYY-MM-DD). Payload: {{"model": "<Selected_model_name>", "city": "<city>", "date": "<date>"}}. Section: "book".
    4. HIGHLIGHT_CAR: Recommend a car. Payload: {{"car_name": "<car_name>"}}. Section: "models".
    5. CHANGE_CURRENCY: {{"currency": "USD"}}. Section: "pricing".
    6. CHANGE_THEME: {{"theme": "light" | "dark"}}. Section: "hero".
    7. NONE: Payload: {{}}. Section: "".
       
    User: {user_message}
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
