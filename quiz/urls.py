from django.urls import path
from .views import QuizzesAPIView, QuizzAPIView, QuizResultSaveView, QuizCompletedFormView

urlpatterns = [
    path('quizzes/', QuizzesAPIView.as_view(), name="all_quizzes"),
    path('quizz/<int:pk>', QuizzAPIView.as_view(), name="single_quiz"),
    path('quizzresult/', QuizResultSaveView.as_view(), name="quiz_result"),
    path('completed/<int:pk>', QuizCompletedFormView.as_view(), name="get_contact_settings")
    ]
