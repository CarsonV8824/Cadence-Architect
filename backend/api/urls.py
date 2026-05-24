from django.urls import path

from .views import generate_progression

urlpatterns = [
    path("generate/", generate_progression, name="generate-progression"),
]
