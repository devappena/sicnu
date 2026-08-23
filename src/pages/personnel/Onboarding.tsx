import { useState } from 'react';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import { useToast } from '../../hooks/useToast';
import { mockCareerCases } from '../../data/hrModules';

export default function Onboarding() {
  const { showToast } = useToast();
  const [cases, setCases] = useState(mockCareerCases);

  const toggleTask = (caseId: string, taskId: string) => {
    setCases((prev) =>
      prev.map((item) => {
        if (item.id !== caseId) return item;
        const tasks = item.tasks.map((task) =>
          task.id === taskId ? { ...task, done: !task.done } : task,
        );
        const progress = Math.round((tasks.filter((task) => task.done).length / tasks.length) * 100);
        return { ...item, tasks, progress };
      }),
    );
    showToast('success', 'Tâche mise à jour');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Intégration & départ"
        description="Checklists d'arrivée et de sortie du personnel"
        icon={UserPlusIcon}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cases.map((item) => (
          <Card key={item.id}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{item.employeeName}</h3>
                <p className="text-sm text-gray-500">{item.department}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  item.type === 'onboarding' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}
              >
                {item.type === 'onboarding' ? 'Arrivée' : 'Départ'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Date : {format(item.startDate, 'dd MMMM yyyy', { locale: fr })}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.progress}%` }} />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-2">{item.progress}% terminé</p>
            <ul className="space-y-2">
              {item.tasks.map((task) => (
                <li key={task.id}>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTask(item.id, task.id)}
                      className="rounded border-gray-300"
                    />
                    <span className={task.done ? 'line-through text-gray-400' : ''}>{task.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
