import { useState } from 'react';
import { ReceiptPercentIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import { useToast } from '../../hooks/useToast';
import { mockEmployees, mockExpenseReports } from '../../data/mockData';
import type { ExpenseReport } from '../../types';

const STATUS_LABEL: Record<ExpenseReport['status'], string> = {
  draft: 'Brouillon',
  submitted: 'Soumise',
  approved: 'Approuvée',
  rejected: 'Refusée',
  paid: 'Remboursée',
};

export default function Expenses() {
  const { showToast } = useToast();
  const [reports, setReports] = useState(mockExpenseReports);

  const approve = (id: string) => {
    setReports((prev) =>
      prev.map((report) => (report.id === id ? { ...report, status: 'approved' } : report)),
    );
    showToast('success', 'Note de frais approuvée');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notes de frais"
        description="Missions, déplacements et remboursements du personnel"
        icon={ReceiptPercentIcon}
      />

      {reports.map((report) => {
        const employee = mockEmployees.find((item) => item.id === report.employeeId);
        return (
          <Card key={report.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                <p className="text-sm text-gray-500">
                  {employee ? `${employee.firstName} ${employee.lastName}` : 'Agent'} ·{' '}
                  {format(report.submittedDate, 'dd MMM yyyy', { locale: fr })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">
                  {report.totalAmount.toLocaleString('fr-FR')} {report.currency}
                </p>
                <span className="text-xs text-gray-600">{STATUS_LABEL[report.status]}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">{report.description}</p>
            <ul className="mt-4 space-y-2">
              {report.expenses.map((expense) => (
                <li key={expense.id} className="flex justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                  <span>{expense.description}</span>
                  <span className="font-medium">{expense.amount.toLocaleString('fr-FR')} CDF</span>
                </li>
              ))}
            </ul>
            {report.status === 'submitted' && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => approve(report.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Approuver
                </button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
