# Creating a dump of data
<code>$ python manage.py dumpdata -e contenttypes -e auth.Permission --indent 4 > db.json</code>

# Load the sample data
## WARNING: This will delete all tables and recreate them
\
Reset your database \
<code>\$ python manage.py flush</code> \
<code>\$ python manage.py migrate agency_api zero</code> \
<code>\$ python manage.py migrate</code>

Load the data \
<code>\$ python manage.py loaddata db.json</code>
