from django.core.validators import validate_email
from django.core.exceptions import ValidationError
import string
import secrets

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

def is_password_valid(password):
    specials = '~!@#$%^&*+'
    alphanumeric = string.ascii_letters + string.digits
    allowed_chars = alphanumeric + specials
    is_valid = True

    # make sure password contains special characters, alphanumeric characters and is at least six characters
    if any(p in alphanumeric for p in password) and any(p in specials for p in password) and (len(password) >= 6):
        # make sure password only contains alphanumeric characters and special characters
        for c in password:
            if c not in allowed_chars:
                is_valid = False
                break
    else:
        is_valid = False

    return is_valid
