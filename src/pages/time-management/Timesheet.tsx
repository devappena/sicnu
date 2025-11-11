import React, { useState } from 'react';
import { ClockIcon, CalendarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { mockTimeSheets, mockEmployees, mockAttendanceRecords, mockWorkSchedules } from '../../data/mockData';
import type { TimeSheet } from '../../types';
import AdvancedTimesheet from '../../components/AdvancedTimesheet';
import { useToast } from '../../hooks/useToast';

const Timesheet: React.FC = () => {
  const [selectedDate, _setSelectedDate] = useState(new Date());
  const [timeSheets, setTimeSheets] = useState<TimeSheet[]>(mockTimeSheets);
  const [viewMode, setViewMode] = useState<'simple' | 'advanced'>('advanced');
  const { showToast } = useToast();

  const getEmployeeName = (employeeId: string) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Inconnu';
  };

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm');
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  };

  const handleApprove = (id: string) => {
    setTimeSheets(prev => 
      prev.map(ts => ts.id === id ? { ...ts, status: 'approved' } : ts)
    );
  };

  const handleReject = (id: string) => {
    setTimeSheets(prev => 
      prev.map(ts => ts.id === id ? { ...ts, status: 'rejected' } : ts)
    );
  };

  const getStatusColor = (status: TimeSheet['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: TimeSheet['status']) => {
    switch (status) {
      case 'approved':
        return 'Approuvé';
      case 'rejected':
        return 'Rejeté';
      case 'pending':
        return 'En attente';
      default:
        return 'Inconnu';
    }
  };

  const totalHours = timeSheets.reduce((sum, ts) => sum + ts.totalHours, 0);
  const pendingCount = timeSheets.filter(ts => ts.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Toggle pour changer de mode */}
      <div className="flex justify-end">
        <div className="bg-white rounded-lg shadow p-1 flex">
          <button
            onClick={() => setViewMode('simple')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'simple'
                ? 'bg-ena-blue text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Vue Simple
          </button>
          <button
            onClick={() => setViewMode('advanced')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'advanced'
                ? 'bg-ena-blue text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Vue Avancée
          </button>
        </div>
      </div>

      {viewMode === 'advanced' ? (
        <AdvancedTimesheet
          attendanceRecords={mockAttendanceRecords}
          workSchedules={mockWorkSchedules}
          onClockIn={(_employeeId) => showToast('success', 'Pointage d\'entrée enregistré')}
          onClockOut={(_employeeId) => showToast('success', 'Pointage de sortie enregistré')}
          onApproveRecord={(_recordId) => showToast('success', 'Enregistrement approuvé')}
          onRejectRecord={(_recordId) => showToast('info', 'Enregistrement rejeté')}
        />
      ) : (
        <div className="space-y-6">
          {/* Titre pour la vue simple */}
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
                  Gestion du Pointage
                </h1>
                <p className="text-blue-100">
                  Suivi des heures de travail et validation des pointages
                </p>
              </div>
              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => _setSelectedDate(new Date(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-ena-blue focus:border-ena-blue"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total des Heures
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalHours.toFixed(1)}h
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
                    Approuvés
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {timeSheets.filter(ts => ts.status === 'approved').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timesheet List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Feuilles de Temps - {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Liste des pointages et heures travaillées
          </p>
        </div>
        <ul className="divide-y divide-gray-200">
          {timeSheets.map((timeSheet) => (
            <li key={timeSheet.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {getEmployeeName(timeSheet.employeeId)}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(timeSheet.status)}`}
                        >
                          {getStatusText(timeSheet.status)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Arrivée:</span>
                        <div className="text-gray-900">{formatTime(timeSheet.clockIn)}</div>
                      </div>
                      <div>
                        <span className="font-medium">Départ:</span>
                        <div className="text-gray-900">
                          {timeSheet.clockOut ? formatTime(timeSheet.clockOut) : 'En cours...'}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Pause:</span>
                        <div className="text-gray-900">{formatDuration(timeSheet.breakDuration)}</div>
                      </div>
                      <div>
                        <span className="font-medium">Total:</span>
                        <div className="text-gray-900 font-semibold">{timeSheet.totalHours.toFixed(1)}h</div>
                      </div>
                    </div>
                    {timeSheet.notes && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-700">{timeSheet.notes}</p>
                      </div>
                    )}
                  </div>
                  {timeSheet.status === 'pending' && (
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => handleApprove(timeSheet.id)}
                        className="text-green-600 hover:text-green-800"
                        title="Approuver"
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleReject(timeSheet.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Rejeter"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
        </div>
      )}
    </div>
  );
};

export default Timesheet;
