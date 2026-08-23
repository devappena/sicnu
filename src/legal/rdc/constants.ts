/**
 * Cadre légal RDC pour le SICNU (CNU-RDC).
 * Sources citées dans chaque constante. À faire valider par un expert-comptable / juriste congolais.
 */

import { identity } from '../../config/identity';

export const LEGAL_DISCLAIMER =
  'Moteur paramétré d’après les textes cités. Non homologué DGI/INSS. Contrôle par un expert-comptable congolais recommandé avant tout dépôt officiel.';

export const EMPLOYER = {
  name: identity.orgName,
  legalForm: 'Commission nationale',
  country: identity.country,
  city: identity.city,
  address: identity.address,
  nif: 'À renseigner',
  rccm: 'À renseigner',
  inssEmployer: 'INSS-EMP-CNU-001',
  dgiCenter: 'Centre des Impôts de Gombe',
  currency: 'CDF' as const,
};

/** Ordonnance-Loi n° 69/009 du 10 février 1969, art. 84, telle que modifiée par LF n° 19/005 du 31/12/2019. */
export const IPR_MONTHLY_BRACKETS = [
  { upTo: 162_000, rate: 0.03 },
  { upTo: 1_800_000, rate: 0.15 },
  { upTo: 3_600_000, rate: 0.3 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.4 },
] as const;

export const IPR_MIN_MONTHLY_CDF = 2_000;
export const IPR_MAX_RATE_OF_TAXABLE = 0.3;
/** Abattement charges de famille : 2 % par personne à charge, max 9 (code des impôts). */
export const IPR_FAMILY_REDUCTION_RATE = 0.02;
export const IPR_FAMILY_REDUCTION_MAX = 9;
/** Déclaration IPR : dans les 10 jours suivant le mois de versement. */
export const IPR_DECLARATION_DAY = 10;

/**
 * INSS — régime salarial (pratique courante paie RDC 2025-2026).
 * Salarié 5 % (retraite). Employeur 13 % : retraite 6 % + AT 4,5 % + prest. familiales 2,5 %.
 */
export const INSS_EMPLOYEE_RATE = 0.05;
export const INSS_EMPLOYER = {
  pension: 0.06,
  workAccident: 0.045,
  familyBenefits: 0.025,
  total: 0.13,
} as const;

/** INPP formation professionnelle — 1 % si moins de 50 salariés. */
export const INPP_RATE_SMALL = 0.01;
/** ONEM — 0,2 % à charge de l’employeur. */
export const ONEM_EMPLOYER_RATE = 0.002;

/** Loi n° 015/2002 portant Code du travail. */
export const LABOR_CODE = {
  weeklyHours: 45,
  dailyHours: 8,
  restHours: 24,
  annualLeaveDaysPerMonthAdult: 1,
  annualLeaveDaysPerMonthMinor: 1.5,
  seniorityBonusDayEveryYears: 5,
  minMonthsBeforeLeave: 12,
  maternityWeeks: 14,
  maternityPrenatalWeeks: 6,
  maternityPostnatalWeeks: 8,
  maternityPayRate: 2 / 3,
  paternityDays: 2,
  marriageDays: 2,
  childMarriageDays: 1,
  deathSpouseOrFirstDegreeDays: 4,
  deathSecondDegreeDays: 2,
  overtimeFirstBandHours: 6,
  overtimeFirstBandRate: 0.35,
  overtimeNextBandRate: 0.6,
  nightWorkRate: 0.35,
  sundayWorkRate: 0.6,
  noticeWorkerDays: 7,
  noticeEmployeeDays: 15,
  noticeSupervisorDays: 30,
  noticeManagerDays: 90,
  archiveYears: 5,
} as const;

export const LEGAL_SOURCES = [
  'Loi n° 015/2002 du 16 octobre 2002 portant Code du travail',
  'Ordonnance-Loi n° 69/009 du 10 février 1969 (IPR), art. 84 et 87',
  'Loi de finances n° 19/005 du 31 décembre 2019 (barème IPR 4 tranches)',
  'Régime INSS (part salariale / patronale)',
  'Décret n° 25/22 du 30 mai 2025 (SMIG — quotités d’exonération)',
];
