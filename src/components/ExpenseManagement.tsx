import React, { useState } from 'react';
import {
  DocumentTextIcon,
  PlusIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { mockExpenseReports, mockEmployees } from '../data/mockData';
import type { ExpenseReport } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ExpenseManagement: React.FC = () => {
  const [expenseReports] = useState<ExpenseReport[]>(mockExpenseReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<ExpenseReport | null>(null);

  const getEmployeeName = (employeeId: string) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Inconnu';
  };

  const formatCurrency = (amount: number, currency: string = 'CDF') => {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: ExpenseReport['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ExpenseReport['status']) => {
    switch (status) {
      case 'approved':
        return 'Approuvé';
      case 'rejected':
        return 'Rejeté';
      case 'submitted':
        return 'Soumis';
      case 'paid':
        return 'Payé';
      case 'draft':
        return 'Brouillon';
      default:
        return status;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'travel':
        return 'bg-blue-100 text-blue-800';
      case 'meals':
        return 'bg-green-100 text-green-800';
      case 'transport':
        return 'bg-purple-100 text-purple-800';
      case 'supplies':
        return 'bg-yellow-100 text-yellow-800';
      case 'training':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'travel':
        return 'Voyage';
      case 'meals':
        return 'Repas';
      case 'transport':
        return 'Transport';
      case 'supplies':
        return 'Fournitures';
      case 'training':
        return 'Formation';
      default:
        return category;
    }
  };

  const filteredReports = expenseReports.filter(report => {
    const matchesSearch = searchTerm === '' ||
      getEmployeeName(report.employeeId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || report.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalAmount = filteredReports.reduce((sum, report) => sum + report.totalAmount, 0);
  const pendingCount = filteredReports.filter(report => report.status === 'submitted').length;
  const approvedCount = filteredReports.filter(report => report.status === 'approved').length;

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
              <DocumentTextIcon className="h-8 w-8 mr-3" />
              Gestion des Notes de Frais
            </h1>
            <p className="text-blue-100">
              Suivi et validation des dépenses professionnelles
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-white text-blue-900 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors flex items-center">
              <PlusIcon className="h-4 w-4 mr-2" />
              Nouvelle Note de Frais
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Montant Total
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(totalAmount)}
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
                <CalendarIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    En Attente
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {pendingCount}
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
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Approuvées
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {approvedCount}
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
                <UserIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Rapports
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {filteredReports.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher par employé ou titre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="draft">Brouillon</option>
            <option value="submitted">Soumis</option>
            <option value="approved">Approuvé</option>
            <option value="rejected">Rejeté</option>
            <option value="paid">Payé</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes les catégories</option>
            <option value="travel">Voyage</option>
            <option value="meals">Repas</option>
            <option value="transport">Transport</option>
            <option value="supplies">Fournitures</option>
            <option value="training">Formation</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Liste des notes de frais */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Notes de Frais
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Liste des demandes de remboursement
          </p>
        </div>
        <ul className="divide-y divide-gray-200">
          {filteredReports.map((report) => (
            <li key={report.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {report.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}
                        >
                          {getStatusText(report.status)}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(report.category)}`}
                        >
                          {getCategoryText(report.category)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Employé:</span>
                        <div className="text-gray-900">{getEmployeeName(report.employeeId)}</div>
                      </div>
                      <div>
                        <span className="font-medium">Montant:</span>
                        <div className="text-gray-900 font-semibold">
                          {formatCurrency(report.totalAmount, report.currency)}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Date de soumission:</span>
                        <div className="text-gray-900">
                          {format(report.submittedDate, 'dd/MM/yyyy', { locale: fr })}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Nb. éléments:</span>
                        <div className="text-gray-900">{report.expenses.length} élément(s)</div>
                      </div>
                    </div>
                    
                    {/* Description */}
                    {report.description && (
                      <div className="mt-2 text-sm text-gray-600">
                        {report.description}
                      </div>
                    )}

                    {/* Détail des dépenses (aperçu) */}
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {report.expenses.slice(0, 3).map((expense, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {expense.description}: {formatCurrency(expense.amount, report.currency)}
                          </span>
                        ))}
                        {report.expenses.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                            +{report.expenses.length - 3} autre(s)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Voir le détail"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    {report.status === 'submitted' && (
                      <>
                        <button
                          className="text-green-600 hover:text-green-800"
                          title="Approuver"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          title="Rejeter"
                        >
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal de détail */}
      {selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedReport.title}
              </h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Informations générales */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-500">Employé:</span>
                  <div className="text-gray-900">{getEmployeeName(selectedReport.employeeId)}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Statut:</span>
                  <span
                    className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}
                  >
                    {getStatusText(selectedReport.status)}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Catégorie:</span>
                  <span
                    className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(selectedReport.category)}`}
                  >
                    {getCategoryText(selectedReport.category)}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Montant total:</span>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(selectedReport.totalAmount, selectedReport.currency)}
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedReport.description && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description:</h4>
                  <p className="text-gray-700">{selectedReport.description}</p>
                </div>
              )}

              {/* Détail des dépenses */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Détail des dépenses:</h4>
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Remboursable
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedReport.expenses.map((expense, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {format(expense.date, 'dd/MM/yyyy', { locale: fr })}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {expense.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(expense.amount, selectedReport.currency)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {expense.isReimbursable ? (
                              <CheckCircleIcon className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircleIcon className="h-5 w-5 text-red-500" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions */}
              {selectedReport.status === 'submitted' && (
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Approuver
                  </button>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    <XCircleIcon className="h-4 w-4 mr-2" />
                    Rejeter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManagement;
