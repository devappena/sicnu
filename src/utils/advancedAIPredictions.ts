// Module de Prédictions IA Ultra-Avancées pour ENA RH
import { subDays, addDays, format } from 'date-fns';
import { generateEmployeeData, type EmployeeData } from './aiPredictions';

// Types pour prédictions avancées
export interface AdvancedPrediction {
  type: 'performance' | 'engagement' | 'leadership' | 'innovation' | 'stress';
  employeeId: string;
  currentValue: number;
  predictedValue: number;
  confidenceLevel: number; // 0-100
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  factors: PredictionFactor[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface PredictionFactor {
  name: string;
  impact: number; // -100 to +100
  description: string;
  category: 'personal' | 'environmental' | 'organizational' | 'external';
}

export interface CareerPrediction {
  employeeId: string;
  employeeName: string;
  currentPosition: string;
  nextPromotionDate: Date;
  promotionProbability: number;
  suggestedCareerPaths: CareerPath[];
  skillGaps: SkillGap[];
  readinessScore: number;
}

export interface CareerPath {
  position: string;
  department: string;
  timeToAchieve: number; // months
  probability: number;
  requiredSkills: string[];
  estimatedSalaryIncrease: number;
}

export interface SkillGap {
  skill: string;
  currentLevel: number; // 1-10
  requiredLevel: number; // 1-10
  priority: 'low' | 'medium' | 'high' | 'critical';
  trainingOptions: string[];
  timeToAcquire: number; // weeks
}

// Algorithmes de prédiction avancés
export const generateAdvancedPredictions = (): AdvancedPrediction[] => {
  const predictions: AdvancedPrediction[] = [];
  const employees = generateEmployeeData(); // Import from aiPredictions.ts

  employees.forEach(employee => {
    // Prédiction de performance
    const performancePrediction: AdvancedPrediction = {
      type: 'performance',
      employeeId: employee.id,
      currentValue: employee.performanceScore,
      predictedValue: calculatePerformanceTrend(employee),
      confidenceLevel: 85 + Math.random() * 10,
      timeframe: 'quarter',
      factors: generatePerformanceFactors(employee),
      recommendations: generatePerformanceRecommendations(employee),
      riskLevel: getPerformanceRiskLevel(employee)
    };
    predictions.push(performancePrediction);

    // Prédiction d'engagement
    const engagementPrediction: AdvancedPrediction = {
      type: 'engagement',
      employeeId: employee.id,
      currentValue: employee.satisfactionScore,
      predictedValue: calculateEngagementTrend(employee),
      confidenceLevel: 80 + Math.random() * 15,
      timeframe: 'month',
      factors: generateEngagementFactors(employee),
      recommendations: generateEngagementRecommendations(employee),
      riskLevel: getEngagementRiskLevel(employee)
    };
    predictions.push(engagementPrediction);
  });

  return predictions;
};

// Calcul des tendances de performance
const calculatePerformanceTrend = (employee: any): number => {
  const baseScore = employee.performanceScore;
  const experienceFactor = Math.min(employee.experienceYears * 2, 10);
  const satisfactionFactor = (employee.satisfactionScore - 50) * 0.3;
  const trainingFactor = Math.min(employee.trainingHours * 0.1, 5);
  
  return Math.min(Math.max(
    baseScore + experienceFactor + satisfactionFactor + trainingFactor + (Math.random() * 10 - 5),
    0
  ), 100);
};

// Calcul des tendances d'engagement
const calculateEngagementTrend = (employee: any): number => {
  const baseScore = employee.satisfactionScore;
  const workloadFactor = employee.absenceRate > 8 ? -10 : 5;
  const careerProgressFactor = employee.experienceYears > 5 ? -5 : 10;
  const performanceFactor = (employee.performanceScore - 70) * 0.2;
  
  return Math.min(Math.max(
    baseScore + workloadFactor + careerProgressFactor + performanceFactor + (Math.random() * 8 - 4),
    0
  ), 100);
};

const generateCareerPaths = (employee: EmployeeData): CareerPath[] => {
  const paths: CareerPath[] = [
    {
      position: 'Senior ' + employee.position,
      department: employee.department,
      timeToAchieve: 12 + Math.random() * 12,
      probability: 70 + Math.random() * 25,
      requiredSkills: ['Leadership', 'Communication', 'Gestion de projet'],
      estimatedSalaryIncrease: 15 + Math.random() * 10
    },
    {
      position: 'Manager ' + employee.department,
      department: employee.department,
      timeToAchieve: 18 + Math.random() * 18,
      probability: 45 + Math.random() * 30,
      requiredSkills: ['Management', 'Stratégie', 'Budget'],
      estimatedSalaryIncrease: 25 + Math.random() * 15
    }
  ];

  return paths;
};

const generateSkillGaps = (employee: EmployeeData): SkillGap[] => {
  const skills = ['Leadership', 'Communication', 'Analyse de données', 'Gestion de projet', 'Innovation'];
  
  return skills.slice(0, 3).map(skill => ({
    skill,
    currentLevel: Math.floor(Math.random() * 6) + 3,
    requiredLevel: Math.floor(Math.random() * 3) + 7,
    priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
    trainingOptions: [`Formation ${skill}`, `Certification ${skill}`, `Mentoring ${skill}`],
    timeToAcquire: Math.floor(Math.random() * 12) + 4
  }));
};

// Génération de facteurs de performance
const generatePerformanceFactors = (employee: EmployeeData): PredictionFactor[] => {
  const factors: PredictionFactor[] = [];
  
  if (employee.trainingHours > 40) {
    factors.push({
      name: 'Formation intensive',
      impact: 15,
      description: 'Nombreuses heures de formation récentes',
      category: 'personal'
    });
  }
  
  if (employee.satisfactionScore < 60) {
    factors.push({
      name: 'Satisfaction faible',
      impact: -20,
      description: 'Score de satisfaction en baisse',
      category: 'personal'
    });
  }
  
  if (employee.experienceYears > 10) {
    factors.push({
      name: 'Expérience élevée',
      impact: 10,
      description: 'Grande expérience dans le domaine',
      category: 'personal'
    });
  }
  
  return factors;
};

// Génération de facteurs d'engagement
const generateEngagementFactors = (employee: EmployeeData): PredictionFactor[] => {
  const factors: PredictionFactor[] = [];
  
  if (employee.absenceRate > 10) {
    factors.push({
      name: 'Absentéisme élevé',
      impact: -25,
      description: 'Taux d\'absence supérieur à la moyenne',
      category: 'environmental'
    });
  }
  
  if (employee.performanceScore > 80) {
    factors.push({
      name: 'Performance élevée',
      impact: 20,
      description: 'Excellentes performances récentes',
      category: 'personal'
    });
  }
  
  return factors;
};

// Génération de recommandations de performance
const generatePerformanceRecommendations = (employee: EmployeeData): string[] => {
  const recommendations: string[] = [];
  
  if (employee.trainingHours < 20) {
    recommendations.push('Augmenter les heures de formation');
  }
  
  if (employee.performanceScore < 70) {
    recommendations.push('Plan d\'amélioration personnalisé');
    recommendations.push('Mentoring avec un senior');
  }
  
  if (employee.satisfactionScore < 60) {
    recommendations.push('Entretien de motivation');
    recommendations.push('Révision des objectifs');
  }
  
  return recommendations;
};

// Génération de recommandations d'engagement
const generateEngagementRecommendations = (employee: EmployeeData): string[] => {
  const recommendations: string[] = [];
  
  if (employee.absenceRate > 8) {
    recommendations.push('Analyser les causes d\'absence');
    recommendations.push('Proposer du télétravail');
  }
  
  if (employee.satisfactionScore < 70) {
    recommendations.push('Enquête de satisfaction approfondie');
    recommendations.push('Plan d\'amélioration du bien-être');
  }
  
  return recommendations;
};

// Calcul des niveaux de risque
const getPerformanceRiskLevel = (employee: EmployeeData): 'low' | 'medium' | 'high' | 'critical' => {
  if (employee.performanceScore < 50) return 'critical';
  if (employee.performanceScore < 65) return 'high';
  if (employee.performanceScore < 80) return 'medium';
  return 'low';
};

const getEngagementRiskLevel = (employee: EmployeeData): 'low' | 'medium' | 'high' | 'critical' => {
  if (employee.satisfactionScore < 40) return 'critical';
  if (employee.satisfactionScore < 55) return 'high';
  if (employee.satisfactionScore < 70) return 'medium';
  return 'low';
};

// Prédictions de carrière
export const generateCareerPredictions = (): CareerPrediction[] => {
  const employees = generateEmployeeData();
  
  return employees.slice(0, 10).map(employee => ({
    employeeId: employee.id,
    employeeName: employee.name,
    currentPosition: employee.position,
    nextPromotionDate: addDays(new Date(), Math.random() * 365 + 180),
    promotionProbability: Math.random() * 100,
    suggestedCareerPaths: generateCareerPaths(employee),
    skillGaps: generateSkillGaps(employee),
    readinessScore: Math.random() * 100
  }));
};
