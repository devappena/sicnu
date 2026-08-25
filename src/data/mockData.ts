import type { 
  Employee, 
  Department, 
  Absence, 
  Training, 
  Contract,
  Payroll,
  Position,
  Document,
  LeaveBalance,
  PerformanceReview,
  Skill,
  EmployeeSkill,
  TrainingProgram,
  Holiday,
  Notification,
  DashboardStats,
  // Nouveaux types
  ApprovalWorkflow,
  ApprovalRule,
  PayrollPeriod,
  PayrollItem,
  ExpenseReport,
  Budget,
  KPI,
  ReportTemplate
} from '../types';

export const mockEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'Victor',
    lastName: 'Bafuafua Mande',
    email: 'admin@shodan.cd',
    phone: '+243 810 000 001',
    position: 'Administrateur',
    department: 'Secrétariat général',
    salary: 1500000,
    hireDate: new Date('2020-01-15'),
    status: 'active',
    address: 'Gombe, Kinshasa',
    dateOfBirth: new Date('1985-03-20'),
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  },
  {
    id: '2',
    firstName: 'Jonas',
    lastName: 'Maki Busha',
    email: 'drh@shodan.cd',
    phone: '+243 810 000 002',
    position: 'Directeur RH',
    department: 'Ressources humaines',
    salary: 1200000,
    hireDate: new Date('2021-03-10'),
    status: 'active',
    address: 'Gombe, Kinshasa',
    dateOfBirth: new Date('1988-07-12'),
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  },
  {
    id: '3',
    firstName: 'Junior',
    lastName: 'Kizir Woldia',
    email: 'agent1@shodan.cd',
    phone: '+243 810 000 003',
    position: 'Assistant administratif',
    department: 'Programmes',
    salary: 600000,
    hireDate: new Date('2022-01-20'),
    status: 'active',
    address: 'Kinshasa',
    dateOfBirth: new Date('1992-05-15'),
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  },
  {
    id: '4',
    firstName: 'Ghislain',
    lastName: 'Baende',
    email: 'agent2@shodan.cd',
    phone: '+243 810 000 004',
    position: 'Chargé de programmes',
    department: 'Programmes',
    salary: 650000,
    hireDate: new Date('2022-06-01'),
    status: 'active',
    address: 'Kinshasa',
    dateOfBirth: new Date('1994-09-08'),
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  },
  {
    id: '5',
    firstName: 'Yasmine',
    lastName: 'Kabanga',
    email: 'yasmine.kabanga@shodan.cd',
    phone: '+243 810 000 005',
    position: 'Chargée de communication',
    department: 'Communication',
    salary: 700000,
    hireDate: new Date('2021-06-15'),
    status: 'active',
    address: 'Kinshasa',
    dateOfBirth: new Date('1996-12-08'),
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  }
];

export const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Administration',
    description: 'Gestion administrative et financière',
    headOfDepartment: 'Victor Bafuafua Mande',
    employeeCount: 8
  },
  {
    id: '2',
    name: 'Ressources Humaines',
    description: 'Gestion du personnel et développement des compétences',
    headOfDepartment: 'Jonas Maki Busha',
    employeeCount: 4
  },
  {
    id: '3',
    name: 'Académique',
    description: 'Formation et recherche académique',
    headOfDepartment: 'Pierre Tshisekedi',
    employeeCount: 12
  },
  {
    id: '4',
    name: 'Sécurité',
    description: 'Sécurité et surveillance des locaux',
    headOfDepartment: 'Yasmine Kabanga',
    employeeCount: 6
  }
];

export const mockAbsences: Absence[] = [
  {
    id: '1',
    employeeId: '2',
    type: 'vacation',
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-07-15'),
    reason: 'Congés annuels',
    status: 'pending'
  },
  {
    id: '2',
    employeeId: '5',
    type: 'sick',
    startDate: new Date('2025-06-20'),
    endDate: new Date('2025-06-25'),
    reason: 'Maladie',
    status: 'approved',
    approvedBy: '2'
  },
  {
    id: '3',
    employeeId: '4',
    type: 'personal',
    startDate: new Date('2025-07-10'),
    endDate: new Date('2025-07-12'),
    reason: 'Affaires personnelles',
    status: 'pending'
  }
];

export const mockTrainings: Training[] = [
  {
    id: '1',
    title: 'Formation en Leadership',
    description: 'Développement des compétences en leadership pour les cadres',
    startDate: new Date('2025-08-01'),
    endDate: new Date('2025-08-03'),
    instructor: 'Dr. Mbombo Nzeza',
    capacity: 20,
    enrolledEmployees: ['1', '2', '3'],
    participants: ['1', '2', '3'],
    status: 'scheduled',
    location: 'Salle de conférence A'
  },
  {
    id: '2',
    title: 'Gestion Financière Publique',
    description: 'Principes de gestion financière dans le secteur public',
    startDate: new Date('2025-07-15'),
    endDate: new Date('2025-07-17'),
    instructor: 'Prof. Kimani Wa Kongo',
    capacity: 25,
    enrolledEmployees: ['1', '4'],
    participants: ['1', '4'],
    status: 'scheduled',
    location: 'Auditorium principal'
  },
  {
    id: '3',
    title: 'Communication Professionnelle',
    description: 'Amélioration des compétences en communication écrite et orale',
    startDate: new Date('2025-06-20'),
    endDate: new Date('2025-06-21'),
    instructor: 'Mme. Sangala Lutte',
    capacity: 30,
    enrolledEmployees: ['2', '3', '4', '5'],
    participants: ['2', '3', '4', '5'],
    status: 'completed',
    location: 'Salle polyvalente'
  },
  {
    id: '4',
    title: 'Informatique Avancée',
    description: 'Formation aux outils informatiques avancés',
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-07-05'),
    instructor: 'Ing. Muteba Tech',
    capacity: 15,
    enrolledEmployees: ['1', '3', '5'],
    participants: ['1', '3', '5'],
    status: 'in-progress',
    location: 'Laboratoire informatique'
  }
];

// Nouvelles données mockées
export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'absence_request',
    title: 'Nouvelle demande d\'absence',
    message: 'Grace Kabila a soumis une demande de congé',
    read: false,
    createdAt: new Date('2025-06-24T10:30:00')
  },
  {
    id: '2',
    userId: '2',
    type: 'training_reminder',
    title: 'Formation à venir',
    message: 'Rappel: Formation en Leadership demain à 9h',
    read: false,
    createdAt: new Date('2025-06-24T14:15:00')
  },
  {
    id: '3',
    userId: '1',
    type: 'birthday',
    title: 'Anniversaire',
    message: 'Pierre Tshisekedi fête son anniversaire aujourd\'hui',
    read: true,
    createdAt: new Date('2025-06-25T08:00:00')
  }
];

export const mockDashboardStats: DashboardStats = {
  totalEmployees: 30,
  activeEmployees: 28,
  pendingAbsences: 2,
  upcomingTrainings: 3,
  birthdaysThisMonth: 4,
  newHiresThisMonth: 2
};

export const mockContracts: Contract[] = [
  {
    id: '1',
    employeeId: '1',
    type: 'permanent',
    startDate: new Date('2020-01-15'),
    salary: 1500000,
    benefits: ['Assurance santé', 'Transport', 'Logement de fonction']
  },
  {
    id: '2',
    employeeId: '2',
    type: 'permanent',
    startDate: new Date('2021-03-10'),
    salary: 1200000,
    benefits: ['Assurance santé', 'Transport', 'Prime de performance']
  },
  {
    id: '3',
    employeeId: '3',
    type: 'permanent',
    startDate: new Date('2019-09-01'),
    salary: 800000,
    benefits: ['Assurance santé', 'Transport']
  }
];

export const mockPayrolls: Payroll[] = [
  {
    id: '1',
    employeeId: '1',
    month: 'Juin',
    year: 2025,
    baseSalary: 1500000,
    bonuses: 200000,
    deductions: 50000,
    netSalary: 1350000,
    taxes: 225000,
    socialSecurity: 75000,
    overtime: 0,
    status: 'paid'
  },
  {
    id: '2',
    employeeId: '2',
    month: 'Juin',
    year: 2025,
    baseSalary: 1200000,
    bonuses: 100000,
    deductions: 30000,
    netSalary: 1050000,
    taxes: 180000,
    socialSecurity: 60000,
    overtime: 25000,
    status: 'processed'
  }
];

export const mockPositions: Position[] = [
  {
    id: '1',
    title: 'Directeur Administratif',
    department: 'Administration',
    level: 'director',
    requirements: ['Master en Administration', '10+ ans d\'expérience', 'Leadership'],
    responsibilities: ['Supervision équipe', 'Gestion budgétaire', 'Planification stratégique'],
    salaryRange: { min: 1400000, max: 1800000 },
    isActive: true
  },
  {
    id: '2',
    title: 'Responsable RH',
    department: 'Ressources Humaines',
    level: 'manager',
    requirements: ['Master en RH', '5+ ans d\'expérience', 'Gestion d\'équipe'],
    responsibilities: ['Recrutement', 'Formation', 'Gestion des performances'],
    salaryRange: { min: 1000000, max: 1400000 },
    isActive: true
  }
];

export const mockDocuments: Document[] = [
  {
    id: '1',
    employeeId: '1',
    type: 'contract',
    name: 'Contrat_Victor_Bafuafua.pdf',
    url: '/documents/contracts/contract_1.pdf',
    uploadDate: new Date('2020-01-15'),
    size: 2048000,
    isConfidential: true
  },
  {
    id: '2',
    employeeId: '1',
    type: 'cv',
    name: 'CV_Victor_Bafuafua.pdf',
    url: '/documents/cvs/cv_1.pdf',
    uploadDate: new Date('2020-01-10'),
    size: 1024000,
    isConfidential: false
  }
];

export const mockLeaveBalances: LeaveBalance[] = [
  {
    employeeId: '1',
    year: 2026,
    annualLeave: { total: 30, used: 12, remaining: 18 },
    sickLeave: { total: 15, used: 3, remaining: 12 },
    personalLeave: { total: 5, used: 1, remaining: 4 }
  },
  {
    employeeId: '2',
    year: 2026,
    annualLeave: { total: 30, used: 8, remaining: 22 },
    sickLeave: { total: 15, used: 0, remaining: 15 },
    personalLeave: { total: 5, used: 2, remaining: 3 }
  },
  {
    employeeId: '3',
    year: 2026,
    annualLeave: { total: 30, used: 5, remaining: 25 },
    sickLeave: { total: 15, used: 1, remaining: 14 },
    personalLeave: { total: 5, used: 0, remaining: 5 }
  },
  {
    employeeId: '4',
    year: 2026,
    annualLeave: { total: 24, used: 10, remaining: 14 },
    sickLeave: { total: 15, used: 2, remaining: 13 },
    personalLeave: { total: 5, used: 1, remaining: 4 }
  },
  {
    employeeId: '5',
    year: 2026,
    annualLeave: { total: 24, used: 4, remaining: 20 },
    sickLeave: { total: 15, used: 5, remaining: 10 },
    personalLeave: { total: 5, used: 0, remaining: 5 }
  }
];

export const mockSkills: Skill[] = [
  {
    id: '1',
    name: 'Leadership',
    category: 'Management',
    description: 'Capacité à diriger et motiver une équipe'
  },
  {
    id: '2',
    name: 'Gestion Financière',
    category: 'Finance',
    description: 'Compétences en gestion budgétaire et financière'
  },
  {
    id: '3',
    name: 'Communication',
    category: 'Soft Skills',
    description: 'Compétences en communication écrite et orale'
  }
];

export const mockEmployeeSkills: EmployeeSkill[] = [
  {
    employeeId: '1',
    skillId: '1',
    level: 'advanced',
    certifiedDate: new Date('2023-01-15')
  },
  {
    employeeId: '1',
    skillId: '2',
    level: 'expert',
    certifiedDate: new Date('2022-06-10')
  },
  {
    employeeId: '2',
    skillId: '3',
    level: 'advanced',
    certifiedDate: new Date('2023-03-20')
  }
];

export const mockTrainingPrograms: TrainingProgram[] = [
  {
    id: '1',
    name: 'Programme Leadership Avancé',
    description: 'Formation complète en leadership et gestion d\'équipe',
    duration: 40,
    cost: 500000,
    provider: 'CNU Formation',
    category: 'Management',
    prerequisites: ['Expérience managériale', 'Formation de base'],
    skills: ['1', '3'],
    certification: true
  },
  {
    id: '2',
    name: 'Gestion Financière Publique',
    description: 'Formation aux principes de gestion financière publique',
    duration: 24,
    cost: 300000,
    provider: 'Institut des Finances',
    category: 'Finance',
    prerequisites: ['Connaissance comptable'],
    skills: ['2'],
    certification: true
  }
];

export const mockHolidays: Holiday[] = [
  {
    id: '1',
    name: 'Fête de l\'Indépendance',
    date: new Date('2025-06-30'),
    type: 'national',
    isRecurring: true
  },
  {
    id: '2',
    name: 'Noël',
    date: new Date('2025-12-25'),
    type: 'religious',
    isRecurring: true
  },
  {
    id: '3',
    name: 'Journée CNU-RDC',
    date: new Date('2025-09-15'),
    type: 'company',
    isRecurring: true
  }
];

export const mockPerformanceReviews: PerformanceReview[] = [
  {
    id: '1',
    employeeId: '1',
    reviewerId: '2',
    period: '2025-S1',
    goals: [
      {
        description: 'Améliorer l\'efficacité administrative',
        status: 'completed',
        rating: 4
      },
      {
        description: 'Former 3 nouveaux employés',
        status: 'in_progress',
        rating: 3
      }
    ],
    competencies: [
      {
        name: 'Leadership',
        rating: 4,
        comments: 'Excellent leadership, inspire l\'équipe'
      },
      {
        name: 'Communication',
        rating: 4,
        comments: 'Communication claire et efficace'
      }
    ],
    overallRating: 4,
    feedback: 'Performance excellente durant cette période',
    developmentPlan: ['Formation en innovation', 'Certification management'],
    status: 'approved',
    dueDate: new Date('2025-06-30'),
    completedDate: new Date('2025-06-25')
  }
];

// === NOUVELLES DONNÉES MOCKÉES POUR LES 3 MODULES ===

// Workflow d'approbation
export const mockApprovalRules: ApprovalRule[] = [
  {
    id: '1',
    type: 'absence',
    conditions: [
      {
        field: 'duration',
        operator: 'greater_than',
        value: 3,
        logicalOperator: 'AND'
      }
    ],
    steps: [
      {
        stepIndex: 0,
        approverType: 'department_head',
        isRequired: true,
        canDelegate: true,
        timeoutHours: 48
      },
      {
        stepIndex: 1,
        approverType: 'hr',
        isRequired: true,
        canDelegate: false,
        timeoutHours: 24
      }
    ],
    isActive: true,
    createdBy: '2',
    createdAt: new Date('2025-01-01')
  },
  {
    id: '2',
    type: 'expense',
    conditions: [
      {
        field: 'amount',
        operator: 'greater_than',
        value: 500000,
        logicalOperator: 'OR'
      }
    ],
    steps: [
      {
        stepIndex: 0,
        approverType: 'department_head',
        isRequired: true,
        canDelegate: true,
        timeoutHours: 24
      },
      {
        stepIndex: 1,
        approverType: 'specific_user',
        approverId: '1', // Directeur Administratif
        isRequired: true,
        canDelegate: false,
        timeoutHours: 48
      }
    ],
    isActive: true,
    createdBy: '1',
    createdAt: new Date('2025-01-01')
  }
];

export const mockApprovalWorkflows: ApprovalWorkflow[] = [
  {
    id: '1',
    type: 'absence',
    requestId: '1',
    requesterId: '3',
    steps: [
      {
        stepIndex: 0,
        approverId: '2',
        approverRole: 'department_head',
        approverName: 'Victor Bafuafua Mande',
        status: 'approved',
        actionDate: new Date('2025-07-01'),
        comments: 'Approuvé - période de faible activité',
        isRequired: true,
        canDelegate: true
      },
      {
        stepIndex: 1,
        approverId: '1',
        approverRole: 'hr',
        approverName: 'Jonas Maki Busha',
        status: 'pending',
        isRequired: true,
        canDelegate: false
      }
    ],
    currentStepIndex: 1,
    status: 'pending',
    createdAt: new Date('2025-06-30'),
    metadata: {
      absenceType: 'vacation',
      duration: 5
    }
  }
];

// Finance avancée
export const mockPayrollPeriods: PayrollPeriod[] = [
  {
    id: '2025-07',
    period: '2025-07',
    year: 2025,
    month: 7,
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-07-31'),
    payDate: new Date('2025-07-31'),
    status: 'calculated',
    totalGross: 15750000,
    totalNet: 12600000,
    totalTaxes: 3150000,
    employeeCount: 8,
    createdBy: '1',
    createdAt: new Date('2025-07-01')
  },
  {
    id: '2025-06',
    period: '2025-06',
    year: 2025,
    month: 6,
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-06-30'),
    payDate: new Date('2025-06-30'),
    status: 'paid',
    totalGross: 15750000,
    totalNet: 12600000,
    totalTaxes: 3150000,
    employeeCount: 8,
    createdBy: '1',
    createdAt: new Date('2025-06-01')
  }
];

export const mockPayrollItems: PayrollItem[] = [
  {
    id: '1',
    payrollId: '2025-07',
    employeeId: '1',
    baseSalary: 1500000,
    allowances: [
      { type: 'transport', amount: 200000, isTaxable: false },
      { type: 'meal', amount: 150000, isTaxable: false },
      { type: 'housing', amount: 300000, isTaxable: true }
    ],
    deductions: [
      { type: 'advance', amount: 100000, description: 'Avance sur salaire' }
    ],
    overtime: [],
    bonuses: [
      { type: 'performance', amount: 250000, description: 'Prime performance Q2', isTaxable: true }
    ],
    grossSalary: 2300000,
    taxableAmount: 2050000,
    incomeTax: 410000,
    socialSecurity: 115000,
    otherDeductions: 100000,
    netSalary: 1675000,
    bankAccount: 'BCC-001-123456789',
    paymentMethod: 'bank_transfer',
    status: 'approved'
  }
];

export const mockExpenseReports: ExpenseReport[] = [
  {
    id: '1',
    employeeId: '3',
    title: 'Mission Lubumbashi - Formation',
    description: 'Frais de mission pour formation en gestion publique',
    totalAmount: 750000,
    currency: 'CDF',
    category: 'travel',
    submittedDate: new Date('2025-06-25'),
    status: 'submitted',
    expenses: [
      {
        id: '1',
        date: new Date('2025-06-20'),
        description: 'Billet d\'avion Kinshasa-Lubumbashi',
        amount: 400000,
        category: 'transport',
        isReimbursable: true
      },
      {
        id: '2',
        date: new Date('2025-06-21'),
        description: 'Hébergement hôtel (3 nuits)',
        amount: 300000,
        category: 'accommodation',
        isReimbursable: true
      },
      {
        id: '3',
        date: new Date('2025-06-22'),
        description: 'Repas et frais divers',
        amount: 50000,
        category: 'meals',
        isReimbursable: true
      }
    ]
  }
];

export const mockBudgets: Budget[] = [
  {
    id: '2025-rh',
    name: 'Budget RH 2025',
    description: 'Budget annuel pour les ressources humaines',
    department: 'Ressources Humaines',
    fiscalYear: 2025,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    totalBudget: 25000000,
    spent: 12500000,
    committed: 2500000,
    available: 10000000,
    categories: [
      {
        id: 'formation',
        name: 'Formation et Développement',
        allocatedAmount: 5000000,
        spentAmount: 1800000,
        responsibleUserId: '2'
      },
      {
        id: 'recrutement',
        name: 'Recrutement',
        allocatedAmount: 3000000,
        spentAmount: 1200000,
        responsibleUserId: '2'
      },
      {
        id: 'evaluation',
        name: 'Évaluation Performance',
        allocatedAmount: 2000000,
        spentAmount: 500000,
        responsibleUserId: '1'
      }
    ],
    status: 'active',
    createdBy: '1',
    approvedBy: '1'
  }
];

export const mockKPIs: KPI[] = [
  {
    id: 'attendance-rate',
    name: 'Taux de Présence',
    value: 94.5,
    target: 95,
    unit: '%',
    trend: 'down',
    changePercent: -1.2,
    period: 'Juillet 2025',
    category: 'hr'
  },
  {
    id: 'overtime-hours',
    name: 'Heures Supplémentaires',
    value: 127,
    target: 100,
    unit: 'heures',
    trend: 'up',
    changePercent: 27,
    period: 'Juillet 2025',
    category: 'operations'
  },
  {
    id: 'budget-utilization',
    name: 'Utilisation Budget RH',
    value: 62.5,
    target: 70,
    unit: '%',
    trend: 'up',
    changePercent: 5.3,
    period: 'Juillet 2025',
    category: 'finance'
  }
];

export const mockReportTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Rapport Mensuel de Paie',
    description: 'Récapitulatif mensuel des salaires et charges',
    type: 'payroll',
    parameters: [
      { name: 'period', type: 'date', required: true, defaultValue: new Date() },
      { name: 'department', type: 'text', required: false }
    ],
    schedule: {
      frequency: 'monthly',
      dayOfMonth: 1,
      time: '09:00',
      isActive: true
    },
    recipients: ['aline.kalala@comnat-unesco.cd', 'joel.nyengele@comnat-unesco.cd'],
    format: 'pdf',
    isActive: true
  }
];
