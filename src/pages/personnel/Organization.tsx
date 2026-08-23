import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useEmployees } from '../../hooks/api';

export default function Organization() {
  const { data: employees, isLoading } = useEmployees();
  const staff = employees || [];
  const departments = [...new Set(staff.map((employee) => employee.department).filter(Boolean))];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organigramme"
        description="Structure des départements et rattachement du personnel"
        icon={BuildingOfficeIcon}
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {departments.map((department) => {
            const members = staff.filter((employee) => employee.department === department);
            const head = members[0];
            return (
              <Card key={department}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{department}</h3>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {members.length} pers.
                  </span>
                </div>
                {head && (
                  <p className="text-sm text-gray-700 mb-4">
                    <strong>Responsable :</strong> {`${head.firstName} ${head.lastName}`.trim()}
                  </p>
                )}
                <div className="space-y-2">
                  {members.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {`${employee.firstName} ${employee.lastName}`.trim()}
                        </p>
                        <p className="text-xs text-gray-500">{employee.position}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {employee.status === 'active' ? 'Actif' : employee.status}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
