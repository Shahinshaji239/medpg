from django.core.management.base import BaseCommand
from api.models import Car

class Command(BaseCommand):
    help = 'Seeds the database with initial car data'

    def handle(self, *args, **options):
        cars = [
            {
                "name": "Aether Phantom",
                "type": "Hypercar",
                "price_inr": 9800000,
                "range_km": 650,
                "top_speed": 410,
                "acceleration_0_100": 1.9,
                "description": "Our timeless flagship hypercar with breathtaking speed and aggressive aerodynamic styling.",
                "image_url": "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070",
                "is_flagship": True
            },
            {
                "name": "Aether Horizon",
                "type": "SUV",
                "price_inr": 6500000,
                "range_km": 800,
                "top_speed": 250,
                "acceleration_0_100": 3.8,
                "description": "The ultimate luxury SUV for cross-continental travel with unparalleled comfort.",
                "image_url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c3d9?q=80&w=2070",
                "is_flagship": False
            },
            {
                "name": "Aether Nexus",
                "type": "Sedan",
                "price_inr": 4500000,
                "range_km": 720,
                "top_speed": 220,
                "acceleration_0_100": 4.5,
                "description": "A sophisticated electric sedan designed for urban excellence and executive style.",
                "image_url": "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070",
                "is_flagship": False
            },
            {
                "name": "Aether Vibe",
                "type": "Hatchback",
                "price_inr": 2800000,
                "range_km": 500,
                "top_speed": 180,
                "acceleration_0_100": 6.2,
                "description": "Compact, agile, and vibrant—the city car that makes every drive an experience.",
                "image_url": "https://images.unsplash.com/photo-1517524008436-bbdb53cbbad6?q=80&w=2070",
                "is_flagship": False
            },
            {
                "name": "Aether Titan",
                "type": "Off-road",
                "price_inr": 8200000,
                "range_km": 600,
                "top_speed": 200,
                "acceleration_0_100": 4.0,
                "description": "Dominate any terrain with the rugged engineering of the Titan 4x4.",
                "image_url": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070",
                "is_flagship": False
            },
            {
                "name": "Aether Glide",
                "type": "Fastback",
                "price_inr": 5800000,
                "range_km": 750,
                "top_speed": 280,
                "acceleration_0_100": 3.2,
                "description": "Elegance meets velocity in our most aerodynamic silhouette yet.",
                "image_url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070",
                "is_flagship": False
            }
        ]

        for car_data in cars:
            Car.objects.get_or_create(name=car_data['name'], defaults=car_data)
            self.stdout.write(self.style.SUCCESS(f"Successfully seeded {car_data['name']}"))
