#!/bin/bash

echo "Installation des dépendances..."
pip install -r requirements.txt

echo "Collecte des fichiers statiques..."
python3 manage.py collectstatic --noinput