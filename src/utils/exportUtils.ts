import { mockEmployees, mockAbsences, mockTrainings } from '../data/mockData';

interface ExportData {
  employees: typeof mockEmployees;
  absences: typeof mockAbsences;
  trainings: typeof mockTrainings;
  metadata: {
    exportDate: string;
    totalEmployees: number;
    totalAbsences: number;
    totalTrainings: number;
  };
}

export function generateStatisticsReport(): ExportData {
  return {
    employees: mockEmployees,
    absences: mockAbsences,
    trainings: mockTrainings,
    metadata: {
      exportDate: new Date().toISOString(),
      totalEmployees: mockEmployees.length,
      totalAbsences: mockAbsences.length,
      totalTrainings: mockTrainings.length
    }
  };
}

export function exportToJSON(data: ExportData, filename = 'statistiques_rh'): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export function exportToCSV(data: ExportData, filename = 'statistiques_rh'): void {
  // Export des employés
  const employeeHeaders = ['Prénom', 'Nom', 'Email', 'Poste', 'Département', 'Salaire', 'Statut'];
  const employeeRows = data.employees.map(emp => [
    emp.firstName,
    emp.lastName,
    emp.email,
    emp.position,
    emp.department,
    emp.salary.toString(),
    emp.status
  ]);

  const csvContent = [
    employeeHeaders.join(','),
    ...employeeRows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_employes_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export function downloadStatisticsReport(format: 'json' | 'csv' = 'json'): void {
  const data = generateStatisticsReport();
  
  if (format === 'json') {
    exportToJSON(data);
  } else {
    exportToCSV(data);
  }
}
