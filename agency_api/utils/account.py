import string
import secrets
from .validation import is_password_valid

def gen_rand_pass():
    specials = '~!@#$%^&*+'
    alphabet = string.ascii_letters + string.digits + specials

    while True:
        password = ''.join(secrets.choice(alphabet) for i in range(10))
        if(is_password_valid(password)):
            return password