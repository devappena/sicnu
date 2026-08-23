import React, { useState } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CalendarIcon,
  AcademicCapIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTheme } from '../hooks/useTheme';
import type { Training } from '../types';

interface TrainingCalendarProps {
  trainings: Training[];
  onTrainingClick?: (training: Training) => void;
}

export default function TrainingCalendar({ trainings, onTrainingClick }: TrainingCalendarProps) {
  const { isDarkMode } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTrainingsForDay = (day: Date) => {
    return trainings.filter(training => 
      isSameDay(training.startDate, day) || 
      (training.endDate && isSameDay(training.endDate, day))
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'scheduled':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className={`
      rounded-lg border p-6
      ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cnu-blue-100 rounded-lg">
            <CalendarIcon className="w-6 h-6 text-cnu-blue-600" />
          </div>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Calendrier des Formations
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={previousMonth}
            className={`
              p-2 rounded-lg transition-colors
              ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}
            `}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {format(currentMonth, 'MMMM yyyy', { locale: fr })}
          </h3>
          
          <button
            onClick={nextMonth}
            className={`
              p-2 rounded-lg transition-colors
              ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}
            `}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Days of the week */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
          <div
            key={day}
            className={`
              py-2 text-center text-sm font-medium
              ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}
            `}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const dayTrainings = getTrainingsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div
              key={day.toISOString()}
              className={`
                min-h-[80px] p-1 border rounded-lg transition-colors
                ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}
                ${isCurrentMonth ? '' : 'opacity-50'}
                ${isToday ? 'ring-2 ring-cnu-blue-500' : ''}
                ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}
              `}
            >
              <div className={`
                text-sm font-medium mb-1
                ${isToday ? 'text-cnu-blue-600' : isDarkMode ? 'text-white' : 'text-gray-900'}
              `}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1">
                {dayTrainings.slice(0, 2).map(training => (
                  <div
                    key={training.id}
                    onClick={() => onTrainingClick?.(training)}
                    className={`
                      p-1 rounded text-xs cursor-pointer transition-all hover:scale-105
                      ${getStatusColor(training.status)} text-white
                    `}
                    title={`${training.title} - ${training.instructor}`}
                  >
                    <div className="flex items-center space-x-1">
                      <AcademicCapIcon className="w-3 h-3" />
                      <span className="truncate">{training.title}</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <UsersIcon className="w-3 h-3" />
                      <span>{training.enrolledEmployees.length}/{training.capacity}</span>
                    </div>
                  </div>
                ))}
                
                {dayTrainings.length > 2 && (
                  <div className={`
                    text-xs text-center py-1 rounded
                    ${isDarkMode ? 'text-slate-400 bg-slate-700' : 'text-gray-500 bg-gray-100'}
                  `}>
                    +{dayTrainings.length - 2} autre{dayTrainings.length - 2 > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            Planifiées
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            En cours
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            Terminées
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            Annulées
          </span>
        </div>
      </div>
    </div>
  );
}
