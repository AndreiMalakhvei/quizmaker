import unittest
from parameterized import parameterized
from quiz.regex_validators import custom_validator


class TestCustomValidators(unittest.TestCase):
    @parameterized.expand([
        "MoSallah",
        "Alexander-Arnold",
        "O`Brian",
    ])
    def test_name_validator_returns_true(self, name):
        self.assertEqual(custom_validator.validate_name(name), True)

    @parameterized.expand([
        "MoSallah11",
        "Alexander Arnold",
        "Andrew_Robertson",
    ])
    def test_name_validator_returns_false(self, name):
        self.assertEqual(custom_validator.validate_name(name), False)

    @parameterized.expand([
            "+3453463654",
            "645685857",
            "536gfhy4hfgj6756",
        ])
    def test_phone_validator_returns_true(self, phone):
        self.assertEqual(custom_validator.validate_phone(phone), True)

    @parameterized.expand([
        "++++",
        "gfhfjfhj",
        ])
    def test_phone_validator_returns_false(self, phone):
        self.assertEqual(custom_validator.validate_phone(phone), False)

    @parameterized.expand([
        "aaaa@ddd.com",
        "a@b.b",
    ])
    def test_phone_validator_returns_true(self, email):
        self.assertEqual(custom_validator.validate_email(email), True)

    @parameterized.expand([
        "@ddd.com",
        "ab.b",
        "q@abb",
        "ffhq@abb.",
    ])
    def test_phone_validator_returns_false(self, email):
        self.assertEqual(custom_validator.validate_email(email), False)
