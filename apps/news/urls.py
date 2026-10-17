from django.urls import path

from . import views

urlpatterns = [
    path("", views.liste_actualites, name="liste_actualites"),
    path("<int:pk>/", views.detail_actualite, name="detail_actualite"),
]

from django.urls import path
from . import views

app_name = 'core'  # facultatif

urlpatterns = [
   # path('', views.home, name='home'),
    # Au lieu de path("reglement-interieur/<slug:slug>/", views.reglement, ...)
    path('info/<slug:slug>/', views.information_page, name='information_page'),
    
    path('', views.liste, name='liste_actualites'),
]

