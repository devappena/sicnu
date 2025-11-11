export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  hireDate: Date;
  status: 'active' | 'inactive' | 'on_leave';
  photo?: string;
  address: string;
  dateOfBirth: Date;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Department {
  id: string;
  name: string;
  description: string;
  headOfDepartment: string;
  employeeCount: number;
}

export interface Absence {
  id: string;
  employeeId: string;
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity';
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  documents?: string[];
}

export interface Training {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  instructor: string;
  capacity: number;
  enrolledEmployees: string[];
  participants: string[]; // IDs des participants
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  location?: string;
}

export interface Evaluation {
  id: string;
  employeeId: string;
  evaluatorId: string;
  period: string;
  overallRating: number;
  goals: string[];
  achievements: string[];
  areasForImprovement: string[];
  feedback: string;
  date: Date;
}

export interface User {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'hr' | 'employee';
  employeeId?: string;
  lastLogin?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'absence_request' | 'training_reminder' | 'evaluation_due' | 'birthday';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  pendingAbsences: number;
  upcomingTrainings: number;
  birthdaysThisMonth: number;
  newHiresThisMonth: number;
}

export interface Contract {
  id: string;
  employeeId: string;
  type: 'permanent' | 'temporary' | 'intern' | 'consultant';
  startDate: Date;
  endDate?: Date;
  salary: number;
  benefits: string[];
  renewalOptions?: string[];
}

export interface Payroll {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  taxes: number;
  socialSecurity: number;
  overtime: number;
  status: 'draft' | 'processed' | 'paid';
}

export interface Position {
  id: string;
  title: string;
  department: string;
  level: 'junior' | 'senior' | 'lead' | 'manager' | 'director';
  requirements: string[];
  responsibilities: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  isActive: boolean;
}

export interface Document {
  id: string;
  employeeId: string;
  type: 'contract' | 'cv' | 'certificate' | 'id_copy' | 'photo' | 'other';
  name: string;
  url: string;
  uploadDate: Date;
  size: number;
  isConfidential: boolean;
}

export interface LeaveBalance {
  employeeId: string;
  year: number;
  annualLeave: {
    total: number;
    used: number;
    remaining: number;
  };
  sickLeave: {
    total: number;
    used: number;
    remaining: number;
  };
  personalLeave: {
    total: number;
    used: number;
    remaining: number;
  };
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  period: string;
  goals: Array<{
    description: string;
    status: 'not_started' | 'in_progress' | 'completed';
    rating: number;
  }>;
  competencies: Array<{
    name: string;
    rating: number;
    comments: string;
  }>;
  overallRating: number;
  feedback: string;
  developmentPlan: string[];
  status: 'draft' | 'submitted' | 'approved';
  dueDate: Date;
  completedDate?: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface EmployeeSkill {
  employeeId: string;
  skillId: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  certifiedDate?: Date;
  expiryDate?: Date;
}

export interface TrainingProgram {
  id: string;
  name: string;
  description: string;
  duration: number; // en heures
  cost: number;
  provider: string;
  category: string;
  prerequisites: string[];
  skills: string[]; // IDs des compétences développées
  certification: boolean;
}

export interface TimeSheet {
  id: string;
  employeeId: string;
  date: Date;
  clockIn: Date;
  clockOut?: Date;
  breakDuration: number; // en minutes
  totalHours: number;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: Date;
  type: 'national' | 'religious' | 'company';
  isRecurring: boolean;
}

// === WORKFLOW D'APPROBATION ===
export interface ApprovalWorkflow {
  id: string;
  type: 'absence' | 'training' | 'expense' | 'overtime' | 'budget_request';
  requestId: string; // ID de la demande (absence, training, etc.)
  requesterId: string;
  steps: ApprovalStep[];
  currentStepIndex: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface ApprovalStep {
  stepIndex: number;
  approverId: string;
  approverRole: string;
  approverName: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  actionDate?: Date;
  comments?: string;
  isRequired: boolean;
  canDelegate: boolean;
  delegatedTo?: string;
}

export interface ApprovalRule {
  id: string;
  type: 'absence' | 'training' | 'expense' | 'overtime' | 'budget_request';
  conditions: ApprovalCondition[];
  steps: ApprovalRuleStep[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface ApprovalCondition {
  field: string; // ex: 'amount', 'duration', 'department'
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
  value: string | number | boolean | Date;
  logicalOperator?: 'AND' | 'OR';
}

export interface ApprovalRuleStep {
  stepIndex: number;
  approverType: 'specific_user' | 'role' | 'department_head' | 'hr';
  approverId?: string;
  approverRole?: string;
  isRequired: boolean;
  canDelegate: boolean;
  timeoutHours?: number;
}

// === FINANCE AVANCÉE ===
export interface PayrollPeriod {
  id: string;
  period: string; // "2025-07"
  year: number;
  month: number;
  startDate: Date;
  endDate: Date;
  payDate: Date;
  status: 'draft' | 'calculated' | 'approved' | 'paid' | 'closed';
  totalGross: number;
  totalNet: number;
  totalTaxes: number;
  employeeCount: number;
  createdBy: string;
  createdAt: Date;
}

export interface PayrollItem {
  id: string;
  payrollId: string;
  employeeId: string;
  baseSalary: number;
  allowances: PayrollAllowance[];
  deductions: PayrollDeduction[];
  overtime: OvertimeEntry[];
  bonuses: BonusEntry[];
  grossSalary: number;
  taxableAmount: number;
  incomeTax: number;
  socialSecurity: number;
  otherDeductions: number;
  netSalary: number;
  bankAccount: string;
  paymentMethod: 'bank_transfer' | 'cash' | 'check';
  status: 'pending' | 'approved' | 'paid';
}

export interface PayrollAllowance {
  type: 'transport' | 'meal' | 'housing' | 'phone' | 'family' | 'risk' | 'other';
  amount: number;
  isTaxable: boolean;
  description?: string;
}

export interface PayrollDeduction {
  type: 'advance' | 'loan' | 'insurance' | 'union' | 'tax' | 'penalty' | 'other';
  amount: number;
  description?: string;
  reference?: string;
}

export interface BonusEntry {
  type: 'performance' | 'annual' | 'holiday' | 'achievement' | 'other';
  amount: number;
  description: string;
  isTaxable: boolean;
}

export interface ExpenseReport {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  totalAmount: number;
  currency: 'CDF' | 'USD' | 'EUR';
  category: 'travel' | 'meals' | 'transport' | 'supplies' | 'training' | 'other';
  submittedDate: Date;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid';
  workflowId?: string;
  approvedBy?: string;
  approvedDate?: Date;
  expenses: ExpenseItem[];
}

export interface ExpenseItem {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  receipt?: string; // URL du reçu
  isReimbursable: boolean;
  comments?: string;
}

export interface Budget {
  id: string;
  name: string;
  description: string;
  department: string;
  fiscalYear: number;
  startDate: Date;
  endDate: Date;
  totalBudget: number;
  spent: number;
  committed: number;
  available: number;
  categories: BudgetCategory[];
  status: 'draft' | 'approved' | 'active' | 'closed';
  createdBy: string;
  approvedBy?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocatedAmount: number;
  spentAmount: number;
  description?: string;
  responsibleUserId?: string;
}

// === GESTION DU TEMPS AVANCÉE ===
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: Date;
  clockIn?: Date;
  clockOut?: Date;
  breaks: BreakRecord[];
  totalWorkedHours: number;
  scheduledHours: number;
  overtimeHours: number;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'early_departure';
  location?: string;
  device?: string; // Pour le pointage
  ipAddress?: string;
  notes?: string;
  approvedBy?: string;
}

export interface BreakRecord {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // en minutes
  type: 'lunch' | 'coffee' | 'personal' | 'meeting';
  isPaid: boolean;
}

export interface WorkSchedule {
  id: string;
  employeeId: string;
  name: string;
  effectiveDate: Date;
  endDate?: Date;
  workDays: WorkDay[];
  totalWeeklyHours: number;
  isFlexible: boolean;
  overtimeRules: OvertimeRule[];
}

export interface WorkDay {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Dimanche
  isWorkDay: boolean;
  startTime?: string; // "08:00"
  endTime?: string; // "17:00"
  breakDuration?: number; // en minutes
  minimumHours?: number;
}

export interface OvertimeRule {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'holiday' | 'night';
  threshold: number; // heures avant déclenchement
  multiplier: number; // 1.5 pour 150%
  maxHours?: number;
  requiresApproval: boolean;
}

export interface OvertimeEntry {
  id: string;
  employeeId: string;
  date: Date;
  hours: number;
  multiplier: number;
  reason: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  payrollId?: string;
}

export interface TimeOffPolicy {
  id: string;
  name: string;
  type: 'annual' | 'sick' | 'maternity' | 'paternity' | 'personal' | 'bereavement';
  accrualRate: number; // jours par mois
  maxAccrual: number;
  maxCarryOver: number;
  requiresApproval: boolean;
  advanceNoticeRequired: number; // jours
  blockoutPeriods: DateRange[];
  eligibilityRules: string[];
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
  description?: string;
}

export interface ShiftPattern {
  id: string;
  name: string;
  description: string;
  shifts: Shift[];
  rotationPeriod: number; // en jours
  employees: string[];
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  color: string;
  isNightShift: boolean;
  overtimeMultiplier?: number;
}

// === NOTIFICATIONS AVANCÉES ===
export interface NotificationTemplate {
  id: string;
  type: string;
  title: string;
  message: string;
  variables: string[];
  channels: ('in_app' | 'email' | 'sms')[];
  isActive: boolean;
}

export interface NotificationSettings {
  userId: string;
  types: Record<string, boolean>;
  channels: Record<string, boolean>;
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  quietHours?: {
    start: string;
    end: string;
  };
}

// === ANALYTICS ET RAPPORTS ===
export interface KPI {
  id: string;
  name: string;
  value: number;
  target?: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  period: string;
  category: 'hr' | 'finance' | 'operations' | 'performance';
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'payroll' | 'attendance' | 'performance' | 'budget' | 'custom';
  parameters: ReportParameter[];
  schedule?: ReportSchedule;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  isActive: boolean;
}

export interface ReportParameter {
  name: string;
  type: 'date' | 'employee' | 'department' | 'number' | 'text';
  required: boolean;
  defaultValue?: string | number | boolean;
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  isActive: boolean;
}
