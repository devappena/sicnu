import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import PageHeader from '../components/PageHeader';
import GlobalSearch from '../components/GlobalSearch';
import { useToast } from '../hooks/useToast';

export default function SearchPage() {
  const { showToast } = useToast();
  
  const handleSelectResult = (result: { id: string; type: string; title: string }) => {
    showToast('info', 'Élément sélectionné', `${result.type}: ${result.title}`);
    // Ici nous pourrions naviguer vers la page détaillée de l'élément sélectionné
    // ou ouvrir un modal avec les détails
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Recherche Globale" 
        description="Trouvez rapidement des employés, absences, formations et documents"
        icon={MagnifyingGlassIcon}
      />

      <GlobalSearch 
        onSelectResult={handleSelectResult}
        className="max-w-4xl mx-auto"
      />

      {/* Suggestions et raccourcis */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-medium text-gray-900 mb-3">Recherches populaires</h3>
            <div className="space-y-2">
              <button className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:underline">
                Employés en formation
              </button>
              <button className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:underline">
                Absences ce mois
              </button>
              <button className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:underline">
                Documents de procédures
              </button>
              <button className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:underline">
                Formations leadership
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-medium text-gray-900 mb-3">Conseils de recherche</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Utilisez des mots-clés précis</p>
              <p>• Combinez les filtres par type</p>
              <p>• Recherchez par nom, département</p>
              <p>• Utilisez les filtres avancés</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-medium text-gray-900 mb-3">Raccourcis</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+K</kbd> Recherche rapide</p>
              <p><kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+F</kbd> Filtres</p>
              <p><kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> Premier résultat</p>
              <p><kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd> Effacer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
