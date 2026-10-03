from django.test import TestCase

# Create your tests here.
from .models import ContactMessage
from django.test import TestCase
from django.urls import reverse
from .models import ContactMessage

class ContactTests(TestCase):
    def test_formulaire_post_valide(self):
        data = {
            "nom": "Jean Dupont",
            "email": "jean@lycee.fr",
            "sujet": "Problème technique",
            "message": "Je n'arrive pas à accéder à l'ENT.",
        }
        response = self.client.post(reverse("contact"), data)
        self.assertEqual(response.status_code, 302)  # redirection après succès
        self.assertEqual(ContactMessage.objects.count(), 1)
        msg = ContactMessage.objects.first()
        self.assertEqual(msg.nom, "Jean Dupont")



