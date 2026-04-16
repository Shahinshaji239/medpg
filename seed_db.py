import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Car

def seed():
    # Clear existing to avoid duplicates on redeploy
    Car.objects.all().delete()
    
    cars = [
        {
            "name": "Aether Phantom",
            "type": "Hypercar",
            "price_inr": 9800000,
            "range_km": 650,
            "top_speed": 420,
            "acceleration_0_100": 1.9,
            "description": "Our timeless flagship hypercar with breathtaking speed and aggressive aerodynamic styling.",
            "image_url": "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070",
            "is_flagship": True
        },
        {
            "name": "Aether Horizon",
            "type": "SUV",
            "price_inr": 4200000,
            "range_km": 820,
            "top_speed": 210,
            "acceleration_0_100": 4.2,
            "description": "The ultimate luxury SUV for long distance atmospheric travel and off-road silence.",
            "image_url": "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=2070"
        },
        {
            "name": "Aether Nexus",
            "type": "Sedan",
            "price_inr": 2800000,
            "range_km": 710,
            "top_speed": 250,
            "acceleration_0_100": 3.8,
            "description": "Elegance meets efficiency. The silent commute redefined for the modern professional.",
            "image_url": "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070"
        },
        {
            "name": "Aether Titan",
            "type": "Off-road",
            "price_inr": 5500000,
            "range_km": 600,
            "top_speed": 180,
            "acceleration_0_100": 5.5,
            "description": "Unstoppable force built for the most extreme terrains with quad-motor independent torque.",
            "image_url": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070"
        },
        {
            "name": "Aether Vibe",
            "type": "Hatchback",
            "price_inr": 1500000,
            "range_km": 450,
            "top_speed": 170,
            "acceleration_0_100": 7.2,
            "description": "Compact, agile, and vibrant. The perfect companion for urban exploration.",
            "image_url": "https://images.unsplash.com/photo-1583121274602-3e2820c59e38?q=80&w=2070"
        },
        {
            "name": "Aether Glide",
            "type": "Fastback",
            "price_inr": 3500000,
            "range_km": 750,
            "top_speed": 280,
            "acceleration_0_100": 3.1,
            "description": "Sleek aerodynamic profile designed for minimal drag and maximum aesthetic impact.",
            "image_url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070"
        }
    ]

    for car_data in cars:
        Car.objects.create(**car_data)
    
    print(f"Successfully seeded {len(cars)} cars.")

if __name__ == "__main__":
    seed()
