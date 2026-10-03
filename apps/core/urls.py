from django.urls import path
from . import views
from django.views.generic import TemplateView
app_name = 'core'


urlpatterns = [
    path('', views.home, name='home'),
    # Utilisation d'une vue générique pour toutes les pages statiques
    path('info/<slug:slug>/', views.information_page, name='information_page'),
    path("apropos/", views.apropos, name="apropos"),
    path('reglement/', TemplateView.as_view(template_name="core/reglement.html"), name='reglement'),
    path('calendrier/', TemplateView.as_view(template_name="core/calendrier.html"), name='calendrier'),
    path('inscriptions/', TemplateView.as_view(template_name="core/inscriptions.html"), name='inscriptions'),
    path('faq/', TemplateView.as_view(template_name="core/faq.html"), name='faq'),

]


