#!/bin/bash

# Script pour créer des icônes PWA de différentes tailles
# Utilise ImageMagick pour redimensionner l'icône de base

# Créer le dossier s'il n'existe pas
mkdir -p public/pwa-icons

# Icône de base (remplacer par votre vraie icône)
BASE_ICON="public/vite.svg"

# Si ImageMagick n'est pas installé, utiliser des icônes de base
if ! command -v convert &> /dev/null; then
    echo "ImageMagick n'est pas installé. Copie des icônes de base..."
    
    # Copier vite.svg comme icône de base pour les différentes tailles
    cp "$BASE_ICON" "public/pwa-icons/icon-72x72.png"
    cp "$BASE_ICON" "public/pwa-icons/icon-96x96.png"
    cp "$BASE_ICON" "public/pwa-icons/icon-128x128.png"
    cp "$BASE_ICON" "public/pwa-icons/icon-144x144.png"
    cp "$BASE_ICON" "public/pwa-icons/icon-152x152.png"
    cp "$BASE_ICON" "public/pwa-icons/icon-192x192.png"
    cp "$BASE_ICON" "public/pwa-icons/icon-384x384.png"
    cp "$BASE_ICON" "public/pwa-icons/icon-512x512.png"
    
    echo "Icônes PWA créées avec succès!"
    exit 0
fi

# Générer les icônes avec ImageMagick
echo "Génération des icônes PWA..."

# Convertir SVG en PNG avec différentes tailles
convert -background transparent -density 300 "$BASE_ICON" -resize 72x72 "public/pwa-icons/icon-72x72.png"
convert -background transparent -density 300 "$BASE_ICON" -resize 96x96 "public/pwa-icons/icon-96x96.png"
convert -background transparent -density 300 "$BASE_ICON" -resize 128x128 "public/pwa-icons/icon-128x128.png"
convert -background transparent -density 300 "$BASE_ICON" -resize 144x144 "public/pwa-icons/icon-144x144.png"
convert -background transparent -density 300 "$BASE_ICON" -resize 152x152 "public/pwa-icons/icon-152x152.png"
convert -background transparent -density 300 "$BASE_ICON" -resize 192x192 "public/pwa-icons/icon-192x192.png"
convert -background transparent -density 300 "$BASE_ICON" -resize 384x384 "public/pwa-icons/icon-384x384.png"
convert -background transparent -density 300 "$BASE_ICON" -resize 512x512 "public/pwa-icons/icon-512x512.png"

echo "Icônes PWA générées avec succès!"
