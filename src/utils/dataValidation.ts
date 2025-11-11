/**
 * Utilitaires de validation pour les données de l'application ENA RH
 */

import type { Employee, Absence, Training } from '../types';

export class DataValidator {
  /**
   * Valide la structure d'un employé
   */
  static validateEmployee(employee: Employee): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!employee.id) errors.push('ID employé manquant');
    if (!employee.firstName) errors.push('Prénom manquant');
    if (!employee.lastName) errors.push('Nom manquant');
    if (!employee.email) errors.push('Email manquant');
    if (!employee.department) errors.push('Département manquant');
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (employee.email && !emailRegex.test(employee.email)) {
      errors.push('Format email invalide');
    }

    // Validation statut
    const validStatuses = ['active', 'inactive', 'on_leave'];
    if (!validStatuses.includes(employee.status)) {
      errors.push('Statut employé invalide');
    }

    // Validation salaire
    if (employee.salary < 100000 || employee.salary > 10000000) {
      errors.push('Salaire hors des limites acceptables');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide la structure d'une absence
   */
  static validateAbsence(absence: Absence): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!absence.id) errors.push('ID absence manquant');
    if (!absence.employeeId) errors.push('ID employé manquant');
    if (!absence.startDate) errors.push('Date de début manquante');
    if (!absence.endDate) errors.push('Date de fin manquante');

    // Validation type d'absence
    const validTypes = ['vacation', 'sick', 'personal', 'maternity', 'paternity'];
    if (!validTypes.includes(absence.type)) {
      errors.push('Type d\'absence invalide');
    }

    // Validation statut
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(absence.status)) {
      errors.push('Statut absence invalide');
    }

    // Validation dates
    if (absence.startDate && absence.endDate) {
      const startDate = new Date(absence.startDate);
      const endDate = new Date(absence.endDate);
      
      if (startDate > endDate) {
        errors.push('Date de début postérieure à la date de fin');
      }

      // Vérifier que l'absence n'est pas trop longue (max 1 an)
      const diffDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays > 365) {
        errors.push('Durée d\'absence trop longue (max 1 an)');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide la structure d'une formation
   */
  static validateTraining(training: Training): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!training.id) errors.push('ID formation manquant');
    if (!training.title) errors.push('Titre formation manquant');
    if (!training.startDate) errors.push('Date de début manquante');
    if (!training.endDate) errors.push('Date de fin manquante');
    if (training.capacity <= 0) errors.push('Capacité invalide');

    // Validation dates
    if (training.startDate && training.endDate) {
      const startDate = new Date(training.startDate);
      const endDate = new Date(training.endDate);
      
      if (startDate > endDate) {
        errors.push('Date de début postérieure à la date de fin');
      }

      // Vérifier durée raisonnable (max 6 mois)
      const diffDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays > 180) {
        errors.push('Durée de formation trop longue (max 6 mois)');
      }
    }

    // Validation inscriptions
    if (training.enrolledEmployees.length > training.capacity) {
      errors.push('Nombre d\'inscrits dépasse la capacité');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide l'intégrité référentielle
   */
  static validateReferentialIntegrity(
    employees: Employee[],
    absences: Absence[],
    trainings: Training[]
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const employeeIds = new Set(employees.map(emp => emp.id));

    // Vérifier que toutes les absences référencent des employés existants
    absences.forEach(absence => {
      if (!employeeIds.has(absence.employeeId)) {
        errors.push(`Absence ${absence.id} référence un employé inexistant: ${absence.employeeId}`);
      }
    });

    // Vérifier que toutes les inscriptions aux formations référencent des employés existants
    trainings.forEach(training => {
      training.enrolledEmployees.forEach(employeeId => {
        if (!employeeIds.has(employeeId)) {
          errors.push(`Formation ${training.title} référence un employé inexistant: ${employeeId}`);
        }
      });
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide toutes les données de l'application
   */
  static validateAllData(
    employees: Employee[],
    absences: Absence[],
    trainings: Training[]
  ): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validation individuelle des employés
    employees.forEach(employee => {
      const validation = this.validateEmployee(employee);
      if (!validation.isValid) {
        errors.push(`Employé ${employee.firstName} ${employee.lastName}: ${validation.errors.join(', ')}`);
      }
    });

    // Validation individuelle des absences
    absences.forEach(absence => {
      const validation = this.validateAbsence(absence);
      if (!validation.isValid) {
        errors.push(`Absence ${absence.id}: ${validation.errors.join(', ')}`);
      }
    });

    // Validation individuelle des formations
    trainings.forEach(training => {
      const validation = this.validateTraining(training);
      if (!validation.isValid) {
        errors.push(`Formation ${training.title}: ${validation.errors.join(', ')}`);
      }
    });

    // Validation de l'intégrité référentielle
    const integrityValidation = this.validateReferentialIntegrity(employees, absences, trainings);
    if (!integrityValidation.isValid) {
      errors.push(...integrityValidation.errors);
    }

    // Avertissements pour les statistiques
    const departments = [...new Set(employees.map(emp => emp.department))];
    if (departments.length < 3) {
      warnings.push('Moins de 3 départements détectés');
    }

    const activeEmployees = employees.filter(emp => emp.status === 'active');
    if (activeEmployees.length === 0) {
      warnings.push('Aucun employé actif');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

/**
 * Fonctions utilitaires pour les calculs métier
 */
export class BusinessCalculator {
  /**
   * Calcule les statistiques RH
   */
  static calculateHRStats(employees: Employee[], absences: Absence[], trainings: Training[]) {
    const activeEmployees = employees.filter(emp => emp.status === 'active');
    const pendingAbsences = absences.filter(abs => abs.status === 'pending');
    const upcomingTrainings = trainings.filter(training => {
      const startDate = new Date(training.startDate);
      const now = new Date();
      return startDate > now;
    });

    const totalSalaries = activeEmployees.reduce((sum, emp) => sum + emp.salary, 0);
    const averageSalary = activeEmployees.length > 0 ? totalSalaries / activeEmployees.length : 0;

    const departmentStats = this.calculateDepartmentStats(employees);

    return {
      totalEmployees: employees.length,
      activeEmployees: activeEmployees.length,
      pendingAbsences: pendingAbsences.length,
      upcomingTrainings: upcomingTrainings.length,
      totalSalaries,
      averageSalary,
      departmentStats
    };
  }

  /**
   * Calcule les statistiques par département
   */
  static calculateDepartmentStats(employees: Employee[]) {
    const departments = [...new Set(employees.map(emp => emp.department))];
    
    return departments.map(dept => {
      const deptEmployees = employees.filter(emp => emp.department === dept);
      const activeEmployees = deptEmployees.filter(emp => emp.status === 'active');
      const totalSalaries = deptEmployees.reduce((sum, emp) => sum + emp.salary, 0);
      
      return {
        name: dept,
        totalEmployees: deptEmployees.length,
        activeEmployees: activeEmployees.length,
        totalSalaries,
        averageSalary: deptEmployees.length > 0 ? totalSalaries / deptEmployees.length : 0
      };
    });
  }

  /**
   * Calcule le taux d'absentéisme
   */
  static calculateAbsenteeismRate(employees: Employee[], absences: Absence[], period: Date[] = []) {
    const activeEmployees = employees.filter(emp => emp.status === 'active');
    if (activeEmployees.length === 0) return 0;

    let relevantAbsences = absences.filter(abs => abs.status === 'approved');
    
    // Filtrer par période si fournie
    if (period.length === 2) {
      const [startPeriod, endPeriod] = period;
      relevantAbsences = relevantAbsences.filter(abs => {
        const absStart = new Date(abs.startDate);
        const absEnd = new Date(abs.endDate);
        return (absStart >= startPeriod && absStart <= endPeriod) ||
               (absEnd >= startPeriod && absEnd <= endPeriod);
      });
    }

    // Calculer les jours d'absence total
    const totalAbsenceDays = relevantAbsences.reduce((sum, abs) => {
      const startDate = new Date(abs.startDate);
      const endDate = new Date(abs.endDate);
      const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return sum + diffDays;
    }, 0);

    // Jours ouvrables dans la période (estimation: 252 jours/an)
    const workingDaysPerYear = 252;
    const expectedWorkingDays = activeEmployees.length * workingDaysPerYear;

    return (totalAbsenceDays / expectedWorkingDays) * 100;
  }
}

export default { DataValidator, BusinessCalculator };
