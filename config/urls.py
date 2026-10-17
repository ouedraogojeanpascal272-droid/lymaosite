from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView

from apps.core.views import information_page, home
from apps.news.views import liste_actualites, detail_actualite

urlpatterns = [
    path('espace-gestion-lymao/', admin.site.urls),
    
    # ✅ PAS DE LIGNE 'galerie' ICI ! Tout est géré par le include ci-dessous.
    
    path('', include(('apps.core.urls', 'core'), namespace='core')), 
    path('actualites/', liste_actualites, name='liste_actualites'),           
    path('actualites/<int:id>/', detail_actualite, name='detail_actualite'), 
    path("contact/", include("apps.contact.urls")),
    path('page/<slug:slug>/', information_page, name='information_page'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
