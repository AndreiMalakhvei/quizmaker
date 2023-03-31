from django.shortcuts import render
from rest_framework import generics
from .models import Quiz, Question, Answer
from .serializers import QuizzesSerializer, QuestionSerializer
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import NotFound


class QuizzesAPIView(generics.ListAPIView):
    queryset = Quiz.objects.select_related('owner')
    serializer_class = QuizzesSerializer
    permission_classes = [AllowAny, ]


class QuizzAPIView(generics.ListAPIView):
    serializer_class = QuestionSerializer

    def get_queryset(self):
        qs = Question.objects.prefetch_related('to_question').filter(quiz=self.kwargs.get('pk'))
        if not qs:
            raise NotFound(detail='Invalid Quiz ID')
        return qs
