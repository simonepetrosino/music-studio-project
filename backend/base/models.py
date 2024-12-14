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
    artist = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    producer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='produced_sessions')
    start = models.DateTimeField()
    end = models.DateTimeField()
    description = models.TextField(default='add description')
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.artist} session with {self.producer}'








