from django.shortcuts import  render

from apps.news.models import Actualite

from .models import InformationPage
#views.py

def home(request):
    recentes = Actualite.objects.all()[:3]  # 3 dernières pour l'accueil
    return render(request, "core/home.html", {"recentes": recentes})


def apropos(request):
    return render(request, "core/apropos.html")



#views.py


def information_page(request, slug):
    templates_map = {
        'reglement-interieur': 'pages/reglement_interieur.html',
        'calendrier-scolaire': 'pages/calendrier_scolaire.html',
        'inscriptions': 'pages/inscriptions.html',
        'faq-parents': 'pages/faq_parents.html',
    }
    template_name = templates_map.get(slug, 'pages/404.html')
    return render(request, template_name, {'slug': slug})




