from rest_framework.serializers import ModelSerializer
from .models import Session
from rest_framework import serializers

class SessionSerializer(ModelSerializer):
    artist_name = serializers.CharField(source='artist.username', read_only=True)
    producer_name = serializers.CharField(source='producer.username', read_only=True)
    class Meta:
        model = Session
        fields = 'artist', 'producer', 'start', 'end', 'description', 'artist_name', 'producer_name', 'id'