#!/bin/bash

# Script de validation complète du projet ENA Portail RH
# Auteur: Assistant IA
# Date: 16 Août 2025

echo "🔍 === VALIDATION COMPLÈTE ENA PORTAIL RH ==="
echo ""

# Vérification de l'environnement Node.js
echo "📋 Vérification de l'environnement..."
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo ""

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm install
echo ""

# Vérification des types TypeScript
echo "🔧 Vérification TypeScript..."
npx tsc --noEmit
if [ $? -eq 0 ]; then
    echo "✅ TypeScript: Aucune erreur de type"
else
    echo "❌ TypeScript: Erreurs détectées"
fi
echo ""

# Linting du code
echo "🧹 Vérification du code (ESLint)..."
npx eslint src --ext .ts,.tsx --max-warnings 0
if [ $? -eq 0 ]; then
    echo "✅ ESLint: Code conforme"
else
    echo "⚠️  ESLint: Avertissements ou erreurs détectés"
fi
echo ""

# Exécution des tests
echo "🧪 Exécution des tests..."
npm test
if [ $? -eq 0 ]; then
    echo "✅ Tests: Tous les tests passent"
else
    echo "❌ Tests: Certains tests échouent"
fi
echo ""

# Build de production
echo "🏗️  Build de production..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build: Succès"
else
    echo "❌ Build: Échec"
fi
echo ""

# Vérification des console.log restants
echo "🔍 Recherche des console.log..."
CONSOLE_LOGS=$(grep -r "console\.log" src/ || true)
if [ -z "$CONSOLE_LOGS" ]; then
    echo "✅ Aucun console.log trouvé en production"
else
    echo "⚠️  console.log trouvés:"
    echo "$CONSOLE_LOGS"
fi
echo ""

# Résumé de la validation
echo "📊 === RÉSUMÉ DE LA VALIDATION ==="
echo "✅ Environnement vérifié"
echo "✅ Dépendances installées"
echo "📝 TypeScript vérifié"
echo "🧹 Code linté"
echo "🧪 Tests exécutés"
echo "🏗️  Build testé"
echo "🔍 console.log vérifiés"
echo ""
echo "🎉 Validation terminée !"
echo ""
echo "🚀 Pour démarrer le serveur de développement:"
echo "   npm run dev"
echo ""
echo "📈 Pour voir la couverture de tests:"
echo "   npm run test:coverage"
echo ""
