import { differenceInYears, differenceInCalendarMonths } from 'date-fns';
import { LABOR_CODE } from './constants';

export type LegalLeaveKind =
  | 'annual'
  | 'maternity'
  | 'paternity'
  | 'marriage'
  | 'child_marriage'
  | 'death_first'
  | 'death_second'
  | 'sick';

export function ageAt(dateOfBirth: Date, onDate = new Date()): number {
  return differenceInYears(onDate, dateOfBirth);
}

export function seniorityYears(hireDate: Date, onDate = new Date()): number {
  return Math.max(0, differenceInYears(onDate, hireDate));
}

export function annualLeaveEntitlementDays(hireDate: Date, dateOfBirth: Date, onDate = new Date()): number {
  const months = Math.max(0, differenceInCalendarMonths(onDate, hireDate));
  const perMonth =
    ageAt(dateOfBirth, onDate) < 18
      ? LABOR_CODE.annualLeaveDaysPerMonthMinor
      : LABOR_CODE.annualLeaveDaysPerMonthAdult;
  const base = months * perMonth;
  const extra = Math.floor(seniorityYears(hireDate, onDate) / LABOR_CODE.seniorityBonusDayEveryYears);
  return Math.floor(base + extra);
}

export function canTakeAnnualLeave(hireDate: Date, onDate = new Date()): boolean {
  return differenceInCalendarMonths(onDate, hireDate) >= LABOR_CODE.minMonthsBeforeLeave;
}

export function legalDurationDays(kind: LegalLeaveKind): number | null {
  switch (kind) {
    case 'maternity':
      return LABOR_CODE.maternityWeeks * 7;
    case 'paternity':
      return LABOR_CODE.paternityDays;
    case 'marriage':
      return LABOR_CODE.marriageDays;
    case 'child_marriage':
      return LABOR_CODE.childMarriageDays;
    case 'death_first':
      return LABOR_CODE.deathSpouseOrFirstDegreeDays;
    case 'death_second':
      return LABOR_CODE.deathSecondDegreeDays;
    default:
      return null;
  }
}

export function mapAbsenceType(type: string): LegalLeaveKind {
  if (type === 'maternity') return 'maternity';
  if (type === 'paternity') return 'paternity';
  if (type === 'sick') return 'sick';
  if (type === 'personal') return 'marriage';
  return 'annual';
}

export const PUBLIC_HOLIDAYS_2026: Array<{ date: string; name: string }> = [
  { date: '2026-01-01', name: 'Jour de l’An' },
  { date: '2026-01-04', name: 'Martyrs de l’Indépendance' },
  { date: '2026-01-16', name: 'Héros de la Nation (L.D. Kabila)' },
  { date: '2026-01-17', name: 'Héros de la Nation (P. Lumumba)' },
  { date: '2026-04-06', name: 'Lundi de Pâques' },
  { date: '2026-05-01', name: 'Fête du Travail' },
  { date: '2026-05-17', name: 'Journée de la Libération' },
  { date: '2026-06-30', name: 'Indépendance' },
  { date: '2026-08-01', name: 'Fête des Parents' },
  { date: '2026-12-25', name: 'Noël' },
];
