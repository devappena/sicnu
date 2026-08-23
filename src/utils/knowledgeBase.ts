// Base de connaissances SICNU / CNU-RDC
export interface KnowledgeItem {
  id: string;
  category: string;
  keywords: string[];
  question: string;
  answer: string;
  actions?: Array<{
    text: string;
    url: string;
    type: 'navigation' | 'external' | 'download';
  }>;
  tags: string[];
  priority: number; // 1-10, plus élevé = plus prioritaire
}

export const knowledgeBase: KnowledgeItem[] = [
  // === CONGÉS ET ABSENCES ===
  {
    id: 'conge-demande',
    category: 'Congés',
    keywords: ['congé', 'vacances', 'absence', 'demande', 'cp'],
    question: 'Comment demander un congé ?',
    answer: 'Pour demander un congé : Allez dans Absences > Nouvelle Demande. Sélectionnez le type (congés payés, RTT, exceptionnel), choisissez les dates et soumettez. Votre manager recevra automatiquement la demande pour validation.',
    actions: [
      { text: 'Faire une demande', url: '/absences', type: 'navigation' },
      { text: 'Voir mes congés', url: '/profile', type: 'navigation' }
    ],
    tags: ['congé', 'demande', 'validation'],
    priority: 9
  },
  {
    id: 'conge-solde',
    category: 'Congés',
    keywords: ['solde', 'restant', 'combien', 'jours'],
    question: 'Quel est mon solde de congés ?',
    answer: 'Consultez votre solde dans Profil > Mes Congés. Vous avez droit à 25 jours ouvrables de congés payés + RTT selon votre temps de travail. Le solde est mis à jour en temps réel.',
    actions: [
      { text: 'Voir mon solde', url: '/profile', type: 'navigation' }
    ],
    tags: ['solde', 'congé', 'RTT'],
    priority: 8
  },

  // === FORMATIONS ===
  {
    id: 'formation-inscription',
    category: 'Formation',
    keywords: ['formation', 'inscription', 'stage', 'cours'],
    question: 'Comment s\'inscrire à une formation ?',
    answer: 'Accédez au catalogue dans Formations > Catalogue. Sélectionnez une formation, vérifiez les prérequis et cliquez sur "S\'inscrire". L\'approbation de votre manager est requise pour les formations de plus de 2 jours.',
    actions: [
      { text: 'Catalogue formations', url: '/trainings', type: 'navigation' },
      { text: 'Mes formations', url: '/profile', type: 'navigation' }
    ],
    tags: ['formation', 'inscription', 'catalogue'],
    priority: 8
  },
  {
    id: 'formation-budget',
    category: 'Formation',
    keywords: ['budget', 'coût', 'financement', 'prise en charge'],
    question: 'Qui finance les formations ?',
    answer: 'La CNU-RDC finance les formations professionnelles dans le cadre du plan de formation. Pour les formations externes, une demande de financement doit être validée par la DRH.',
    actions: [
      { text: 'Demande financement', url: '/contact', type: 'navigation' }
    ],
    tags: ['budget', 'financement', 'formation'],
    priority: 6
  },

  // === PAIE ET DOCUMENTS ===
  {
    id: 'paie-bulletin',
    category: 'Paie',
    keywords: ['bulletin', 'paie', 'salaire', 'fiche'],
    question: 'Où télécharger mes bulletins de paie ?',
    answer: 'Téléchargez vos bulletins dans Documents > Paie. Ils sont disponibles le 28 de chaque mois et conservés 5 ans. En cas de problème, contactez paie@comnat-unesco.cd avec votre matricule.',
    actions: [
      { text: 'Mes bulletins', url: '/documents', type: 'navigation' },
      { text: 'Contacter la paie', url: 'mailto:paie@comnat-unesco.cd', type: 'external' }
    ],
    tags: ['bulletin', 'paie', 'téléchargement'],
    priority: 9
  },
  {
    id: 'paie-primes',
    category: 'Paie',
    keywords: ['prime', 'indemnité', 'supplément', 'bonus'],
    question: 'Comment sont calculées les primes ?',
    answer: 'Les primes dépendent de votre grade, performance et fonctions. Prime de rendement (3-12% du salaire), prime de fonction selon le poste, et primes exceptionnelles validées par la hiérarchie.',
    actions: [
      { text: 'Détails contrat', url: '/documents', type: 'navigation' }
    ],
    tags: ['prime', 'calcul', 'performance'],
    priority: 7
  },

  // === HORAIRES ET TÉLÉTRAVAIL ===
  {
    id: 'horaires-flexibilite',
    category: 'Horaires',
    keywords: ['horaire', 'heure', 'arrivée', 'départ', 'flexible'],
    question: 'Quels sont les horaires de travail ?',
    answer: 'Horaires CNU-RDC : 8h00-16h00 du lundi au vendredi, avec pause déjeuner. 45 h/semaine selon le Code du travail congolais.',
    actions: [
      { text: 'Demande d\'absence', url: '/absences', type: 'navigation' }
    ],
    tags: ['horaires', 'flexibilité', 'planning'],
    priority: 8
  },
  {
    id: 'teletravail',
    category: 'Horaires',
    keywords: ['télétravail', 'remote', 'domicile', 'distance'],
    question: 'Comment demander le télétravail ?',
    answer: 'Télétravail possible selon accord du responsable. Demande via Absences > Télétravail avec justification.',
    actions: [
      { text: 'Demande télétravail', url: '/absences', type: 'navigation' },
      { text: 'Guide télétravail', url: '/documents', type: 'navigation' }
    ],
    tags: ['télétravail', 'remote', 'demande'],
    priority: 8
  },

  // === ÉVALUATIONS ===
  {
    id: 'evaluation-entretien',
    category: 'Évaluation',
    keywords: ['évaluation', 'entretien', 'annuel', 'bilan'],
    question: 'Quand a lieu l\'entretien annuel ?',
    answer: 'Entretien annuel entre novembre et janvier. Convocation automatique 15 jours avant par votre manager. Préparez votre auto-évaluation dans Évaluations > Mon Bilan.',
    actions: [
      { text: 'Mon évaluation', url: '/evaluations', type: 'navigation' },
      { text: 'Auto-évaluation', url: '/profile', type: 'navigation' }
    ],
    tags: ['évaluation', 'entretien', 'annuel'],
    priority: 7
  },

  // === CONTACT ET URGENCES ===
  {
    id: 'contact-rh',
    category: 'Contact',
    keywords: ['contact', 'rh', 'aide', 'assistance', 'problème'],
    question: 'Comment contacter les RH ?',
    answer: 'RH CNU-RDC : rh@comnat-unesco.cd. Bureau RH ouvert du lundi au vendredi, rendez-vous conseillé.',
    actions: [
      { text: 'Prendre RDV', url: '/contact', type: 'navigation' },
      { text: 'Écrire aux RH', url: 'mailto:rh@comnat-unesco.cd', type: 'external' }
    ],
    tags: ['contact', 'urgence', 'RH'],
    priority: 10
  }
];

// Fonction de recherche intelligente
export const findBestMatches = (query: string, limit: number = 3): KnowledgeItem[] => {
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
  
  const matches = knowledgeBase.map(item => {
    let score = 0;
    
    // Score basé sur les mots-clés
    searchTerms.forEach(term => {
      item.keywords.forEach(keyword => {
        if (keyword.includes(term)) score += 3;
        if (keyword === term) score += 5;
      });
      
      // Score basé sur la question
      if (item.question.toLowerCase().includes(term)) score += 2;
      
      // Score basé sur la réponse
      if (item.answer.toLowerCase().includes(term)) score += 1;
    });
    
    // Bonus de priorité
    score += item.priority;
    
    return { item, score };
  });
  
  return matches
    .filter(match => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(match => match.item);
};

// Suggestions contextuelles selon la page
export const getPageSuggestions = (currentPath: string): string[] => {
  const suggestions: Record<string, string[]> = {
    '/absences': [
      'Comment demander un congé ?',
      'Quel est mon solde de congés ?',
      'Comment demander le télétravail ?'
    ],
    '/trainings': [
      'Comment s\'inscrire à une formation ?',
      'Qui finance les formations ?',
      'Quelles formations sont disponibles ?'
    ],
    '/documents': [
      'Où télécharger mes bulletins de paie ?',
      'Comment sont calculées les primes ?',
      'Où trouver mon contrat ?'
    ],
    '/evaluations': [
      'Quand a lieu l\'entretien annuel ?',
      'Comment préparer mon évaluation ?',
      'Comment fixer mes objectifs ?'
    ],
    'default': [
      'Comment demander un congé ?',
      'Où voir mes bulletins de paie ?',
      'Comment contacter les RH ?',
      'Quels sont les horaires de travail ?'
    ]
  };
  
  return suggestions[currentPath] || suggestions.default;
};
