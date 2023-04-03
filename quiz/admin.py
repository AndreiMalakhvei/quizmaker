from django.contrib import admin
from django.contrib.admin import ModelAdmin
from nested_inline.admin import NestedStackedInline, NestedModelAdmin
from .models import Quiz, Question, Answer, AdminNotificationWay, QuizCompletedForm, QuizResult

admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(AdminNotificationWay)
admin.site.register(QuizCompletedForm)
admin.site.register(QuizResult)


class QuizAdminArea(admin.AdminSite):
    site_header = 'Quiz Maker'


quiz_site = QuizAdminArea(name="QuizMaker")


class AnswerInline(NestedStackedInline):
    model = Answer
    extra = 1


class QuestionInline(NestedStackedInline):
    model = Question
    extra = 1
    inlines = [AnswerInline, ]


class QuizMakerAdmin(NestedModelAdmin):
    exclude = ['owner', ]
    inlines = [QuestionInline, ]

    def save_model(self, request, obj, form, change):
        obj.owner_id = request.user.id
        super().save_model(request, obj, form, change)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(owner=request.user.id)


quiz_site.register(Quiz, QuizMakerAdmin)


class SingleUserAdmin(ModelAdmin):
    exclude = ['owner', ]
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(owner=request.user.id)


class AdminNotificationWayAdmin(SingleUserAdmin):
    model = AdminNotificationWay



class QuizCompletedFormAdmin(SingleUserAdmin):
    model = QuizCompletedForm


class QuizResultAdmin(ModelAdmin):
    model = QuizResult

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(quiz__owner=request.user.id)


quiz_site.register(AdminNotificationWay, AdminNotificationWayAdmin)
quiz_site.register(QuizCompletedForm, QuizCompletedFormAdmin)
quiz_site.register(QuizResult, QuizResultAdmin)

