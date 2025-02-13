from django.shortcuts import render, get_object_or_404
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.http import FileResponse, Http404

from .serializers import SessionSerializer, AudioFileSerializer, UserRegistrationSerializer, UserSerializer
from .models import Session, AudioFile, User

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

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_audio_file(request, pk):
    try:
        audio_file = AudioFile.objects.get(id=pk)
        user = request.user
        if user.role == 'producer' and audio_file.producer == user:
            audio_file.delete()
            return Response({'detail': 'Audio file deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'detail': 'Not authorized to delete this audio file'}, status=status.HTTP_403_FORBIDDEN)
    except AudioFile.DoesNotExist:
        return Response({'detail': 'Audio file not found'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_audio_file(request):
    user = request.user
    if user.role != 'producer':
        return Response({'detail': 'Not authorized to upload audio files'}, status=status.HTTP_403_FORBIDDEN)

    serializer = AudioFileSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            # Debugging: Log the exception
            print("Exception during save:", str(e))
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        # Debugging: Log the serializer errors
        print("Serializer errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_artists(request):
    artists = User.objects.filter(role='artist')
    serializer = UserSerializer(artists, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_producers(request):
    producers = User.objects.filter(role='producer')
    serializer = UserSerializer(producers, many=True)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)



@api_view(['PUT'])
def update_audio_file(request, pk):
    try:
        audio_file = AudioFile.objects.get(pk=pk)
    except AudioFile.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if 'file' in request.FILES:
        audio_file.file = request.FILES['file']
    if 'title' in request.data:
        audio_file.title = request.data['title']
    if 'artist' in request.data:
        audio_file.artist_id = request.data['artist']
    if 'status' in request.data:
        audio_file.status = request.data['status']

    audio_file.save()
    serializer = AudioFileSerializer(audio_file)
    return Response(serializer.data)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_session(request):
    user = request.user
    producer_id = request.data.get('producer')
    artist_id = request.data.get('artist')
    start = request.data.get('start')
    end = request.data.get('end')
    description = request.data.get('description')

    if not producer_id or not artist_id or not start or not end:
        return Response({'detail': 'Producer, artist, start, and end are required'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if the producer has an accepted session at the given start and end time
    existing_sessions = Session.objects.filter(producer_id=producer_id, start=start, status='approved')
    if existing_sessions.exists():
        return Response({'detail': 'The producer is already booked for this start time'}, status=status.HTTP_400_BAD_REQUEST)

    # Determine the role of the user booking the session
    if user.role == 'artist':
        artist_id = user.id
    elif user.role == 'producer':
        if not artist_id:
            return Response({'detail': 'Artist ID is required for producers to book a session'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'detail': 'Invalid user role'}, status=status.HTTP_400_BAD_REQUEST)

    # Fetch artist and producer names
    artist = User.objects.get(id=artist_id)
    producer = User.objects.get(id=producer_id)
    title = f"{artist.username} session with {producer.username}"

    session_data = {
        'producer': producer_id,
        'artist': artist_id,
        'start': start,
        'end': end,
        'description': description,
        'status': 'pending',  # Default status
        'title': title,
    }

    serializer = SessionSerializer(data=session_data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_audio_file(request, pk):
    try:
        audio_file = AudioFile.objects.get(id=pk)
        file_path = audio_file.file.path
        file_name = audio_file.file.name

        response = FileResponse(open(file_path, 'rb'), content_type='audio/mpeg')
        response['Content-Disposition'] = f'attachment; filename="{file_name}"'
        return response
    except AudioFile.DoesNotExist:
        raise Http404("Audio file not found")
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_audio_file(request, pk):
    try:
        audio_file = AudioFile.objects.get(id=pk)
        serializer = AudioFileSerializer(audio_file, many=False)
        return Response(serializer.data)
    except AudioFile.DoesNotExist:
        return Response({'detail': 'Audio file not found'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_session(request, pk):
    try:
        session = get_object_or_404(Session, pk=pk)
        user = request.user
        if user.role == 'producer' and session.producer == user:
            session.delete()
            return Response({'detail': 'Session deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'detail': 'Not authorized to delete this session'}, status=status.HTTP_403_FORBIDDEN)
    except Session.DoesNotExist:
        return Response({'detail': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_sessions_by_date(request, date):
    sessions = Session.objects.filter(start__date=date)
    serializer = SessionSerializer(sessions, many=True)
    return Response(serializer.data)