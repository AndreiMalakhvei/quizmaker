from dj_quiz.quiznotifier.secretkeys import SMS_TOKEN
import requests


def send_sms(message, phone):
    result = requests.post(
        'https://app.sms.by/api/v1/sendQuickSMS',
        {
            'token': SMS_TOKEN,
            'message': message,
            'phone': phone
        }
    )

