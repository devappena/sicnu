<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Instructions Copilot pour le Portail RH ENA

Ce projet est une application de gestion des ressources humaines pour l'École Nationale d'Administration (ENA) de la République Démocratique du Congo.

## Stack Technique
- **Frontend**: React.js avec TypeScript et Vite
- **Styling**: Tailwind CSS avec des couleurs personnalisées pour l'ENA
- **Icons**: Heroicons
- **Routing**: React Router DOM
- **Date handling**: date-fns avec localisation française
- **Charts**: Recharts (pour les statistiques)
- **PDF Export**: jsPDF et html2canvas

## Structure du Projet
- `src/components/`: Composants réutilisables
- `src/pages/`: Pages principales de l'application
- `src/types/`: Types TypeScript
- `src/data/`: Données de démonstration
- `src/utils/`: Fonctions utilitaires

## Conventions
- Utiliser les couleurs personnalisées ENA définies dans `tailwind.config.js`
- Tous les textes en français
- Format de date français (dd/mm/yyyy)
- Utiliser les classes Tailwind personnalisées définies dans `index.css`
- Préférer les hooks React et les composants fonctionnels
- Utiliser TypeScript strict avec des types bien définis

## Fonctionnalités Principales
1. **Dashboard**: Vue d'ensemble avec statistiques
2. **Gestion des employés**: CRUD complet des employés
3. **Gestion des absences**: Demandes et approbations
4. **Formations**: Planification et suivi des formations
5. **Statistiques**: Graphiques et rapports
6. **Notifications**: Système d'alertes

## UI/UX Guidelines
- Design moderne et professionnel
- Interface responsive (mobile-first)
- Couleurs: Bleu ENA (#1c3d8f), Or ENA (#f59e0b)
- Utiliser les icônes Heroicons
- Feedback utilisateur avec des toasts/notifications
- Loading states pour les actions async

## Backend (À venir)
- Node.js avec Express
- PostgreSQL avec Prisma ORM
- Authentification JWT
- API REST
