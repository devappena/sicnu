import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import { mockDepartments, mockEmployees } from '../../data/mockData';

export default function Organization() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Organigramme"
        description="Structure des départements et rattachement du personnel"
        icon={BuildingOfficeIcon}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockDepartments.map((department) => {
          const members = mockEmployees.filter((employee) => employee.department === department.name);
          return (
            <Card key={department.id}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                  <p className="text-sm text-gray-500">{department.description}</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {members.length || department.employeeCount} pers.
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                <strong>Responsable :</strong> {department.headOfDepartment}
              </p>
              <div className="space-y-2">
                {members.length === 0 && (
                  <p className="text-sm text-gray-500">Aucun agent listé dans les données actuelles.</p>
                )}
                {members.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{employee.position}</p>
                    </div>
                    <span className="text-xs text-gray-500">{employee.status === 'active' ? 'Actif' : employee.status}</span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
