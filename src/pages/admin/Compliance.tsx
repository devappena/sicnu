import { ScaleIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import {
  EMPLOYER,
  LEGAL_DISCLAIMER,
  LEGAL_SOURCES,
  LABOR_CODE,
  PUBLIC_HOLIDAYS_2026,
  nextIprDeclarationDue,
} from '../../legal/rdc';
import { mockEmployees } from '../../data/mockData';

export default function Compliance() {
  const due = nextIprDeclarationDue();

  const obligations = [
    {
      title: 'Retenue IPR à la source',
      detail: `Déclaration et reversement DGI au plus tard le ${format(due, 'dd MMMM yyyy', { locale: fr })} (10 jours après le mois de versement).`,
      status: 'À préparer',
    },
    {
      title: 'Cotisations INSS',
      detail: 'Part salariale 5 % + part patronale 13 %. Déclaration mensuelle INSS.',
      status: 'En cours',
    },
    {
      title: 'INPP / ONEM',
      detail: 'INPP 1 % (effectif < 50) et ONEM 0,2 % à charge de l’employeur.',
      status: 'En cours',
    },
    {
      title: 'Registre du personnel',
      detail: `${mockEmployees.length} agents suivis. Conservation des bulletins et registres : ${LABOR_CODE.archiveYears} ans.`,
      status: 'OK',
    },
    {
      title: 'Durée du travail',
      detail: `${LABOR_CODE.weeklyHours} h / semaine, ${LABOR_CODE.dailyHours} h / jour, repos ${LABOR_CODE.restHours} h consécutives.`,
      status: 'OK',
    },
    {
      title: 'Congés légaux',
      detail: '1 jour ouvrable / mois (1,5 si mineur) + 1 jour / 5 ans d’ancienneté. Maternité 14 semaines à 2/3 du salaire.',
      status: 'OK',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Conformité légale RDC"
        description="Obligations Code du travail, IPR, INSS, INPP et ONEM"
        icon={ScaleIcon}
      />

      <Card>
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
          {LEGAL_DISCLAIMER}
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
          <p><strong>Employeur :</strong> {EMPLOYER.name}</p>
          <p><strong>NIF :</strong> {EMPLOYER.nif}</p>
          <p><strong>RCCM :</strong> {EMPLOYER.rccm}</p>
          <p><strong>INSS employeur :</strong> {EMPLOYER.inssEmployer}</p>
          <p><strong>Centre DGI :</strong> {EMPLOYER.dgiCenter}</p>
          <p><strong>Siège :</strong> {EMPLOYER.address}</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {obligations.map((item) => (
          <Card key={item.title}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">{item.status}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{item.detail}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Jours fériés nationaux 2026</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
          {PUBLIC_HOLIDAYS_2026.map((holiday) => (
            <li key={holiday.date} className="flex justify-between bg-gray-50 rounded-lg px-3 py-2">
              <span>{holiday.name}</span>
              <span>{format(new Date(holiday.date), 'dd MMM yyyy', { locale: fr })}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Textes de référence</h3>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          {LEGAL_SOURCES.map((source) => (
            <li key={source}>{source}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
