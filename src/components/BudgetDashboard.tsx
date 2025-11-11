import React, { useState } from 'react';
import {
  BanknotesIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import type { Budget } from '../types';

interface BudgetDashboardProps {
  budgets: Budget[];
  onCreateBudget?: () => void;
  onEditBudget?: (budget: Budget) => void;
  onViewDetails?: (budget: Budget) => void;
}

const BudgetDashboard: React.FC<BudgetDashboardProps> = ({
  budgets,
  onCreateBudget,
  onEditBudget,
  onViewDetails
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getUtilizationRate = (budget: Budget) => {
    return ((budget.spent + budget.committed) / budget.totalBudget) * 100;
  };

  const getUtilizationColor = (rate: number) => {
    if (rate >= 90) return 'text-red-600 bg-red-100';
    if (rate >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getStatusColor = (status: Budget['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'approved':
        return 'text-blue-600 bg-blue-100';
      case 'draft':
        return 'text-gray-600 bg-gray-100';
      case 'closed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: Budget['status']) => {
    switch (status) {
      case 'active':
        return 'Actif';
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

  const filteredBudgets = budgets.filter(
    budget => selectedDepartment === 'all' || budget.department === selectedDepartment
  );

  const departments = Array.from(new Set(budgets.map(b => b.department)));

  const totalBudget = filteredBudgets.reduce((sum, b) => sum + b.totalBudget, 0);
  const totalSpent = filteredBudgets.reduce((sum, b) => sum + b.spent, 0);
  const totalCommitted = filteredBudgets.reduce((sum, b) => sum + b.committed, 0);
  const totalAvailable = filteredBudgets.reduce((sum, b) => sum + b.available, 0);

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
              Gestion des Budgets
            </h1>
            <p className="text-blue-100">
              Suivi et contrôle des budgets départementaux
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les départements</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {onCreateBudget && (
              <button
                onClick={onCreateBudget}
                className="bg-white text-blue-900 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Nouveau Budget
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Budget Total
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(totalBudget)}
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
                <BanknotesIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Dépensé
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(totalSpent)}
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
                <DocumentChartBarIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Engagé
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(totalCommitted)}
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
                <ChartBarIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Disponible
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(totalAvailable)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des budgets */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Budgets par Département
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Vue d'ensemble de l'utilisation des budgets
          </p>
        </div>
        <ul className="divide-y divide-gray-200">
          {filteredBudgets.map((budget) => {
            const utilizationRate = getUtilizationRate(budget);
            const isOverBudget = utilizationRate > 100;
            const isNearLimit = utilizationRate > 80;

            return (
              <li key={budget.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 flex items-center">
                            {budget.name}
                            {(isOverBudget || isNearLimit) && (
                              <ExclamationTriangleIcon 
                                className={`h-5 w-5 ml-2 ${isOverBudget ? 'text-red-500' : 'text-yellow-500'}`}
                              />
                            )}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {budget.department} • Exercice {budget.fiscalYear}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(budget.status)}`}
                          >
                            {getStatusText(budget.status)}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUtilizationColor(utilizationRate)}`}
                          >
                            {utilizationRate.toFixed(1)}% utilisé
                          </span>
                        </div>
                      </div>

                      {/* Barre de progression */}
                      <div className="mt-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Utilisation: {formatCurrency(budget.spent + budget.committed)}</span>
                          <span>Budget: {formatCurrency(budget.totalBudget)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              isOverBudget
                                ? 'bg-red-500'
                                : isNearLimit
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                            style={{
                              width: `${Math.min(utilizationRate, 100)}%`
                            }}
                          />
                          {isOverBudget && (
                            <div
                              className="h-2 bg-red-600 rounded-full"
                              style={{
                                width: `${utilizationRate - 100}%`,
                                marginTop: '-8px'
                              }}
                            />
                          )}
                        </div>
                      </div>

                      {/* Détails financiers */}
                      <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-500">Dépensé:</span>
                          <div className="text-gray-900">{formatCurrency(budget.spent)}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Engagé:</span>
                          <div className="text-gray-900">{formatCurrency(budget.committed)}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Disponible:</span>
                          <div className="text-gray-900">{formatCurrency(budget.available)}</div>
                        </div>
                      </div>

                      {/* Catégories */}
                      {budget.categories.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Catégories:</h5>
                          <div className="flex flex-wrap gap-2">
                            {budget.categories.map((category) => (
                              <span
                                key={category.id}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {category.name}: {formatCurrency(category.spentAmount)} / {formatCurrency(category.allocatedAmount)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      {onViewDetails && (
                        <button
                          onClick={() => onViewDetails(budget)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Voir les détails"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      )}
                      {onEditBudget && (
                        <button
                          onClick={() => onEditBudget(budget)}
                          className="text-indigo-400 hover:text-indigo-600"
                          title="Modifier"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default BudgetDashboard;
