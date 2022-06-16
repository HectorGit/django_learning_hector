# django_learning_hector
setting up a basic django app and learning behaviour of this framework

NOTES : 

Based on this : https://docs.djangoproject.com/en/4.0/intro/tutorial01/
But expanded upon to try to get data from our API and such.

TO SET UP 

             create an environment 

python -m venv venv

             activate it 

call venv/scripts/activate

             install dependencies

pip install requirements.txt [note - didnt actually have this , but I added it now !]

to run : (navigate to directory where manage.py is)

python manage.py runserver

Should be in port 8000


---

Important note : 

You will need to get branch `django-experiment` for the API and run it simultaneously (on port 5001, as usual)

---

Routes that you can visit for now : 

localhost:8000/polls
localhost:8000/polls/graph_experiment
localhost:8000/polls/graph_experiment_2

localhost:8000/accounts/login (related to /registration/login.html template) [no superuser has been created so login will not work, but you could make one]

---
