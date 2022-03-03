from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import string
import secrets

def validate_phone(phone_number):
    if not str(phone_number).isnumeric() or len(str(phone_number)) != 10:
        raise ValidationError(
            _('%(value)s is not a valid phone number'),
            params={'value': phone_number},
        )

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
