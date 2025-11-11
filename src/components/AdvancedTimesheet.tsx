import React, { useState } from 'react';
import {
  ClockIcon,
  CalendarIcon,
  UserGroupIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  PlayIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import type { AttendanceRecord, WorkSchedule } from '../types';
import { format, differenceInMinutes, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AdvancedTimesheetProps {
  attendanceRecords: AttendanceRecord[];
  workSchedules: WorkSchedule[];
  onClockIn?: (employeeId: string) => void;
  onClockOut?: (employeeId: string) => void;
  onApproveRecord?: (recordId: string) => void;
  onRejectRecord?: (recordId: string) => void;
}

const AdvancedTimesheet: React.FC<AdvancedTimesheetProps> = ({
  attendanceRecords,
  // workSchedules, // Commenté car non utilisé actuellement
  onClockIn,
  onClockOut,
  onApproveRecord,
  onRejectRecord
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  // Variables pour filtrage futur
  // const [selectedEmployee, setSelectedEmployee] = useState<string>('all');

  const formatTime = (date: Date | string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'HH:mm');
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  };

  const calculateTotalWorkedTime = (record: AttendanceRecord) => {
    if (!record.clockIn || !record.clockOut) return 0;
    
    const workMinutes = differenceInMinutes(
      new Date(record.clockOut),
      new Date(record.clockIn)
    );
    
    const breakMinutes = record.breaks.reduce((total, breakRecord) => 
      total + breakRecord.duration, 0
    );
    
    return workMinutes - breakMinutes;
  };

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'late':
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />;
      case 'absent':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'half_day':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'early_departure':
        return <ExclamationCircleIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return 'Présent';
      case 'late':
        return 'En retard';
      case 'absent':
        return 'Absent';
      case 'half_day':
        return 'Demi-journée';
      case 'early_departure':
        return 'Départ anticipé';
      default:
        return 'Inconnu';
    }
  };

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'half_day':
        return 'bg-blue-100 text-blue-800';
      case 'early_departure':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const currentDate = format(selectedDate, 'yyyy-MM-dd');
  const todayRecords = attendanceRecords.filter(record => 
    format(record.date, 'yyyy-MM-dd') === currentDate
  );

  const totalWorkedHours = todayRecords.reduce((total, record) => 
    total + record.totalWorkedHours, 0
  );

  const totalOvertimeHours = todayRecords.reduce((total, record) => 
    total + record.overtimeHours, 0
  );

  const presentEmployees = todayRecords.filter(record => 
    record.status === 'present' || record.status === 'late'
  ).length;

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
              <ClockIcon className="h-8 w-8 mr-3" />
              Pointage Avancé
            </h1>
            <p className="text-blue-100">
              Gestion complète des horaires et présences
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'daily' | 'weekly' | 'monthly')}
              className="bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Vue Journalière</option>
              <option value="weekly">Vue Hebdomadaire</option>
              <option value="monthly">Vue Mensuelle</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistiques du jour */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Employés Présents
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {presentEmployees} / {todayRecords.length}
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
                <ClockIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Heures Travaillées
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalWorkedHours.toFixed(1)}h
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
                <ChartBarIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Heures Supplémentaires
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalOvertimeHours.toFixed(1)}h
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
                <CalendarIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Taux de Présence
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {todayRecords.length > 0 
                      ? ((presentEmployees / todayRecords.length) * 100).toFixed(1)
                      : 0}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enregistrements de présence */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Registre de Présence - {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Détail des pointages et temps de travail
          </p>
        </div>
        <ul className="divide-y divide-gray-200">
          {todayRecords.map((record) => {
            const workedMinutes = calculateTotalWorkedTime(record);
            const isLate = record.status === 'late';
            const hasOvertime = record.overtimeHours > 0;

            return (
              <li key={record.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getStatusIcon(record.status)}
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-gray-900">
                              Employé {record.employeeId}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {record.location || 'Bureau Principal'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}
                          >
                            {getStatusText(record.status)}
                          </span>
                          {hasOvertime && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              +{record.overtimeHours.toFixed(1)}h sup.
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Horaires */}
                      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-500">Arrivée:</span>
                          <div className={`${isLate ? 'text-red-600' : 'text-gray-900'}`}>
                            {record.clockIn ? formatTime(record.clockIn) : '-'}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Départ:</span>
                          <div className="text-gray-900">
                            {record.clockOut ? formatTime(record.clockOut) : 'En cours...'}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Temps travaillé:</span>
                          <div className="text-gray-900">
                            {workedMinutes > 0 ? `${Math.floor(workedMinutes / 60)}h ${workedMinutes % 60}min` : 'En cours...'}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Programmé:</span>
                          <div className="text-gray-900">
                            {record.scheduledHours}h
                          </div>
                        </div>
                      </div>

                      {/* Pauses */}
                      {record.breaks.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Pauses:</h5>
                          <div className="flex flex-wrap gap-2">
                            {record.breaks.map((breakRecord, index) => (
                              <span
                                key={index}
                                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                                  breakRecord.isPaid 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {breakRecord.type}: {formatDuration(breakRecord.duration)}
                                {breakRecord.endTime && (
                                  <span className="ml-1">
                                    ({formatTime(breakRecord.startTime)} - {formatTime(breakRecord.endTime)})
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {record.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-700">{record.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions de pointage */}
                    <div className="ml-4 flex-shrink-0 flex flex-col space-y-2">
                      {!record.clockIn && onClockIn && (
                        <button
                          onClick={() => onClockIn(record.employeeId)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <PlayIcon className="h-3 w-3 mr-1" />
                          Pointer
                        </button>
                      )}
                      
                      {record.clockIn && !record.clockOut && onClockOut && (
                        <button
                          onClick={() => onClockOut(record.employeeId)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <StopIcon className="h-3 w-3 mr-1" />
                          Sortir
                        </button>
                      )}

                      {/* Actions d'approbation */}
                      {record.clockOut && !record.approvedBy && (
                        <div className="flex space-x-1">
                          {onApproveRecord && (
                            <button
                              onClick={() => onApproveRecord(record.id)}
                              className="text-green-600 hover:text-green-800"
                              title="Approuver"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                            </button>
                          )}
                          {onRejectRecord && (
                            <button
                              onClick={() => onRejectRecord(record.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Rejeter"
                            >
                              <XCircleIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )}

                      {record.approvedBy && (
                        <span className="text-xs text-green-600 font-medium">
                          ✓ Approuvé
                        </span>
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

export default AdvancedTimesheet;
