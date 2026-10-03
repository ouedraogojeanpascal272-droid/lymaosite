from django import forms


class ContactForm(forms.Form):
    SUJET_CHOICES = [
        ('', 'Choisir un sujet...'),
        ('inscription', 'Demande d\'inscription'),
        ('renseignement', 'Renseignement général'),
        ('plainte', 'Réclamation'),
        ('autre', 'Autre'),
    ]

    nom = forms.CharField(
        label="Nom complet *",
        max_length=100,
        widget=forms.TextInput(attrs={
            'placeholder': 'Votre nom et prénom',
            'required': 'required'
        })
    )

    email = forms.EmailField(
        label="Adresse email *",
        widget=forms.EmailInput(attrs={
            'placeholder': 'votre@email.com',
            'required': 'required'
        })
    )

    sujet = forms.ChoiceField(
        label="Sujet",
        choices=SUJET_CHOICES,
        required=False,
        widget=forms.Select()
    )

    message = forms.CharField(
        label="Message *",
        widget=forms.Textarea(attrs={
            'rows': 5,
            'placeholder': 'Votre message...',
            'required': 'required'
        })
    )
