import React, { useState } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  // UserIcon, // Commenté car non utilisé
  DocumentTextIcon,
  // ArrowRightIcon, // Commenté car non utilisé
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import type { ApprovalWorkflow, ApprovalStep } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ApprovalWorkflowViewerProps {
  workflow: ApprovalWorkflow;
  onApprove?: (stepIndex: number, comments: string) => void;
  onReject?: (stepIndex: number, comments: string) => void;
  canTakeAction?: boolean;
}

const ApprovalWorkflowViewer: React.FC<ApprovalWorkflowViewerProps> = ({
  workflow,
  onApprove,
  onReject,
  canTakeAction = false
}) => {
  const [actionStepIndex, setActionStepIndex] = useState<number | null>(null);
  const [comments, setComments] = useState('');

  const getStepIcon = (step: ApprovalStep, isCurrentStep: boolean) => {
    if (step.status === 'approved') {
      return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
    }
    if (step.status === 'rejected') {
      return <XCircleIcon className="h-6 w-6 text-red-500" />;
    }
    if (isCurrentStep) {
      return <ExclamationCircleIcon className="h-6 w-6 text-yellow-500" />;
    }
    return <ClockIcon className="h-6 w-6 text-gray-400" />;
  };

  const getStepStatus = (step: ApprovalStep) => {
    switch (step.status) {
      case 'approved':
        return { text: 'Approuvé', color: 'text-green-600 bg-green-100' };
      case 'rejected':
        return { text: 'Rejeté', color: 'text-red-600 bg-red-100' };
      case 'pending':
        return { text: 'En attente', color: 'text-yellow-600 bg-yellow-100' };
      default:
        return { text: 'En attente', color: 'text-gray-600 bg-gray-100' };
    }
  };

  const handleApprove = () => {
    if (actionStepIndex !== null && onApprove) {
      onApprove(actionStepIndex, comments);
      setActionStepIndex(null);
      setComments('');
    }
  };

  const handleReject = () => {
    if (actionStepIndex !== null && onReject) {
      onReject(actionStepIndex, comments);
      setActionStepIndex(null);
      setComments('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Workflow d'Approbation
            </h3>
            <p className="text-sm text-gray-500">
              {workflow.type.charAt(0).toUpperCase() + workflow.type.slice(1)} - {workflow.requestId}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                workflow.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : workflow.status === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {workflow.status === 'approved'
                ? 'Approuvé'
                : workflow.status === 'rejected'
                ? 'Rejeté'
                : 'En cours'}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-6 py-4">
        <div className="flow-root">
          <ul className="-mb-8">
            {workflow.steps.map((step, stepIdx) => {
              const isCurrentStep = stepIdx === workflow.currentStepIndex;
              const isLastStep = stepIdx === workflow.steps.length - 1;
              const status = getStepStatus(step);

              return (
                <li key={stepIdx}>
                  <div className="relative pb-8">
                    {!isLastStep && (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span
                          className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            step.status === 'approved'
                              ? 'bg-green-500'
                              : step.status === 'rejected'
                              ? 'bg-red-500'
                              : isCurrentStep
                              ? 'bg-yellow-500'
                              : 'bg-gray-300'
                          }`}
                        >
                          {getStepIcon(step, isCurrentStep)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {step.approverName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {step.approverRole}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                            >
                              {status.text}
                            </span>
                          </div>
                        </div>

                        {step.actionDate && (
                          <p className="text-xs text-gray-500 mt-1">
                            {format(step.actionDate, 'dd/MM/yyyy à HH:mm', { locale: fr })}
                          </p>
                        )}

                        {step.comments && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-700">{step.comments}</p>
                          </div>
                        )}

                        {/* Actions pour l'étape courante */}
                        {isCurrentStep && canTakeAction && workflow.status === 'pending' && (
                          <div className="mt-3">
                            {actionStepIndex === stepIdx ? (
                              <div className="space-y-3">
                                <textarea
                                  value={comments}
                                  onChange={(e) => setComments(e.target.value)}
                                  placeholder="Commentaires (optionnel)"
                                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                  rows={3}
                                />
                                <div className="flex space-x-2">
                                  <button
                                    onClick={handleApprove}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                  >
                                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                                    Approuver
                                  </button>
                                  <button
                                    onClick={handleReject}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                  >
                                    <XCircleIcon className="h-4 w-4 mr-1" />
                                    Rejeter
                                  </button>
                                  <button
                                    onClick={() => setActionStepIndex(null)}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    Annuler
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setActionStepIndex(stepIdx)}
                                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                                  Prendre une décision
                                </button>
                              </div>
                            )}
                          </div>
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

      {/* Métadonnées */}
      {workflow.metadata && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Informations supplémentaires
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {Object.entries(workflow.metadata).map(([key, value]) => (
              <div key={key}>
                <span className="font-medium text-gray-500">
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </span>
                <span className="ml-2 text-gray-900">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalWorkflowViewer;
