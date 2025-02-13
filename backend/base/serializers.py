from rest_framework.serializers import ModelSerializer
from .models import Session, AudioFile, User
from rest_framework import serializers

class SessionSerializer(ModelSerializer):
    artist_name = serializers.CharField(source='artist.username', read_only=True)
    producer_name = serializers.CharField(source='producer.username', read_only=True)
    class Meta:
        model = Session
        fields = 'artist', 'producer', 'start', 'end', 'description', 'artist_name', 'producer_name', 'id', 'status'

class AudioFileSerializer(ModelSerializer):
    artist_name = serializers.CharField(source='artist.username', read_only=True)
    producer_name = serializers.CharField(source='producer.username', read_only=True)
    class Meta:
        model = AudioFile
        fields = '__all__'

        def create(self, validated_data):
            validated_data['producer'] = self.context['request'].user
            return super().create(validated_data)

class UserRegistrationSerializer(ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = 'username', 'password'

    def create(self, validated_data):
        user = User(username = validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user
    
class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
