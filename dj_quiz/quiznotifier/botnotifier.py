import telebot
from dj_quiz.quiznotifier.secretkeys import BOT_SECRET_TOKEN

# https://t.me/realtyservbot
bot = telebot.TeleBot(BOT_SECRET_TOKEN)


def send_tg_post(id, message):
    bot.send_message(id, message, parse_mode='html')

