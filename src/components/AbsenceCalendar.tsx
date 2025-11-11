import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { mockAbsences, mockEmployees } from '../data/mockData';

interface AbsenceEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  employee: string;
  reason: string;
}

export default function AbsenceCalendar() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Conversion des absences en événements
  const events: AbsenceEvent[] = mockAbsences
    .filter(absence => statusFilter === 'all' || absence.status === statusFilter)
    .map(absence => {
      const employee = mockEmployees.find(emp => emp.id === absence.employeeId);
      return {
        id: absence.id,
        title: `${employee?.firstName} ${employee?.lastName} - ${absence.type}`,
        startDate: absence.startDate.toLocaleDateString('fr-FR'),
        endDate: absence.endDate.toLocaleDateString('fr-FR'),
        type: absence.type,
        status: absence.status,
        employee: `${employee?.firstName} ${employee?.lastName}`,
        reason: absence.reason
      };
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvée';
      case 'rejected':
        return 'Rejetée';
      default:
        return 'En attente';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Filtrer par statut:</span>
        </div>
        
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'Toutes', color: 'bg-gray-100 text-gray-800' },
            { key: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
            { key: 'approved', label: 'Approuvées', color: 'bg-green-100 text-green-800' },
            { key: 'rejected', label: 'Rejetées', color: 'bg-red-100 text-red-800' }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setStatusFilter(filter.key as typeof statusFilter)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                statusFilter === filter.key
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : `${filter.color} border border-transparent hover:border-gray-300`
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vue calendrier simple */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              className="p-1 rounded hover:bg-gray-200 transition-colors"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
              {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              className="p-1 rounded hover:bg-gray-200 transition-colors"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
          >
            Aujourd'hui
          </button>
        </div>

        {/* Liste des événements du mois */}
        <div className="space-y-3">
          {events.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Aucune absence pour cette période
            </p>
          ) : (
            events.map(event => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="font-medium text-gray-900">
                      {event.employee}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                      {getStatusText(event.status)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {event.type} • {event.startDate} → {event.endDate}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {event.reason}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Légende */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span>En attente</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Approuvées</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Rejetées</span>
        </div>
      </div>
    </div>
  );
}