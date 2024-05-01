from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Sensor
from rest_framework import generics, viewsets
from .serializers import UserSerializer, NoteSerializer, SensorSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import HttpResponse
from django.views import View
from .models import Note
import requests



class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class SensorViewSet(viewsets.ModelViewSet):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer
    permission_classes = [IsAuthenticated]

class SendDataToFlask(View):
    def post(self, request):
        # Retrieve the data to send
        temperature = request.POST.get('temperature')
        humidity = request.POST.get('humidity')

        # URL of the Flask server
        url = 'http://localhost:5000/data'

        # JSON data to send
        data = {'temperature': temperature, 'humidity': humidity}

        # Send a POST request with JSON data
        response = requests.post(url, json=data)

        # Check if the request was successful
        if response.ok:
            return HttpResponse("Data sent successfully to Flask server")
        else:
            return HttpResponse("Failed to send data to Flask server", status=500)
