from django.urls import path
from . import views

app_name = 'classification'

urlpatterns = [
    path('index', views.index, name='index'),
    path('male', views.male, name='male'),
    path('female', views.female, name='female'),
    path('imageinput', views.imageinput, name='imageinput'),
    path('imagechoice', views.imagechoice, name='imagechoice'),
    path('resultoutput', views.resultoutput, name='resultoutput'),
    path('emotion', views.emotion, name='emotion'),
    path('emotioninput', views.emotioninput, name='emotioninput'),
    path('emotionchoice', views.emotionchoice, name='emotionchoice'),
    path('emotionoutput', views.emotionoutput, name='emotionoutput'),
]
