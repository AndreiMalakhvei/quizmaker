from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from quiz.models import Quiz, Profile, Question, Answer, QuizResult, AdminNotificationWay,\
    QuizCompletedForm
from django.contrib.auth.models import User
from rest_framework.exceptions import NotFound, ParseError


class QuizzViewTests(APITestCase):

    def setUp(self):
        user1 = User.objects.create_user(username='user1', password="12345e")
        notify_user1 = AdminNotificationWay.objects.create(owner=user1, via_telegram=True, via_sms=True)
        user1_requires = QuizCompletedForm.objects.create(owner=user1, define_name = True, define_phone=True,
                                                           define_email=False)

        user2 = User.objects.create_user(username='user2', password="12345e")
        notify_user2 = AdminNotificationWay.objects.create(owner=user2, via_telegram=False, via_sms=False)
        user2_requires = QuizCompletedForm.objects.create(owner=user2, define_name=True, define_phone=False,
                                                           define_email=True)

        profile_of_user1 = Profile.objects.get(user=user1)
        profile_of_user1.telegram = '123456'
        profile_of_user1.phone = '123456'
        profile_of_user1.save()
        profile_of_user2 = Profile.objects.get(user=user1)
        profile_of_user2.telegram = '654321'
        profile_of_user2.phone = '654321'
        profile_of_user2.save()

        self.quiz1 = Quiz.objects.create(name='quiz1', owner=user1)
        self.quiz2 = Quiz.objects.create(name='quiz2', owner=user2)
        for quiz in (self.quiz1, self.quiz2):
            new_records = []
            for x in range(1,4):
                new_records.append(Question(content=f'{x} question for {quiz.name}', quiz=quiz))
            Question.objects.bulk_create(new_records)

        for question in Question.objects.all():
            list_of_answers = []
            for x in range(1,4):
                new_answer = Answer(
                    content=f'answer {x} for question: {question.content}',
                    question=question,
                    is_correct=True if x == 1 else False,
                )
                list_of_answers.append(new_answer)
            Answer.objects.bulk_create(list_of_answers)


    def test_if_loop_create_works(self):
        number_of_records = Question.objects.all().count()
        self.assertEqual(number_of_records, 6)

    def test_if_answers_created(self):
        number_of_records = Answer.objects.all().count()
        self.assertEqual(number_of_records, 18)


    def test_get_list_of_all_quizzes(self):
        response = self.client.get(reverse("all_quizzes"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 2)
        self.assertIn({'id': 1, 'name': 'quiz1', 'owner': 1, 'username': 'user1'}, response.json())


    def test_get_single_quiz_returns_quiz(self):
        response = self.client.get(reverse("single_quiz", kwargs={'pk': self.quiz1.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 3)


    def test_get_single_quiz_returns_notfound_error(self):
        response = self.client.get(reverse("single_quiz", kwargs={'pk': 1000}))
        self.assertRaises(NotFound)
