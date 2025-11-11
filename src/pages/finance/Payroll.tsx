import React, { useState } from 'react';
import { 
  BanknotesIcon, 
  DocumentArrowDownIcon, 
  FunnelIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PlusIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { mockPayrolls, mockEmployees, mockPayrollPeriods, mockBudgets } from '../../data/mockData';
import type { Payroll, PayrollPeriod } from '../../types';
import BudgetDashboard from '../../components/BudgetDashboard';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '../../hooks/useToast';

const PayrollPage: React.FC = () => {
  const [payrolls] = useState<Payroll[]>(mockPayrolls);
  const [payrollPeriods] = useState<PayrollPeriod[]>(mockPayrollPeriods);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(mockPayrollPeriods[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'payroll' | 'periods' | 'budgets'>('payroll');
  const { showToast } = useToast();

  const getEmployeeName = (employeeId: string) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Inconnu';
  };

  const getStatusColor = (status: Payroll['status'] | PayrollPeriod['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'processed':
      case 'calculated':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-purple-100 text-purple-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Payroll['status'] | PayrollPeriod['status']) => {
    switch (status) {
      case 'paid':
        return 'Payé';
      case 'processed':
        return 'Traité';
      case 'calculated':
        return 'Calculé';
      case 'approved':
        return 'Approuvé';
      case 'draft':
        return 'Brouillon';
      case 'closed':
        return 'Fermé';
      default:
        return 'Inconnu';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredPayrolls = payrolls.filter(payroll => {
    const employeeName = getEmployeeName(payroll.employeeId).toLowerCase();
    return employeeName.includes(searchTerm.toLowerCase());
  });

  const totalGrossSalary = filteredPayrolls.reduce((sum, p) => sum + p.baseSalary + p.bonuses, 0);
  const totalNetSalary = filteredPayrolls.reduce((sum, p) => sum + p.netSalary, 0);
  const totalTaxes = filteredPayrolls.reduce((sum, p) => sum + p.taxes, 0);

  const currentPeriod = payrollPeriods.find(p => p.id === selectedPeriod);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div 
        className="rounded-lg p-6 text-white"
        style={{
          background: 'linear-gradient(to right, #1c3d8f, #1a3580)'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <BanknotesIcon className="h-8 w-8 mr-3" />
              Gestion de la Paie
            </h1>
            <p className="text-blue-100">
              Administration complète des salaires et rémunérations
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {payrollPeriods.map(period => (
                <option key={period.id} value={period.id}>
                  {format(new Date(period.startDate), 'MMMM yyyy', { locale: fr })}
                </option>
              ))}
            </select>
            <button className="bg-white text-blue-900 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors flex items-center">
              <PlusIcon className="h-4 w-4 mr-2" />
              Nouvelle Paie
            </button>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'payroll', label: 'Bulletins de Paie', icon: BanknotesIcon },
            { key: 'periods', label: 'Périodes', icon: CalendarIcon },
            { key: 'budgets', label: 'Budgets', icon: ChartBarIcon }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as 'payroll' | 'periods' | 'budgets')}
              className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className={`mr-2 h-5 w-5 ${
                activeTab === key ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === 'payroll' && (
        <>
          {/* Statistiques de la paie */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserGroupIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Employés
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {filteredPayrolls.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CurrencyDollarIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Brut
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {formatCurrency(totalGrossSalary)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BanknotesIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Net
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {formatCurrency(totalNetSalary)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DocumentArrowDownIcon className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Charges
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {formatCurrency(totalTaxes)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtres et actions */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un employé..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filtrer
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Exporter
              </button>
            </div>
          </div>

          {/* Liste des bulletins de paie */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Bulletins de Paie - {currentPeriod ? format(new Date(currentPeriod.startDate), 'MMMM yyyy', { locale: fr }) : 'Période courante'}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Liste des bulletins de paie pour la période sélectionnée
              </p>
            </div>
            <ul className="divide-y divide-gray-200">
              {filteredPayrolls.map((payroll) => (
                <li key={payroll.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {getEmployeeName(payroll.employeeId)}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payroll.status)}`}
                            >
                              {getStatusText(payroll.status)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Salaire de base:</span>
                            <div className="text-gray-900">{formatCurrency(payroll.baseSalary)}</div>
                          </div>
                          <div>
                            <span className="font-medium">Primes:</span>
                            <div className="text-gray-900">{formatCurrency(payroll.bonuses)}</div>
                          </div>
                          <div>
                            <span className="font-medium">Déductions:</span>
                            <div className="text-gray-900">{formatCurrency(payroll.deductions)}</div>
                          </div>
                          <div>
                            <span className="font-medium">Net à payer:</span>
                            <div className="text-lg font-semibold text-green-600">{formatCurrency(payroll.netSalary)}</div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          title="Voir le détail"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="text-blue-400 hover:text-blue-600"
                          title="Télécharger PDF"
                        >
                          <DocumentArrowDownIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {activeTab === 'periods' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Périodes de Paie
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Gestion des périodes de calcul et de paiement
            </p>
          </div>
          <ul className="divide-y divide-gray-200">
            {payrollPeriods.map((period) => (
              <li key={period.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">
                        {format(new Date(period.startDate), 'MMMM yyyy', { locale: fr })}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {format(new Date(period.startDate), 'dd/MM/yyyy', { locale: fr })} - 
                        {format(new Date(period.endDate), 'dd/MM/yyyy', { locale: fr })}
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-500">Total Brut:</span>
                          <div className="text-gray-900">{formatCurrency(period.totalGross)}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Total Net:</span>
                          <div className="text-gray-900">{formatCurrency(period.totalNet)}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Charges:</span>
                          <div className="text-gray-900">{formatCurrency(period.totalTaxes)}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Employés:</span>
                          <div className="text-gray-900">{period.employeeCount}</div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(period.status)}`}
                      >
                        {getStatusText(period.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'budgets' && (
        <BudgetDashboard 
          budgets={mockBudgets}
          onCreateBudget={() => showToast('success', 'Nouveau budget créé')}
          onEditBudget={(_budget) => showToast('success', 'Budget modifié')}
          onViewDetails={(_budget) => showToast('info', 'Détails du budget affichés')}
        />
      )}
    </div>
  );
};

export default PayrollPage;
