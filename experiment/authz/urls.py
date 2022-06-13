from django.urls import path

from . import views

from django.views.generic import TemplateView #attempting to set up the default login to see its behaviour

urlpatterns = [
    path('', views.index, name='index'),
    path('login_dummy', TemplateView.as_view(template_name='authz/login_dummy.html')) #attempting to set up the default login to see its behaviour
]
