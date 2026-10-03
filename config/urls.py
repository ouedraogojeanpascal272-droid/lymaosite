from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from apps.core.views import information_page
from apps.core.views import home
from django.views.generic import TemplateView
from apps.news.views import liste_actualites , detail_actualite


urlpatterns = [
    path('apropos/', TemplateView.as_view(template_name="core/apropos.html"), name='apropos'), 
    path('admin/', admin.site.urls),
    path('', include(('apps.core.urls', 'core'), namespace='core')), 
    path('actualites/', liste_actualites, name='liste_actualites'),           
    path('actualites/<int:id>/', detail_actualite, name='detail_actualite'), 
    path("contact/", include("apps.contact.urls")),
    path('page/<slug:slug>/', information_page, name='information_page'),
    path('', home, name='home'),
    path('reglement/', TemplateView.as_view(template_name="core/reglement.html"), name='reglement'),
    path('calendrier/', TemplateView.as_view(template_name="core/calendrier.html"), name='calendrier'),
    path('inscriptions/', TemplateView.as_view(template_name="core/inscriptions.html"), name='inscriptions'),
    path('faq/', TemplateView.as_view(template_name="core/faq.html"), name='faq'),
    

]


# Permet de servir les images en mode développement
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
