from django.urls import path
from .views import QuizzesAPIView, QuizzAPIView, QuizResultSaveView, QuizCompletedFormView

urlpatterns = [
    path('quizzes/', QuizzesAPIView.as_view()),
    path('quizz/<int:pk>', QuizzAPIView.as_view()),
    path('quizzresult/', QuizResultSaveView.as_view()),
    path('completed/<int:pk>', QuizCompletedFormView.as_view())
    ]
