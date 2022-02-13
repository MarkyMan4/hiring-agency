from django.core.validators import validate_email
from django.core.exceptions import ValidationError

def is_phone_number_valid(phone_number):
    is_valid = True

    if not str(phone_number).isnumeric():
        is_valid = False

    if len(str(phone_number)) != 10:
        is_valid = False

    return is_valid

def is_email_valid(email):
    is_valid = True

    try:
        validate_email(email)
    except ValidationError as e:
        is_valid = False

    return is_valid
