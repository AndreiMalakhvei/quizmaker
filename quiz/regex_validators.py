import re


class RegExpValidator:
    def validate_phone(self, phone):
        ready_phone = re.sub(r"[^\d]", "", phone)
        if ready_phone.isnumeric():
            return True
        return False

    def validate_email(self, email):
        EMAILT_PATTERN = '[a-zA-Zа-яА-ЯёЁ0-9]+@[a-zA-Zа-яА-ЯёЁ0-9]+\.[a-zA-Zа-яА-ЯёЁ0-9]+'
        if re.fullmatch(EMAILT_PATTERN, email):
            return True
        return False

    def validate_name(self, name):
        NAME_PATTERN = '[a-zA-Zа-яА-ЯёЁ]+'
        if re.fullmatch(NAME_PATTERN, name.capitalize()):
            return True
        return False


custom_validator = RegExpValidator()
