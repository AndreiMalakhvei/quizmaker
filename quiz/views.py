from django.shortcuts import render
from rest_framework import generics
from .models import Quiz, Question, Answer
from .serializers import QuizzesSerializer, QuestionSerializer, QuizResultSerializer
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import NotFound, ParseError


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


class QuizResultSaveView(generics.CreateAPIView):
    serializer_class = QuizResultSerializer

    def post(self, request, *args, **kwargs):
        ordict = request.data
        try:
            res = ordict['result']
            ordict['result'] = str(res)
        except KeyError:
            raise ParseError('No attached results found')
        serializer = self.serializer_class(data=ordict)
        if not serializer.is_valid():
            print(serializer.errors)
        return self.create(request, *args, **kwargs)
