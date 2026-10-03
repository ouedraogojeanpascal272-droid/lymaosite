from django.db import models
from django.utils.text import slugify as slug


class Actualite(models.Model):
    titre = models.CharField("Titre de l'actualité", max_length=200)
    contenu = models.TextField("Contenu détaillé")
    image = models.ImageField(
        "Image d'illustration", upload_to="actualites/", blank=True, null=True
    )
    date_publication = models.DateTimeField("Date de publication", auto_now_add=True)
    slug = models.SlugField(unique=False, blank=True)
def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slug(self.titre) #ignore slugify doit être importé de django.utils.text
        super().save(*args, **kwargs)
    
class Meta:
        verbose_name = "Actualité"
        verbose_name_plural = "Actualités"
        ordering = ["-date_publication"]  # Les plus récentes en premier

def __str__(self):
        return self.titre
