from django.db import models
from django.contrib.auth.models import User
from django.conf import settings


class Quiz(models.Model):
    name = models.CharField(max_length=300)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)

    class Meta:
        verbose_name_plural = 'Quizzes'

    def __str__(self):
        return self.name


class Question(models.Model):
    content = models.TextField(default=None)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='from_quiz')

    def __str__(self):
        return self.content


class Answer(models.Model):
    content = models.CharField(max_length=500)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='to_question')
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.content
