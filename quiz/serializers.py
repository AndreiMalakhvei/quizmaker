from rest_framework import serializers
from .models import Quiz, Question, Answer, QuizResult, QuizCompletedForm
import re
from .regex_validators import custom_validator


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

    def validate_phone(self, value):
        if value:
            if not custom_validator.validate_phone(value):
                raise serializers.ValidationError("Phone number must consist of digits only")
        return value

    def validate_email(self, value):
        if value:
            if not custom_validator.validate_email(value):
                raise serializers.ValidationError("Invalid e-mail defined")
        return value

    def validate_name(self, value):
        if value:
            if not custom_validator.validate_name(value):
                raise serializers.ValidationError("Name can contain letters only")
        return value


class CompleteFormSerializer(serializers.ModelSerializer):

    class Meta:
        model = QuizCompletedForm
        fields = '__all__'

