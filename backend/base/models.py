from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.

class User(AbstractUser):
    ROLE_CHOICES = (
        ('artist', 'Artist'),
        ('producer', 'Producer'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='artist')
    USERNAME_FIELD = 'username'

    def __str__(self):
        return self.username
    

class Session(models.Model):
    STATYUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    artist = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    producer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='produced_sessions')
    start = models.DateTimeField()
    end = models.DateTimeField()
    status = models.CharField(max_length=20, default='pending')
    description = models.TextField(default='add description')
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.artist} session with {self.producer}'
    
    
class AudioFile(models.Model):
    STATUS_CHOICES = [
        ('demo', 'Demo'),
        ('mix', 'Mix'),
        ('master', 'Master'),
    ]

    title = models.CharField(max_length=100, default='untitled')
    artist = models.ForeignKey(User, on_delete=models.CASCADE, related_name='audio_files', limit_choices_to={'role': 'artist'})
    producer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='produced_audio_files', limit_choices_to={'role': 'producer'})
    file = models.FileField(upload_to='audio_files/')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='demo')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.artist.username} - {self.get_status_display()}'
    









