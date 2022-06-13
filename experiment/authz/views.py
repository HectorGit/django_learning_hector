from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.template import loader

import requests #this is to ping the API and get some result back
import json

# --------------- EXPERIMENT -------------------------------------------------------------------------------------

# JUST SETTING UP THE 'DEFAULT' LOGIN PAGE 
# ATTENTION ! - THIS DOES -NOT- GIVE THE USER A TOKEN, SO THAT'S PROBLEMATIC.
# THIS IS JUST THE BUILT IN LOGIN THAT DJANGO COMES WITH
#attempting to set up the default login to see its behaviour

from django.urls import reverse #this is needed to get the default login and logout 
from django.views import View

#Saw this in the 'Django for everybody - Full Python University Course' youtube tutorial
class DumpPython(View):
    def get(self,req):
        resp = "<pre>\nUser Data in Python:\n\n"
        resp += "Login url: " + reverse('login') + "\n"
        resp += "Logout url: " + reverse('logout') + "\n\n"


def index(request):
    return render(request, 'authz/index.html', context={})