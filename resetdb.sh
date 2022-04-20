#!/usr/bin/env bash

python manage.py flush
python manage.py migrate agency_api zero
python manage.py migrate
python manage.py loaddata db.json
