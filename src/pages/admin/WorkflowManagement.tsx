import React, { useState } from 'react';
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { mockApprovalWorkflows, mockApprovalRules, mockEmployees } from '../../data/mockData';
import type { ApprovalWorkflow, ApprovalRule } from '../../types';
import ApprovalWorkflowViewer from '../../components/ApprovalWorkflowViewer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '../../hooks/useToast';

const WorkflowManagement: React.FC = () => {
  const [workflows] = useState<ApprovalWorkflow[]>(mockApprovalWorkflows);
  const [rules] = useState<ApprovalRule[]>(mockApprovalRules);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ApprovalWorkflow | null>(null);
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'workflows' | 'rules'>('workflows');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getEmployeeName = (employeeId: string) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Inconnu';
  };

  const getWorkflowTypeText = (type: string) => {
    switch (type) {
      case 'absence':
        return 'Demande d\'absence';
      case 'training':
        return 'Formation';
      case 'expense':
        return 'Note de frais';
      case 'overtime':
        return 'Heures supplémentaires';
      case 'budget_request':
        return 'Demande budgétaire';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvé';
      case 'rejected':
        return 'Rejeté';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesStatus = filterStatus === 'all' || workflow.status === filterStatus;
    const matchesType = filterType === 'all' || workflow.type === filterType;
    const matchesSearch = searchTerm === '' || 
      getEmployeeName(workflow.requesterId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.requestId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  const pendingWorkflows = workflows.filter(w => w.status === 'pending').length;
  const approvedWorkflows = workflows.filter(w => w.status === 'approved').length;
  const rejectedWorkflows = workflows.filter(w => w.status === 'rejected').length;

  const handleApprove = (stepIndex: number, comments: string) => {
    if (selectedWorkflow) {
      showToast('success', `Étape ${stepIndex + 1} approuvée`, comments);
      // Ici, on mettrait à jour le workflow
    }
  };

  const handleReject = (stepIndex: number, comments: string) => {
    if (selectedWorkflow) {
      showToast('warning', `Étape ${stepIndex + 1} rejetée`, comments);
      // Ici, on mettrait à jour le workflow
    }
  };

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
              Workflow d'Approbation
            </h1>
            <p className="text-blue-100">
              Gestion centralisée des processus d'approbation
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-white text-blue-900 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors flex items-center">
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Nouvelle Règle
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
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    En Attente
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {pendingWorkflows}
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
                    Approuvés
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {approvedWorkflows}
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
                <XCircleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Rejetés
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {rejectedWorkflows}
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
                <ChartBarIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Règles Actives
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {rules.filter(r => r.isActive).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'workflows', label: 'Workflows', icon: DocumentTextIcon },
            { key: 'rules', label: 'Règles', icon: UserGroupIcon }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as 'workflows' | 'rules')}
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

      {activeTab === 'workflows' && (
        <>
          {/* Filtres */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher..."
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
                <option value="pending">En attente</option>
                <option value="approved">Approuvé</option>
                <option value="rejected">Rejeté</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les types</option>
                <option value="absence">Absences</option>
                <option value="training">Formations</option>
                <option value="expense">Notes de frais</option>
                <option value="overtime">Heures supplémentaires</option>
              </select>
            </div>
          </div>

          {/* Liste des workflows */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Workflows d'Approbation
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Liste des demandes en cours de traitement
              </p>
            </div>
            <ul className="divide-y divide-gray-200">
              {filteredWorkflows.map((workflow) => (
                <li key={workflow.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {getWorkflowTypeText(workflow.type)} - {workflow.requestId}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}
                            >
                              {getStatusText(workflow.status)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Demandeur:</span>
                            <div className="text-gray-900">{getEmployeeName(workflow.requesterId)}</div>
                          </div>
                          <div>
                            <span className="font-medium">Étape:</span>
                            <div className="text-gray-900">
                              {workflow.currentStepIndex + 1} / {workflow.steps.length}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Créé le:</span>
                            <div className="text-gray-900">
                              {format(workflow.createdAt, 'dd/MM/yyyy', { locale: fr })}
                            </div>
                          </div>
                        </div>
                        
                        {/* Approbateurs */}
                        <div className="mt-3">
                          <div className="flex items-center space-x-4">
                            {workflow.steps.map((step, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                    step.status === 'approved'
                                      ? 'bg-green-100 text-green-800'
                                      : step.status === 'rejected'
                                      ? 'bg-red-100 text-red-800'
                                      : index === workflow.currentStepIndex
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {index + 1}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {step.approverName}
                                </span>
                                {index < workflow.steps.length - 1 && (
                                  <div className="w-4 h-0.5 bg-gray-300"></div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          onClick={() => setSelectedWorkflow(workflow)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Voir détails
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

      {activeTab === 'rules' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Règles d'Approbation
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Configuration des processus d'approbation automatiques
            </p>
          </div>
          <ul className="divide-y divide-gray-200">
            {rules.map((rule) => (
              <li key={rule.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        Règle {getWorkflowTypeText(rule.type)}
                      </h4>
                      <div className="mt-2 text-sm text-gray-600">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium">Étapes:</span>
                            <div className="text-gray-900">{rule.steps.length} niveaux</div>
                          </div>
                          <div>
                            <span className="font-medium">Statut:</span>
                            <span
                              className={`ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                rule.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {rule.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Conditions */}
                        {rule.conditions.length > 0 && (
                          <div className="mt-2">
                            <span className="font-medium">Conditions:</span>
                            <div className="mt-1">
                              {rule.conditions.map((condition, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 mr-2"
                                >
                                  {condition.field} {condition.operator} {
                                    condition.value instanceof Date 
                                      ? condition.value.toLocaleDateString('fr-FR')
                                      : String(condition.value)
                                  }
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal de détail du workflow */}
      {selectedWorkflow && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Détail du Workflow
              </h3>
              <button
                onClick={() => setSelectedWorkflow(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            <ApprovalWorkflowViewer
              workflow={selectedWorkflow}
              onApprove={handleApprove}
              onReject={handleReject}
              canTakeAction={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowManagement;
