from django.contrib import admin

# Register your models here.

from .models import User, Session, AudioFile

admin.site.register(User)
admin.site.register(Session)
admin.site.register(AudioFile)
