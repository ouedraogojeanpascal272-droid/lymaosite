from django.db import models


class InformationPage(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Page d'information"
        verbose_name_plural = "Pages d'information"
        ordering = ["title"]

    def __str__(self):
        return self.title
