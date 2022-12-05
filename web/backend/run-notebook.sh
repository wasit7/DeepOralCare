while ! nc -w 1 -z ${DB_HOST} ${DB_PORT};
do sleep 5;
done;

while ! nc -w 1 -z ${NEO4J_HOST} ${NEO4J_BOLTPORT};
do sleep 5;
done;

python manage.py shell_plus --notebook