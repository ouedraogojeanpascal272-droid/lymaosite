from django.shortcuts import render
from django.core.mail import send_mail
from django.contrib import messages
from .form import ContactForm
from django.conf import settings

def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            nom = form.cleaned_data['nom']
            email = form.cleaned_data['email']
            sujet = form.cleaned_data['sujet'] or 'Sans sujet'
            message = form.cleaned_data['message']

            # 📤 Envoi de l'email
            send_mail(
                subject=f"📩 {sujet} - Message de {nom}",
                message=f"De : {nom} <{email}>\nSujet : {sujet}\n\n{message}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.CONTACT_EMAIL],
                fail_silently=False,
            )

            messages.success(request, "✅ Votre message a bien été envoyé. Nous vous répondrons sous 24h.")
            return render(request, 'contact/contact.html', {'form': ContactForm()})
    else:
        form = ContactForm()

    return render(request, 'contact/contact.html', {'form': form})
