from django.contrib import admin
from django.urls import path, include
from quiz.admin import quiz_site

urlpatterns = [
    path('admin/', admin.site.urls),
    path('quizadmin/', quiz_site.urls),
    path('api/v1/', include('quiz.urls')),
]
