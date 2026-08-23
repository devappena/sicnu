import { useMemo, useState } from 'react';
import { BriefcaseIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import { useToast } from '../../hooks/useToast';
import { mockCandidates, mockJobOpenings } from '../../data/hrModules';
import type { Candidate } from '../../types';

const JOB_TYPE: Record<string, string> = {
  cdi: 'CDI',
  cdd: 'CDD',
  stage: 'Stage',
  consultant: 'Consultant',
};

const CANDIDATE_STATUS: Record<Candidate['status'], string> = {
  received: 'Reçu',
  screening: 'Présélection',
  interview: 'Entretien',
  offer: 'Offre',
  hired: 'Embauché',
  rejected: 'Refusé',
};

const STATUS_CLASS: Record<Candidate['status'], string> = {
  received: 'bg-gray-100 text-gray-700',
  screening: 'bg-blue-100 text-blue-700',
  interview: 'bg-yellow-100 text-yellow-800',
  offer: 'bg-purple-100 text-purple-700',
  hired: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function Recruitment() {
  const { showToast } = useToast();
  const [candidates, setCandidates] = useState(mockCandidates);
  const [selectedJob, setSelectedJob] = useState('all');

  const filtered = useMemo(
    () => (selectedJob === 'all' ? candidates : candidates.filter((item) => item.jobId === selectedJob)),
    [candidates, selectedJob],
  );

  const advance = (id: string) => {
    const order: Candidate['status'][] = ['received', 'screening', 'interview', 'offer', 'hired'];
    setCandidates((prev) =>
      prev.map((candidate) => {
        if (candidate.id !== id) return candidate;
        const index = order.indexOf(candidate.status);
        const next = index >= 0 && index < order.length - 1 ? order[index + 1] : candidate.status;
        return { ...candidate, status: next };
      }),
    );
    showToast('success', 'Candidature mise à jour');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recrutement"
        description="Offres d'emploi, candidatures et suivi du processus d'embauche"
        icon={BriefcaseIcon}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockJobOpenings.map((job) => (
          <Card key={job.id}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.department}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                {JOB_TYPE[job.type]}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-3">{job.description}</p>
            <p className="text-xs text-gray-500 mt-4">
              {job.openings} poste(s) · publié le {format(job.publishedAt, 'dd MMM yyyy', { locale: fr })}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <UserPlusIcon className="h-5 w-5" />
            Candidatures
          </h3>
          <select
            value={selectedJob}
            onChange={(event) => setSelectedJob(event.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">Tous les postes</option>
            {mockJobOpenings.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Candidat', 'Poste', 'Contact', 'Date', 'Étape', ''].map((header) => (
                  <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((candidate) => {
                const job = mockJobOpenings.find((item) => item.id === candidate.jobId);
                return (
                  <tr key={candidate.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {candidate.firstName} {candidate.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{job?.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{candidate.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {format(candidate.appliedAt, 'dd/MM/yyyy')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${STATUS_CLASS[candidate.status]}`}>
                        {CANDIDATE_STATUS[candidate.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {candidate.status !== 'hired' && candidate.status !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => advance(candidate.id)}
                          className="text-sm text-blue-700 font-medium hover:underline"
                        >
                          Étape suivante
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
