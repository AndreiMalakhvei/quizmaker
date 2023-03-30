from django.contrib import admin
from django.urls import path
from quiz.admin import quiz_site

urlpatterns = [
    path('admin/', admin.site.urls),
    path('quizadmin/', quiz_site.urls),
]
