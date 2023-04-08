from __future__ import print_function
from telesign.messaging import MessagingClient

customer_id = "D6C0DA21-5113-4ECD-82F8-25EE0990F335"
api_key = "*******"

phone_number = "*****"
message = "You're scheduled for a dentist appointment at 2:30PM."
message_type = "ARN"

messaging = MessagingClient(customer_id, api_key)
response = messaging.message(phone_number, message, message_type)

print(response.json)

# {'external_id': None, 'status': {'code': 10033, 'description': 'Unverified phone number requested for trial account'}}