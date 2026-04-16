from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarViewSet, TestDriveViewSet, chat_assistant

router = DefaultRouter()
router.register(r'cars', CarViewSet)
router.register(r'bookings', TestDriveViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('chat/', chat_assistant, name='chat_assistant'),
]
