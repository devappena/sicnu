import React, { useState, useMemo } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  UserIcon,
  CalendarIcon,
  AcademicCapIcon,
  DocumentIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { mockEmployees, mockAbsences, mockTrainings } from '../data/mockData';
import Card from './Card';

interface SearchResult {
  id: string;
  type: 'employee' | 'absence' | 'training' | 'document';
  title: string;
  subtitle: string;
  description: string;
  relevance: number;
  metadata?: unknown;
}

interface GlobalSearchProps {
  onSelectResult?: (result: SearchResult) => void;
  onClose?: () => void;
  className?: string;
}

export default function GlobalSearch({ onSelectResult, onClose, className = '' }: GlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    employees: true,
    absences: true,
    trainings: true,
    documents: true
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'type'>('relevance');

  // Fonction de recherche intelligente
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Recherche dans les employés
    if (activeFilters.employees) {
      mockEmployees.forEach(employee => {
        const searchText = `${employee.firstName} ${employee.lastName} ${employee.email} ${employee.department} ${employee.position}`.toLowerCase();
        
        if (searchText.includes(query)) {
          const relevance = calculateRelevance(searchText, query);
          results.push({
            id: employee.id,
            type: 'employee',
            title: `${employee.firstName} ${employee.lastName}`,
            subtitle: employee.position,
            description: `${employee.department} • ${employee.email}`,
            relevance,
            metadata: employee
          });
        }
      });
    }

    // Recherche dans les absences
    if (activeFilters.absences) {
      mockAbsences.forEach(absence => {
        const employee = mockEmployees.find(emp => emp.id === absence.employeeId);
        const searchText = `${absence.type} ${absence.reason} ${employee?.firstName} ${employee?.lastName}`.toLowerCase();
        
        if (searchText.includes(query)) {
          const relevance = calculateRelevance(searchText, query);
          results.push({
            id: absence.id,
            type: 'absence',
            title: `Absence: ${absence.type}`,
            subtitle: `${employee?.firstName} ${employee?.lastName}`,
            description: `${absence.reason} • Du ${absence.startDate} au ${absence.endDate}`,
            relevance,
            metadata: { ...absence, employee }
          });
        }
      });
    }

    // Recherche dans les formations
    if (activeFilters.trainings) {
      mockTrainings.forEach(training => {
        const searchText = `${training.title} ${training.description} ${training.instructor}`.toLowerCase();
        
        if (searchText.includes(query)) {
          const relevance = calculateRelevance(searchText, query);
          results.push({
            id: training.id,
            type: 'training',
            title: training.title,
            subtitle: `Formation par ${training.instructor}`,
            description: `${training.description} • Du ${training.startDate} au ${training.endDate}`,
            relevance,
            metadata: training
          });
        }
      });
    }

    // Recherche dans les documents (simulation)
    if (activeFilters.documents) {
      const mockDocuments = [
        {
          id: 'doc1',
          title: 'Règlement Intérieur ENA',
          type: 'PDF',
          category: 'Règlementation',
          lastModified: '2024-12-01'
        },
        {
          id: 'doc2',
          title: 'Guide des Procédures RH',
          type: 'DOC',
          category: 'Procédures',
          lastModified: '2024-11-15'
        },
        {
          id: 'doc3',
          title: 'Politique de Formation',
          type: 'PDF',
          category: 'Formation',
          lastModified: '2024-10-20'
        }
      ];

      mockDocuments.forEach(doc => {
        const searchText = `${doc.title} ${doc.category}`.toLowerCase();
        
        if (searchText.includes(query)) {
          const relevance = calculateRelevance(searchText, query);
          results.push({
            id: doc.id,
            type: 'document',
            title: doc.title,
            subtitle: doc.category,
            description: `Document ${doc.type} • Modifié le ${doc.lastModified}`,
            relevance,
            metadata: doc
          });
        }
      });
    }

    // Tri des résultats
    return results.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return b.relevance - a.relevance;
        case 'date':
          return 0; // Simplified sorting for now
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return b.relevance - a.relevance;
      }
    });
  }, [searchQuery, activeFilters, sortBy]);

  // Calcul de la pertinence
  const calculateRelevance = (text: string, query: string): number => {
    const words = query.split(' ').filter(word => word.length > 0);
    let score = 0;

    words.forEach(word => {
      if (text.includes(word)) {
        // Bonus si le mot est au début
        if (text.startsWith(word)) score += 10;
        // Bonus si le mot est exact
        if (text.includes(` ${word} `) || text.startsWith(word + ' ') || text.endsWith(' ' + word)) {
          score += 5;
        }
        // Score de base pour la présence
        score += 1;
      }
    });

    return score;
  };

  // Gestion des filtres
  const toggleFilter = (filterType: keyof typeof activeFilters) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  // Icône selon le type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'employee':
        return UserIcon;
      case 'absence':
        return CalendarIcon;
      case 'training':
        return AcademicCapIcon;
      case 'document':
        return DocumentIcon;
      default:
        return DocumentIcon;
    }
  };

  // Couleur selon le type
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'employee':
        return 'text-blue-600 bg-blue-100';
      case 'absence':
        return 'text-yellow-600 bg-yellow-100';
      case 'training':
        return 'text-purple-600 bg-purple-100';
      case 'document':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header avec bouton fermer */}
      {onClose && (
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recherche Globale</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Fermer la recherche"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Barre de recherche principale */}
      <Card>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              placeholder="Rechercher des employés, absences, formations, documents..."
            />
          </div>

          {/* Filtres rapides */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-700">Filtres:</span>
            
            <button
              onClick={() => toggleFilter('employees')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeFilters.employees 
                  ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                  : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}
            >
              <UserIcon className="h-3 w-3 inline mr-1" />
              Employés
            </button>

            <button
              onClick={() => toggleFilter('absences')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeFilters.absences 
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                  : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}
            >
              <CalendarIcon className="h-3 w-3 inline mr-1" />
              Absences
            </button>

            <button
              onClick={() => toggleFilter('trainings')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeFilters.trainings 
                  ? 'bg-purple-100 text-purple-800 border border-purple-300' 
                  : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}
            >
              <AcademicCapIcon className="h-3 w-3 inline mr-1" />
              Formations
            </button>

            <button
              onClick={() => toggleFilter('documents')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeFilters.documents 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}
            >
              <DocumentIcon className="h-3 w-3 inline mr-1" />
              Documents
            </button>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200 transition-colors"
            >
              <FunnelIcon className="h-3 w-3 inline mr-1" />
              Avancés
            </button>
          </div>

          {/* Filtres avancés */}
          {showAdvancedFilters && (
            <div className="border-t pt-4 flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Trier par:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'relevance' | 'date' | 'type')}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevance">Pertinence</option>
                  <option value="date">Date</option>
                  <option value="type">Type</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Résultats de recherche */}
      {searchQuery.trim() && (
        <Card>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Résultats de recherche
                {searchResults.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({searchResults.length} résultat{searchResults.length > 1 ? 's' : ''})
                  </span>
                )}
              </h3>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MagnifyingGlassIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Aucun résultat trouvé pour "{searchQuery}"</p>
                <p className="text-sm mt-1">Essayez avec d'autres mots-clés ou ajustez vos filtres</p>
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.map((result) => {
                  const IconComponent = getTypeIcon(result.type);
                  const colorClass = getTypeColor(result.type);
                  
                  return (
                    <div
                      key={`${result.type}-${result.id}`}
                      className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => onSelectResult?.(result)}
                    >
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {result.title}
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
                            {result.type === 'employee' ? 'Employé' :
                             result.type === 'absence' ? 'Absence' :
                             result.type === 'training' ? 'Formation' : 'Document'}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-1">{result.subtitle}</p>
                        <p className="text-xs text-gray-500">{result.description}</p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-1 h-1 rounded-full ${
                                  i < Math.min(result.relevance / 2, 5) ? 'bg-blue-500' : 'bg-gray-200'
                                }`}
                              />
                            ))}
                            <span className="text-xs text-gray-400 ml-1">
                              Pertinence: {Math.min(result.relevance, 10)}/10
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
