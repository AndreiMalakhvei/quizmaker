from rest_framework import generics, status
from rest_framework.response import Response
from .models import Profile
from dj_quiz.quiznotifier.botnotifier import send_tg_post
from dj_quiz.quiznotifier.smsnotifier import send_sms
from .models import Quiz, Question, QuizCompletedForm
from .serializers import QuizzesSerializer, QuestionSerializer, QuizResultSerializer, CompleteFormSerializer
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import NotFound, ParseError
import re


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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        quiz = Quiz.objects.get(id=serializer.data['quiz'])

        owner = Profile.objects.get(id=quiz.owner_id)
        if owner.telegram:
            message = f"Пользователь: {serializer.data['name']}, {serializer.data['phone']}, {serializer.data['email']} \n"
            message += f'Тест: {quiz.name}\n'
            message += f"Результаты: {serializer.data['result']}\n"
            send_tg_post(owner.telegram, message)
        if owner.phone:
            message = f"Зарегистрировано новое прохождение теста {quiz.name}"
            phone = re.sub(r"\D", "", owner.phone)
            send_sms(message, phone)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class QuizCompletedFormView(generics.RetrieveAPIView):
    serializer_class = CompleteFormSerializer

    def get_object(self):
        obj = QuizCompletedForm.objects.get(owner_id=self.kwargs.get('pk'))
        return obj
