from django.http import HttpResponseRedirect


class AdminCheckMiddleware:
    def __init__(self, get_response):
        self. get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/admin/') and not request.user.is_anonymous:
            if not request.user.is_superuser:
                return HttpResponseRedirect('/quizadmin/')

        response = self.get_response(request)
        return response
