from django.urls import path

from .views import generate_progression, health_check

urlpatterns = [
    path("health/", health_check, name="health-check"),
    path("generate/", generate_progression, name="generate-progression"),
]
