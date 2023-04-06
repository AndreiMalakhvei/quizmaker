from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    telegram = models.CharField(max_length=100, blank=True, default='')
    phone = models.CharField(max_length=100, blank=True, default='')

    def __str__(self):
        return self.user

    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance)

    @receiver(post_save, sender=User)
    def save_user_profile(sender, instance, **kwargs):
        instance.profile.save()


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


class QuizResult(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='to_quiz')
    result = models.TextField()
    name = models.CharField(max_length=100, default=None)
    phone = models.CharField(max_length=100, default=None)
    email = models.EmailField(default=None)
    date = models.DateTimeField('Дата добавления', blank=True, default=timezone.now)
    admin_notified = models.BooleanField(default=False)


class AdminNotificationWay(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    via_sms = models.BooleanField(default=False)
    via_telegram = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = 'Way to notify the Admin'

    def __str__(self):
        return 'Choose the way to be notified about passed quizzes'


class QuizCompletedForm(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    define_name = models.BooleanField(default=True)
    define_phone = models.BooleanField(default=True)
    define_email = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = 'Information to get from Customer'

    def __str__(self):
        return 'Choose the information to be provided by the person who passed a quiz'

