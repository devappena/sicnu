// Moteur de prédictions IA avancé pour ENA RH
import { subDays, subMonths, format, differenceInDays, differenceInMonths } from 'date-fns';

// Types pour les données prédictives
export interface EmployeeData {
  id: string;
  name: string;
  department: string;
  position: string;
  hireDate: Date;
  salary: number;
  performanceScore: number; // 0-100
  satisfactionScore: number; // 0-100
  absenceRate: number; // 0-100
  trainingHours: number;
  lastEvaluation: Date;
  age: number;
  experienceYears: number;
}

export interface PredictionResult {
  employeeId: string;
  employeeName: string;
  riskType: 'turnover' | 'burnout' | 'performance' | 'satisfaction';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0-100
  factors: string[];
  recommendations: string[];
  predictedDate?: Date;
  confidence: number; // 0-100
}

export interface TrainingRecommendation {
  employeeId: string;
  employeeName: string;
  department: string;
  recommendedTrainings: Array<{
    title: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
    estimatedImpact: number; // 0-100
    duration: string;
    cost: number;
  }>;
  skillGaps: string[];
  careerPath: string;
}

export interface DepartmentInsight {
  department: string;
  totalEmployees: number;
  avgSatisfaction: number;
  avgPerformance: number;
  turnoverRisk: number;
  burnoutRisk: number;
  trends: {
    satisfaction: 'increasing' | 'decreasing' | 'stable';
    performance: 'increasing' | 'decreasing' | 'stable';
    absences: 'increasing' | 'decreasing' | 'stable';
  };
  recommendations: string[];
}

// Générateur de données d'employés simulées (pour démo)
export const generateEmployeeData = (): EmployeeData[] => {
  const departments = ['RH', 'IT', 'Finance', 'Marketing', 'Juridique', 'Communication'];
  const positions = {
    'RH': ['DRH', 'Gestionnaire RH', 'Assistant RH', 'Chargé de recrutement'],
    'IT': ['DSI', 'Développeur', 'Administrateur système', 'Analyste'],
    'Finance': ['DAF', 'Comptable', 'Contrôleur de gestion', 'Assistant comptable'],
    'Marketing': ['Directeur Marketing', 'Chargé de communication', 'Community Manager'],
    'Juridique': ['Directeur Juridique', 'Juriste', 'Assistant juridique'],
    'Communication': ['Directeur Communication', 'Chargé de communication', 'Graphiste']
  };

  const employees: EmployeeData[] = [];
  
  for (let i = 1; i <= 50; i++) {
    const dept = departments[Math.floor(Math.random() * departments.length)];
    const positionsInDept = positions[dept as keyof typeof positions];
    const position = positionsInDept[Math.floor(Math.random() * positionsInDept.length)];
    
    const hireDate = subDays(new Date(), Math.floor(Math.random() * 2000) + 365);
    const experienceYears = differenceInMonths(new Date(), hireDate) / 12;
    
    employees.push({
      id: `EMP${i.toString().padStart(3, '0')}`,
      name: `Employé ${i}`,
      department: dept,
      position,
      hireDate,
      salary: 35000 + Math.floor(Math.random() * 45000),
      performanceScore: 60 + Math.floor(Math.random() * 35), // 60-95
      satisfactionScore: 50 + Math.floor(Math.random() * 45), // 50-95
      absenceRate: Math.floor(Math.random() * 15), // 0-15%
      trainingHours: Math.floor(Math.random() * 80), // 0-80h
      lastEvaluation: subDays(new Date(), Math.floor(Math.random() * 365)),
      age: 25 + Math.floor(Math.random() * 35), // 25-60
      experienceYears: Math.max(0, experienceYears)
    });
  }
  
  return employees;
};

// Algorithme de prédiction de turnover
export const predictTurnoverRisk = (employee: EmployeeData): PredictionResult => {
  let risk = 0;
  const factors: string[] = [];
  const recommendations: string[] = [];

  // Facteur satisfaction (poids: 35%)
  if (employee.satisfactionScore < 60) {
    risk += 35;
    factors.push('Satisfaction faible (' + employee.satisfactionScore + '%)');
    recommendations.push('Entretien individuel pour identifier les causes d\'insatisfaction');
  } else if (employee.satisfactionScore < 75) {
    risk += 20;
    factors.push('Satisfaction modérée');
  }

  // Facteur performance (poids: 25%)
  if (employee.performanceScore < 70) {
    risk += 25;
    factors.push('Performance en baisse (' + employee.performanceScore + '%)');
    recommendations.push('Plan d\'amélioration des performances avec formation ciblée');
  } else if (employee.performanceScore < 80) {
    risk += 15;
  }

  // Facteur ancienneté (poids: 20%)
  if (employee.experienceYears < 1) {
    risk += 20;
    factors.push('Nouvelle recrue (< 1 an)');
    recommendations.push('Programme d\'intégration renforcé et mentorat');
  } else if (employee.experienceYears > 5 && employee.satisfactionScore < 70) {
    risk += 15;
    factors.push('Ancienneté élevée avec satisfaction faible');
    recommendations.push('Évolution de carrière ou nouvelles responsabilités');
  }

  // Facteur absences (poids: 15%)
  if (employee.absenceRate > 10) {
    risk += 15;
    factors.push('Taux d\'absence élevé (' + employee.absenceRate + '%)');
    recommendations.push('Analyse des causes d\'absence et accompagnement');
  } else if (employee.absenceRate > 6) {
    risk += 8;
  }

  // Facteur formation (poids: 5%)
  if (employee.trainingHours < 20) {
    risk += 5;
    factors.push('Formation insuffisante (' + employee.trainingHours + 'h)');
    recommendations.push('Plan de formation personnalisé');
  }

  // Détermination du niveau de risque
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (risk >= 80) riskLevel = 'critical';
  else if (risk >= 60) riskLevel = 'high';
  else if (risk >= 40) riskLevel = 'medium';
  else riskLevel = 'low';

  // Prédiction de date (si risque élevé)
  let predictedDate: Date | undefined;
  if (risk >= 60) {
    const daysToLeaving = Math.max(30, 180 - (risk * 2));
    predictedDate = new Date(Date.now() + daysToLeaving * 24 * 60 * 60 * 1000);
  }

  return {
    employeeId: employee.id,
    employeeName: employee.name,
    riskType: 'turnover',
    riskLevel,
    probability: Math.min(100, risk),
    factors,
    recommendations,
    predictedDate,
    confidence: 85 + Math.floor(Math.random() * 10) // 85-95%
  };
};

// Algorithme de détection de burnout
export const predictBurnoutRisk = (employee: EmployeeData): PredictionResult => {
  let risk = 0;
  const factors: string[] = [];
  const recommendations: string[] = [];

  // Surcharge de travail (absences + performance)
  if (employee.absenceRate > 8 && employee.performanceScore < 75) {
    risk += 40;
    factors.push('Indicateurs de surcharge: absences élevées + performance en baisse');
    recommendations.push('Réévaluation de la charge de travail et redistribut ion des tâches');
  }

  // Satisfaction très faible
  if (employee.satisfactionScore < 50) {
    risk += 30;
    factors.push('Satisfaction critique (' + employee.satisfactionScore + '%)');
    recommendations.push('Intervention RH immédiate et accompagnement psychologique');
  }

  // Âge et ancienneté
  if (employee.age > 45 && employee.experienceYears > 10 && employee.satisfactionScore < 70) {
    risk += 20;
    factors.push('Profil senior avec signes de lassitude');
    recommendations.push('Mobilité interne ou évolution de poste');
  }

  // Formation insuffisante
  if (employee.trainingHours < 15) {
    risk += 10;
    factors.push('Manque de développement professionnel');
    recommendations.push('Plan de formation et développement des compétences');
  }

  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (risk >= 70) riskLevel = 'critical';
  else if (risk >= 50) riskLevel = 'high';
  else if (risk >= 30) riskLevel = 'medium';
  else riskLevel = 'low';

  return {
    employeeId: employee.id,
    employeeName: employee.name,
    riskType: 'burnout',
    riskLevel,
    probability: Math.min(100, risk),
    factors,
    recommendations,
    confidence: 80 + Math.floor(Math.random() * 15) // 80-95%
  };
};

// Recommandations de formation personnalisées
export const generateTrainingRecommendations = (employee: EmployeeData): TrainingRecommendation => {
  const trainingCatalog = {
    'leadership': {
      title: 'Leadership et Management',
      category: 'Management',
      duration: '3 jours',
      cost: 1200
    },
    'digital': {
      title: 'Transformation Digitale',
      category: 'Digital',
      duration: '2 jours',
      cost: 800
    },
    'communication': {
      title: 'Communication Efficace',
      category: 'Soft Skills',
      duration: '1 jour',
      cost: 500
    },
    'project': {
      title: 'Gestion de Projet',
      category: 'Management',
      duration: '3 jours',
      cost: 1000
    },
    'excel': {
      title: 'Excel Avancé',
      category: 'Bureautique',
      duration: '2 jours',
      cost: 600
    },
    'stress': {
      title: 'Gestion du Stress',
      category: 'Bien-être',
      duration: '1 jour',
      cost: 400
    }
  };

  const recommendations = [];
  const skillGaps = [];

  // Algorithme de recommandation basé sur le profil
  if (employee.performanceScore < 75) {
    recommendations.push({
      ...trainingCatalog.communication,
      priority: 'high' as const,
      reason: 'Amélioration des performances de communication',
      estimatedImpact: 25
    });
    skillGaps.push('Communication interpersonnelle');
  }

  if (employee.position.includes('Directeur') || employee.position.includes('Manager')) {
    recommendations.push({
      ...trainingCatalog.leadership,
      priority: 'high' as const,
      reason: 'Renforcement des compétences managériales',
      estimatedImpact: 30
    });
  }

  if (employee.satisfactionScore < 60) {
    recommendations.push({
      ...trainingCatalog.stress,
      priority: 'medium' as const,
      reason: 'Amélioration du bien-être au travail',
      estimatedImpact: 20
    });
    skillGaps.push('Gestion du stress');
  }

  if (employee.department === 'IT' || employee.trainingHours < 30) {
    recommendations.push({
      ...trainingCatalog.digital,
      priority: 'medium' as const,
      reason: 'Mise à niveau compétences digitales',
      estimatedImpact: 35
    });
  }

  if (employee.experienceYears > 3 && !employee.position.includes('Directeur')) {
    recommendations.push({
      ...trainingCatalog.project,
      priority: 'low' as const,
      reason: 'Développement vers des responsabilités de projet',
      estimatedImpact: 25
    });
  }

  // Parcours de carrière suggéré
  let careerPath = '';
  if (employee.experienceYears < 2) {
    careerPath = 'Consolidation des bases et montée en compétences';
  } else if (employee.experienceYears < 5) {
    careerPath = 'Évolution vers plus de responsabilités ou spécialisation';
  } else {
    careerPath = 'Évolution managériale ou expertise technique senior';
  }

  return {
    employeeId: employee.id,
    employeeName: employee.name,
    department: employee.department,
    recommendedTrainings: recommendations,
    skillGaps,
    careerPath
  };
};

// Analytics départementales
export const generateDepartmentInsights = (employees: EmployeeData[]): DepartmentInsight[] => {
  const departments = [...new Set(employees.map(e => e.department))];
  
  return departments.map(dept => {
    const deptEmployees = employees.filter(e => e.department === dept);
    const totalEmployees = deptEmployees.length;
    
    const avgSatisfaction = deptEmployees.reduce((sum, e) => sum + e.satisfactionScore, 0) / totalEmployees;
    const avgPerformance = deptEmployees.reduce((sum, e) => sum + e.performanceScore, 0) / totalEmployees;
    
    // Calcul des risques moyens
    const turnoverPredictions = deptEmployees.map(predictTurnoverRisk);
    const burnoutPredictions = deptEmployees.map(predictBurnoutRisk);
    
    const turnoverRisk = turnoverPredictions.reduce((sum, p) => sum + p.probability, 0) / totalEmployees;
    const burnoutRisk = burnoutPredictions.reduce((sum, p) => sum + p.probability, 0) / totalEmployees;

    // Tendances (simulation basée sur les scores)
    const trends = {
      satisfaction: avgSatisfaction > 75 ? 'increasing' as const : avgSatisfaction < 60 ? 'decreasing' as const : 'stable' as const,
      performance: avgPerformance > 80 ? 'increasing' as const : avgPerformance < 70 ? 'decreasing' as const : 'stable' as const,
      absences: deptEmployees.reduce((sum, e) => sum + e.absenceRate, 0) / totalEmployees > 8 ? 'increasing' as const : 'stable' as const
    };

    // Recommandations départementales
    const recommendations = [];
    if (turnoverRisk > 50) {
      recommendations.push('Action prioritaire: réduction du risque de turnover');
    }
    if (avgSatisfaction < 70) {
      recommendations.push('Amélioration de l\'environnement de travail nécessaire');
    }
    if (avgPerformance < 75) {
      recommendations.push('Programme de formation collective à mettre en place');
    }

    return {
      department: dept,
      totalEmployees,
      avgSatisfaction: Math.round(avgSatisfaction),
      avgPerformance: Math.round(avgPerformance),
      turnoverRisk: Math.round(turnoverRisk),
      burnoutRisk: Math.round(burnoutRisk),
      trends,
      recommendations
    };
  });
};

// Export des données simulées
export const mockEmployees = generateEmployeeData();
