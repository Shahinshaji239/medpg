from django.db import models

class Car(models.Model):
    TYPE_CHOICES = (
        ('SUV', 'SUV'),
        ('Sedan', 'Sedan'),
        ('Hypercar', 'Hypercar'),
        ('Hatchback', 'Hatchback'),
    )
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    price_inr = models.PositiveBigIntegerField(help_text="Price in INR")
    description = models.TextField()
    range_km = models.PositiveIntegerField(help_text="Range in kilometers")
    top_speed = models.PositiveIntegerField(help_text="Top speed in km/h")
    acceleration_0_100 = models.FloatField(help_text="0-100 km/h in seconds")
    image_url = models.URLField()
    is_flagship = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class TestDrive(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    visitor_name = models.CharField(max_length=100)
    city = models.CharField(max_length=50)
    preferred_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.visitor_name} - {self.car.name} in {self.city}"
