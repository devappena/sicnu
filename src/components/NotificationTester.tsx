import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';

export default function NotificationTester() {
  const { addNotification } = useNotifications();

  const testNotifications = [
    {
      type: 'success' as const,
      title: 'Employé ajouté avec succès',
      message: 'Le nouvel employé Victor Bafuafua a été ajouté au système.',
      actionUrl: '/employees',
      actionLabel: 'Voir les employés'
    },
    {
      type: 'warning' as const,
      title: 'Formation bientôt complète',
      message: 'Plus que 2 places disponibles pour la formation Leadership.',
      persistent: true,
      actionUrl: '/trainings',
      actionLabel: 'Voir formation'
    },
    {
      type: 'error' as const,
      title: 'Erreur de synchronisation',
      message: 'Impossible de synchroniser les données de paie.',
      persistent: true
    },
    {
      type: 'info' as const,
      title: 'Nouvelle demande d\'absence',
      message: 'Marie Kasongo a soumis une demande de congé.',
      actionUrl: '/absences',
      actionLabel: 'Examiner'
    }
  ];

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white rounded-lg shadow-lg border p-4">
      <h3 className="text-sm font-medium mb-3">Test Notifications</h3>
      <div className="space-y-2">
        {testNotifications.map((notif, index) => (
          <button
            key={index}
            onClick={() => addNotification(notif)}
            className={`block w-full text-left px-3 py-2 text-xs rounded transition-colors ${
              notif.type === 'success' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
              notif.type === 'warning' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
              notif.type === 'error' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
              'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
          >
            {notif.title}
          </button>
        ))}
      </div>
    </div>
  );
}
