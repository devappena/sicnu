import { format } from 'date-fns';
import { EMPLOYER, IPR_DECLARATION_DAY, LEGAL_DISCLAIMER, LEGAL_SOURCES } from './constants';
import { PUBLIC_HOLIDAYS_2026 } from './leaveEngine';
import type { PayslipResult } from './payrollEngine';

export { calculateIprMonthly, calculateOvertimePay, calculatePayslip } from './payrollEngine';
export type { PayslipInput, PayslipResult } from './payrollEngine';
export {
  annualLeaveEntitlementDays,
  canTakeAnnualLeave,
  legalDurationDays,
  mapAbsenceType,
  PUBLIC_HOLIDAYS_2026,
} from './leaveEngine';
export { EMPLOYER, LABOR_CODE, LEGAL_DISCLAIMER, LEGAL_SOURCES } from './constants';

export function nextIprDeclarationDue(from = new Date()): Date {
  if (from.getDate() > IPR_DECLARATION_DAY) {
    return new Date(from.getFullYear(), from.getMonth() + 1, IPR_DECLARATION_DAY);
  }
  return new Date(from.getFullYear(), from.getMonth(), IPR_DECLARATION_DAY);
}

export function formatCdf(amount: number): string {
  return new Intl.NumberFormat('fr-CD', {
    style: 'currency',
    currency: 'CDF',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildPayslipHtml(slip: PayslipResult): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Bulletin de paie — ${slip.fullName}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111; padding: 24px; }
    h1 { color: #1c3d8f; font-size: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 13px; }
    th { background: #f3f4f6; }
    .muted { color: #555; font-size: 11px; margin-top: 24px; }
    .net { font-size: 18px; font-weight: bold; color: #166534; }
  </style>
</head>
<body>
  <h1>Bulletin de paie</h1>
  <p><strong>${EMPLOYER.name}</strong> — ${EMPLOYER.legalForm}<br/>
  ${EMPLOYER.address}<br/>
  NIF ${EMPLOYER.nif} · RCCM ${EMPLOYER.rccm} · N° INSS employeur ${EMPLOYER.inssEmployer}</p>
  <p>Période : <strong>${slip.periodLabel}</strong><br/>
  Salarié : <strong>${slip.fullName}</strong> — ${slip.position} / ${slip.department}<br/>
  N° INSS salarié : ${slip.inssNumber}</p>
  <table>
    <tr><th>Élément</th><th>Montant (CDF)</th></tr>
    <tr><td>Salaire de base</td><td>${slip.baseSalary.toLocaleString('fr-FR')}</td></tr>
    <tr><td>Primes</td><td>${slip.bonuses.toLocaleString('fr-FR')}</td></tr>
    <tr><td>Heures supplémentaires</td><td>${slip.overtimePay.toLocaleString('fr-FR')}</td></tr>
    <tr><td>Brut imposable</td><td>${slip.gross.toLocaleString('fr-FR')}</td></tr>
    <tr><td>INSS salariale (5 %)</td><td>- ${slip.inssEmployee.toLocaleString('fr-FR')}</td></tr>
    <tr><td>IPR (OL 69/009, LF 19/005)</td><td>- ${slip.ipr.toLocaleString('fr-FR')}</td></tr>
    <tr><td>Autres retenues</td><td>- ${slip.otherDeductions.toLocaleString('fr-FR')}</td></tr>
    <tr><td class="net">Net à payer</td><td class="net">${slip.net.toLocaleString('fr-FR')}</td></tr>
  </table>
  <p>Charges patronales : INSS ${slip.inssEmployer.toLocaleString('fr-FR')} · INPP ${slip.inpp.toLocaleString('fr-FR')} · ONEM ${slip.onem.toLocaleString('fr-FR')} · Coût employeur ${slip.employerCost.toLocaleString('fr-FR')}</p>
  <p class="muted">${LEGAL_DISCLAIMER}<br/>Textes : ${LEGAL_SOURCES.join(' ; ')}<br/>Émis le ${format(new Date(), 'dd/MM/yyyy')} — Conservé 5 ans pour contrôle DGI/INSS.</p>
</body>
</html>`;
}

export function openPayslipPrint(slip: PayslipResult): void {
  const popup = window.open('', '_blank', 'width=800,height=900');
  if (!popup) return;
  popup.document.write(buildPayslipHtml(slip));
  popup.document.close();
  popup.focus();
  popup.print();
}

export const upcomingHolidays = PUBLIC_HOLIDAYS_2026;
