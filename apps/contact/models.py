from django.db import models

# Create your models here.
from django.db import models

class ContactMessage(models.Model):
    nom = models.CharField("Nom complet", max_length=100)
    email = models.EmailField("Adresse email")
    sujet = models.CharField("Sujet", max_length=200)
    message = models.TextField("Message")
    date_envoye = models.DateTimeField("Date d'envoi", auto_now_add=True)
    lu = models.BooleanField("Lu par l'admin", default=False)

    class Meta:
        verbose_name = "Message de contact"
        verbose_name_plural = "Messages de contact"
        ordering = ["-date_envoye"]

    def __str__(self):
        return f"{self.sujet} - {self.nom} ({self.email})"


