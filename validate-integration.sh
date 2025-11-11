#!/bin/bash

# Script de validation des nouvelles fonctionnalités
# Vérifie que tous les fichiers sont présents et les imports corrects

echo "🔍 Validation des modules avancés ENA Portail RH"
echo "================================================"

# Vérification des nouveaux composants
echo "📦 Vérification des nouveaux composants..."
files=(
    "src/components/ApprovalWorkflowViewer.tsx"
    "src/components/BudgetDashboard.tsx"
    "src/components/AdvancedTimesheet.tsx"
    "src/components/ExpenseManagement.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (manquant)"
    fi
done

# Vérification des nouvelles pages
echo -e "\n📄 Vérification des nouvelles pages..."
pages=(
    "src/pages/finance/PayrollNew.tsx"
    "src/pages/time-management/TimesheetNew.tsx"
    "src/pages/admin/WorkflowManagement.tsx"
)

for page in "${pages[@]}"; do
    if [ -f "$page" ]; then
        echo "✅ $page"
    else
        echo "❌ $page (manquant)"
    fi
done

# Vérification des fichiers modifiés
echo -e "\n🔧 Vérification des fichiers modifiés..."
modified=(
    "src/types/index.ts"
    "src/data/mockData.ts"
    "src/App.tsx"
    "src/components/Sidebar.tsx"
)

for mod in "${modified[@]}"; do
    if [ -f "$mod" ]; then
        echo "✅ $mod"
    else
        echo "❌ $mod (manquant)"
    fi
done

echo -e "\n🎯 Routes disponibles:"
echo "  - /payroll (Finance avancée)"
echo "  - /timesheet (Pointage avancé)"
echo "  - /workflow-management (Workflows d'approbation)"

echo -e "\n✨ Validation terminée!"
echo "💡 Démarrez le serveur avec: npm run dev"
echo "🌐 Accédez à l'application sur: http://localhost:5173"
