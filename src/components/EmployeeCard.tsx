import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Employee } from '../types';

interface EmployeeCardProps {
  employee: Employee;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employeeId: string) => void;
}

export default function EmployeeCard({ employee, onEdit, onDelete }: EmployeeCardProps) {
  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'on_leave':
        return 'En congé';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="h-16 w-16 bg-ena-blue rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
          </div>
        </div>

        {/* Employee Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {employee.firstName} {employee.lastName}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
              {getStatusText(employee.status)}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-1">{employee.position}</p>
          <p className="text-sm text-ena-blue mb-2">{employee.department}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
            <div>
              <span className="font-medium">Email : </span>
              <a href={`mailto:${employee.email}`} className="text-ena-blue hover:underline">
                {employee.email}
              </a>
            </div>
            <div>
              <span className="font-medium">Téléphone : </span>
              {employee.phone}
            </div>
            <div>
              <span className="font-medium">Embauché le : </span>
              {format(employee.hireDate, 'dd MMMM yyyy', { locale: fr })}
            </div>
            <div>
              <span className="font-medium">Salaire : </span>
              {employee.salary.toLocaleString('fr-CD')} CDF
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {(onEdit || onDelete) && (
        <div className="mt-4 flex justify-end space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(employee)}
              className="btn-secondary text-sm"
            >
              Modifier
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(employee.id)}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-lg text-sm transition-colors duration-200"
            >
              Supprimer
            </button>
          )}
        </div>
      )}
    </div>
  );
}
