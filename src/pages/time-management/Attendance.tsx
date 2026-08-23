import { useMemo, useState } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { mockAttendance } from '../../data/hrModules';
import { mockEmployees } from '../../data/mockData';

const STATUS_LABEL: Record<string, string> = {
  present: 'Présent',
  late: 'Retard',
  absent: 'Absent',
  remote: 'Télétravail',
};

const STATUS_CLASS: Record<string, string> = {
  present: 'bg-green-100 text-green-700',
  late: 'bg-yellow-100 text-yellow-800',
  absent: 'bg-red-100 text-red-700',
  remote: 'bg-blue-100 text-blue-700',
};

export default function Attendance() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [records, setRecords] = useState(mockAttendance);
  const today = format(new Date(), 'yyyy-MM-dd');

  const myRecord = records.find((item) => item.employeeId === user?.id && item.date === today);

  const clockIn = () => {
    const now = format(new Date(), 'HH:mm');
    setRecords((prev) => {
      const existing = prev.find((item) => item.employeeId === (user?.id || '1') && item.date === today);
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id ? { ...item, clockIn: now, status: 'present' } : item,
        );
      }
      return [
        {
          id: `att-${Date.now()}`,
          employeeId: user?.id || '1',
          date: today,
          clockIn: now,
          clockOut: null,
          status: 'present',
          hours: 0,
        },
        ...prev,
      ];
    });
    showToast('success', `Arrivée enregistrée à ${now}`);
  };

  const clockOut = () => {
    const now = format(new Date(), 'HH:mm');
    setRecords((prev) =>
      prev.map((item) =>
        item.employeeId === (user?.id || '1') && item.date === today
          ? { ...item, clockOut: now }
          : item,
      ),
    );
    showToast('success', `Départ enregistré à ${now}`);
  };

  const presentCount = useMemo(
    () => records.filter((item) => item.date === today && item.status !== 'absent').length,
    [records, today],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Présences & pointage"
        description="Suivi quotidien des arrivées, départs et retards"
        icon={ClockIcon}
      >
        <div className="flex gap-2">
          <button
            type="button"
            onClick={clockIn}
            className="bg-white text-cnu-blue-700 px-4 py-2 rounded-lg text-sm font-medium"
          >
            Pointer l'arrivée
          </button>
          <button
            type="button"
            onClick={clockOut}
            className="bg-white/15 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Pointer le départ
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-gray-500">Présents aujourd'hui</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{presentCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Votre pointage</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            {myRecord?.clockIn ? `${myRecord.clockIn} → ${myRecord.clockOut || 'en cours'}` : 'Pas encore pointé'}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Date</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            {format(new Date(), 'EEEE dd MMMM yyyy', { locale: fr })}
          </p>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Registre du jour</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Employé', 'Arrivée', 'Départ', 'Heures', 'Statut'].map((header) => (
                  <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map((record) => {
                const employee = mockEmployees.find((item) => item.id === record.employeeId);
                return (
                  <tr key={record.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {employee ? `${employee.firstName} ${employee.lastName}` : `Agent ${record.employeeId}`}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{record.clockIn || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{record.clockOut || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{record.hours || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${STATUS_CLASS[record.status]}`}>
                        {STATUS_LABEL[record.status]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
