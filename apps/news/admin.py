from django.contrib import admin

from .models import Actualite


@admin.register(Actualite)
class ActualiteAdmin(admin.ModelAdmin):
    list_display = ("titre", "date_publication")
    list_filter = ("date_publication",)
    search_fields = ("titre", "contenu")
    readonly_fields = ("date_publication",)
    # Envoi d'image désactivé : Vercel ne peut pas écrire de fichiers sur le serveur (erreur 500).
    # Pour réactiver : prévoir un stockage externe (Cloudinary, S3…) puis retirer cette ligne.
    exclude = ("image",)
