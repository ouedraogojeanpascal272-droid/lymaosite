from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import ContactMessage

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("nom", "email", "sujet", "date_envoye", "lu")
    list_filter = ("lu", "date_envoye")
    search_fields = ("nom", "email", "sujet", "message")
    actions = ["marquer_comme_lu"]

    def marquer_comme_lu(self, request, queryset):
        queryset.update(lu=True)
    marquer_comme_lu.short_description = "Marquer les messages sélectionnés comme lus"