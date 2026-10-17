from django.contrib import admin

from .models import InformationPage


@admin.register(InformationPage)
class InformationPageAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "updated_at")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "slug")
    ordering = ("title",)

admin.site.site_header = "LYMAO — Administration"
admin.site.site_title = "LYMAO"
admin.site.index_title = "Gestion du site"
