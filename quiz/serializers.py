from rest_framework import serializers
from .models import Quiz, Question, Answer


class QuizzesSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='owner.username')

    class Meta:
        model = Quiz
        fields = ["id", 'name', 'owner', 'username']


class AnswersSerializer(serializers.ModelSerializer):

    class Meta:
        model = Answer
        fields = ['id', 'content', 'is_correct']


class QuestionSerializer(serializers.ModelSerializer):
    to_question = AnswersSerializer(many=True)


    class Meta:
        model = Question
        fields = ['id', 'content', 'to_question']

