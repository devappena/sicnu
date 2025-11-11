import React, { useState, useEffect } from 'react';
import {
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface MetricCard {
  title: string;
  value: number;
  unit: string;
  change: number;
  changeType: 'increase' | 'decrease';
  trend: number[];
  color: string;
}

export default function RealTimeDashboard() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [metrics, setMetrics] = useState<MetricCard[]>([]);

  // Simulation de données temps réel
  useEffect(() => {
    const generateRandomNotification = (): Notification => {
      const types: Notification['type'][] = ['success', 'warning', 'error', 'info'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const messages = {
        success: ['Nouvelle inscription formation', 'Évaluation terminée', 'Congé approuvé'],
        warning: ['Absence prolongée détectée', 'Formation bientôt complète', 'Document manquant'],
        error: ['Échec de synchronisation', 'Erreur de calcul paie', 'Accès refusé'],
        info: ['Nouvelle politique RH', 'Mise à jour système', 'Rapport mensuel disponible']
      };

      return {
        id: `notif-${Date.now()}-${Math.random()}`,
        type,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
        message: messages[type][Math.floor(Math.random() * messages[type].length)],
        timestamp: new Date(),
        read: false
      };
    };

    const generateRandomMetric = (title: string, baseValue: number, unit: string, color: string): MetricCard => {
      const trend = Array.from({ length: 7 }, () => Math.floor(Math.random() * 20) + baseValue);
      const change = (Math.random() - 0.5) * 10; // Change entre -5% et +5%
      
      return {
        title,
        value: baseValue + Math.floor(Math.random() * 10),
        unit,
        change: Math.round(change * 10) / 10,
        changeType: change >= 0 ? 'increase' : 'decrease',
        trend,
        color
      };
    };

    // Générer les métriques initiales
    const initialMetrics = [
      generateRandomMetric('Présence', 92, '%', 'bg-green-500'),
      generateRandomMetric('Satisfaction', 85, '%', 'bg-blue-500'),
      generateRandomMetric('Productivité', 78, '%', 'bg-purple-500'),
      generateRandomMetric('Formations', 15, '', 'bg-orange-500')
    ];

    setMetrics(initialMetrics);

    // Simuler l'arrivée de nouvelles notifications
    const notificationInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% de chance
        setNotifications(prev => [generateRandomNotification(), ...prev.slice(0, 9)]);
      }
    }, 5000);

    // Mettre à jour les métriques
    const metricsInterval = setInterval(() => {
      setMetrics(prev => prev.map(metric => {
        const newValue = metric.value + (Math.random() - 0.5) * 2;
        const newTrend = [...metric.trend.slice(1), Math.floor(newValue)];
        const change = (Math.random() - 0.5) * 4;
        
        return {
          ...metric,
          value: Math.max(0, Math.min(100, Math.round(newValue))),
          trend: newTrend,
          change: Math.round(change * 10) / 10,
          changeType: change >= 0 ? 'increase' : 'decrease'
        };
      }));
    }, 10000);

    return () => {
      clearInterval(notificationInterval);
      clearInterval(metricsInterval);
    };
  }, []);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <BellIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const MiniChart = ({ data, color }: { data: number[], color: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return (
      <div className="flex items-end space-x-1 h-8">
        {data.map((value, index) => (
          <div
            key={index}
            className={`w-1 ${color} rounded-t transition-all duration-300`}
            style={{ 
              height: `${((value - min) / range) * 100}%`,
              minHeight: '4px'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Tableau de Bord Temps Réel
          </h1>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Bonjour {user?.firstName}, voici un aperçu en direct de vos métriques RH
          </p>
        </div>
        <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
          <ClockIcon className="inline w-4 h-4 mr-1" />
          Mise à jour automatique
        </div>
      </div>

      {/* Métriques en temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`
              p-6 rounded-lg border transition-all duration-300 hover:shadow-lg
              ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}
            `}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                  {metric.title}
                </p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {metric.value}{metric.unit}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                {metric.changeType === 'increase' ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  metric.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
              </div>
            </div>
            
            <MiniChart data={metric.trend} color={metric.color} />
          </div>
        ))}
      </div>

      {/* Notifications en temps réel */}
      <div className={`
        rounded-lg border p-6
        ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}
      `}>
        <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Notifications en Temps Réel
        </h2>
        
        {notifications.length === 0 ? (
          <p className={`text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Aucune notification récente
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`
                  flex items-start space-x-3 p-3 rounded-lg border transition-all duration-300
                  ${isDarkMode ? 'border-slate-600 bg-slate-700/50' : 'border-gray-200 bg-gray-50'}
                  hover:scale-105
                `}
              >
                {getNotificationIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {notification.message}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    {notification.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <div className={`
                  w-2 h-2 rounded-full 
                  ${notification.read ? 'bg-gray-300' : 'bg-blue-500'}
                `} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="p-6 text-left rounded-lg border border-dashed border-gray-300 hover:border-ena-blue-500 transition-colors group">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-ena-blue-100 rounded-lg group-hover:bg-ena-blue-200 transition-colors">
              <BellIcon className="w-6 h-6 text-ena-blue-600" />
            </div>
            <div>
              <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Nouvelle Absence
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Créer une demande d'absence
              </p>
            </div>
          </div>
        </button>

        <button className="p-6 text-left rounded-lg border border-dashed border-gray-300 hover:border-ena-blue-500 transition-colors group">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Formation
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                S'inscrire à une formation
              </p>
            </div>
          </div>
        </button>

        <button className="p-6 text-left rounded-lg border border-dashed border-gray-300 hover:border-ena-blue-500 transition-colors group">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <ClockIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Pointage
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Enregistrer présence
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
