from django.contrib import admin

from .models import Actualite


@admin.register(Actualite)
class ActualiteAdmin(admin.ModelAdmin):
    list_display = ("titre", "date_publication")
    list_filter = ("date_publication",)
    search_fields = ("titre", "contenu")
    readonly_fields = ("date_publication",)
