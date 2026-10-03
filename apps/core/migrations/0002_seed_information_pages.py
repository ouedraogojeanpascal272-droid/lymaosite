from django.db import migrations


def create_information_pages(apps, schema_editor):
    InformationPage = apps.get_model('core', 'InformationPage')
    pages = [
        {
            'title': 'Règlement intérieur',
            'slug': 'reglement-interieur',
            'content': "<p>Bienvenue sur la page du règlement intérieur. Ajoutez ici les règles de vie scolaire, les procédures disciplinaires, les horaires et les consignes de sécurité.</p>",
        },
        {
            'title': 'Calendrier scolaire',
            'slug': 'calendrier-scolaire',
            'content': "<p>Retrouvez le calendrier scolaire officiel avec les vacances, les dates importantes et les échéances administratives.</p>",
        },
        {
            'title': 'Inscriptions',
            'slug': 'inscriptions',
            'content': "<p>Cette page explique les étapes d'inscription, les documents à fournir et les conditions d'admission pour l'année scolaire.</p>",
        },
        {
            'title': 'FAQ Parents',
            'slug': 'faq-parents',
            'content': "<p>Vous trouverez ici les réponses aux questions les plus fréquentes des parents concernant l'école, la cantine, le transport et le suivi pédagogique.</p>",
        },
    ]

    for page in pages:
        InformationPage.objects.get_or_create(slug=page['slug'], defaults={'title': page['title'], 'content': page['content']})


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_information_pages),
    ]
