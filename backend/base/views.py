from django.shortcuts import render
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import SessionSerializer, AudioFileSerializer
from .models import Session

# Create your views here.

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['role'] = user.role
        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getSessions(request):
    user = request.user
    if user.role == 'artist':
        session = user.sessions.all()
    else:
        session = user.produced_sessions.all()
    serializer = SessionSerializer(session, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getSession(request, pk):
    session = Session.objects.get(id=pk)
    serializer = SessionSerializer(session, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAudioFiles(request):
    user = request.user
    if user.role == 'artist':
        audio_files = user.audio_files.all()
    else:
        audio_files = user.produced_audio_files.all()
    serializer = AudioFileSerializer(audio_files, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_session_status(request, pk):
    try:
        session = Session.objects.get(id=pk)
    except Session.DoesNotExist:
        return Response({'detail': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.user != session.producer:
        return Response({'detail': 'Not authorized to update this session'}, status=status.HTTP_403_FORBIDDEN)

    data = request.data
    session.status = data.get('status', session.status)
    session.save()

    serializer = SessionSerializer(session)
    return Response(serializer.data, status=status.HTTP_200_OK)