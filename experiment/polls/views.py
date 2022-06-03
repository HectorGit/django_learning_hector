from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.template import loader

import requests #this is to ping the API and get some result back
import json

# API_URL = app.config['API_ROUTE']
# API_ROUTE = os.environ.get('API_ROUTE') or 'http://localhost:5001'
API_URL = 'http://localhost:5001'

def index(request):
    # return HttpResponse("Hello, world. You're at the polls index.")

    username = 'hector_perez'
    password = '128DirectoryEntry'

    # ---------------------------------------- A - LOGIN AND GET TOKEN TO BE ABLE TO MAKE MORE REQUESTS BY HAVING THE TOKEN.
    url = API_URL + '/login'
    login_information = {
        "username" : username,
        "password" : password
    }
    r1 = requests.post(url, data = login_information)
    print("response status to API_URL + '/login' login : ", r1)
    print("r.json : ", r1.json())

    # resp.set_cookie('jwt_token', token) #can't do this ... hmmm...


    # ---------------------------------------- B - MAKE A A REQUEST

    url = API_URL + '/get_user_table/' + username
    # r = requests.get(url, headers = {"Authorization": 'Bearer ' + str(request.cookies.get('jwt_token'))})
    r2 = requests.get(url, headers = {"Authorization": 'Bearer ' + str(r1.json()['token'])})
    print("responses status to endpoint with cookie : ", r2)
    print("r2.json : ", r2.json())

    # ----------------------------------------- C - PASS RESULTING DATA TO TEMPLATE 

    # return HttpResponse('Hey dude!')

    # template = loader.get_template('polls/index.html')
    # context = {} #not sure what this is for...
    # return HttpResponse(template.render(context, request))

    # context = {} #not sure what this is for...

    user_data = r2.json() #not sure if this is a good idea...
    return render(request, 'polls/index.html', context={'user_data':user_data})#, context)