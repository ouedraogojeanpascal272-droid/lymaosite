from django.shortcuts import get_object_or_404, render

from .models import Actualite


def liste_actualites(request):
    actualites = Actualite.objects.all()
    return render(request, "news/liste.html", {"actualites": actualites})


def detail_actualite(request, id):
    actualite = get_object_or_404(Actualite, id=id)
    return render(request, 'news/detail.html', {'actualite': actualite})
from django.shortcuts import render

def information_page(request, slug):
    templates_map = {
        'reglement-interieur': 'pages/reglement_interieur.html',
        'calendrier-scolaire': 'pages/calendrier_scolaire.html',
        'inscriptions': 'pages/inscriptions.html',
        'faq-parents': 'pages/faq_parents.html',
    }
    template_name = templates_map.get(slug, 'pages/404.html')
    return render(request, template_name, {'slug': slug})

    