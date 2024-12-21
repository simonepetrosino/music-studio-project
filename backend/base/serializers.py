from rest_framework.serializers import ModelSerializer
from .models import Session, AudioFile
from rest_framework import serializers

class SessionSerializer(ModelSerializer):
    artist_name = serializers.CharField(source='artist.username', read_only=True)
    producer_name = serializers.CharField(source='producer.username', read_only=True)
    title = serializers.CharField(source='description')
    class Meta:
        model = Session
        fields = 'artist', 'producer', 'start', 'end', 'description', 'artist_name', 'producer_name', 'id', 'title', 'status'

class AudioFileSerializer(ModelSerializer):
    artist_name = serializers.CharField(source='artist.username', read_only=True)
    producer_name = serializers.CharField(source='producer.username', read_only=True)
    class Meta:
        model = AudioFile
        fields = 'artist', 'producer', 'file', 'status', 'artist_name', 'producer_name', 'id', 'title'