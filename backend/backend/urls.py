"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import  TokenRefreshView
from base.views import MyTokenObtainPairView
from base import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/sessions/', views.getSessions, name='sessions'),
    path('api/session/<str:pk>/', views.getSession, name='session'),
    path('api/session/<str:pk>/status/', views.update_session_status, name='update_session_status'),
    path('api/audio_files/', views.getAudioFiles, name='audio_files'),
    path('api/audio-files/<int:pk>/', views.get_audio_file, name='get_audio_file'),
    path('api/register/', views.register, name='register'),
    path('api/audio-files/<int:pk>/delete/', views.delete_audio_file, name='delete-audio-file'),
    path('api/audio-files/upload/', views.upload_audio_file, name='upload-audio-file'),
    path('api/audio-files/<int:pk>/update/', views.update_audio_file, name='update-audio-file'),
    path('api/artists/', views.get_artists, name='get_artists'),
    path('api/producers/', views.get_producers, name='get_producers'),
    path('api/user/', views.get_user, name='get_user'),
    path('api/book-session/', views.book_session, name='book-session'),
    path('api/audio-files/<int:pk>/download/', views.download_audio_file, name='download_audio_file'),
    path('api/session/<str:pk>/delete/', views.delete_session, name='delete_session'),
    path('api/sessions/<str:date>/', views.get_sessions_by_date, name='get_sessions_by_date'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)