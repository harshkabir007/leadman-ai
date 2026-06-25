from django.urls import path
from .views import track_open, track_click

urlpatterns = [
    path('open/<str:tracking_id>/', track_open, name='track_open'),
    path('click/<str:tracking_id>/', track_click, name='track_click'),
]
