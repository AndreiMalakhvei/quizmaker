from rest_framework import serializers
from .models import Quiz, Question, Answer, QuizResult, QuizCompletedForm


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


class QuizResultSerializer(serializers.ModelSerializer):

    class Meta:
        model = QuizResult
        fields = ['quiz', 'result', 'name', 'phone', 'email']
        extra_kwargs = {'name': {'required': False, 'allow_blank': True},
                        'phone': {'required': False, 'allow_blank': True},
                        'email': {'required': False, 'allow_blank': True},
                        }


class CompleteFormSerializer(serializers.ModelSerializer):

    class Meta:
        model = QuizCompletedForm
        fields = '__all__'

