#!/bin/bash

echo "=== DEBUT DU SCRIPT ==="
echo "Installation des dependances..."
pip install -r requirements.txt

echo "Collecte des fichiers statiques..."
python manage.py collectstatic --noinput

echo "=== FIN DU SCRIPT ==="