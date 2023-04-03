from django.urls import path
from .views import QuizzesAPIView, QuizzAPIView, QuizResultSaveView

urlpatterns = [
    path('quizzes/', QuizzesAPIView.as_view()),
    path('quizz/<int:pk>', QuizzAPIView.as_view()),
    path('quizzresult/', QuizResultSaveView.as_view())
    ]
