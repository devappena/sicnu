import { describe, expect, it } from 'vitest';
import { calculateIprMonthly, calculatePayslip } from '@/legal/rdc/payrollEngine';
import { annualLeaveEntitlementDays, canTakeAnnualLeave } from '@/legal/rdc/leaveEngine';

describe('IPR RDC (OL 69/009, LF 19/005)', () => {
  it('calcule 55 560 CDF pour 500 000 CDF imposables', () => {
    expect(calculateIprMonthly(500_000).ipr).toBe(55_560);
  });

  it('calcule 310 560 CDF pour 2 000 000 CDF imposables', () => {
    expect(calculateIprMonthly(2_000_000).ipr).toBe(310_560);
  });

  it('applique un plancher de 2 000 CDF', () => {
    expect(calculateIprMonthly(10_000).ipr).toBe(2_000);
  });

  it('réduit l’IPR de 2 % par personne à charge', () => {
    const without = calculateIprMonthly(500_000, 0).ipr;
    const withTwo = calculateIprMonthly(500_000, 2).ipr;
    expect(withTwo).toBeLessThan(without);
  });
});

describe('Bulletin de paie INSS + IPR', () => {
  it('déduit 5 % d’INSS et l’IPR du net', () => {
    const slip = calculatePayslip({
      employeeId: '1',
      firstName: 'Test',
      lastName: 'Agent',
      position: 'Cadre',
      department: 'RH',
      baseSalary: 500_000,
      periodLabel: 'Août 2026',
    });
    expect(slip.inssEmployee).toBe(25_000);
    expect(slip.ipr).toBe(55_560);
    expect(slip.net).toBe(500_000 - 25_000 - 55_560);
    expect(slip.inssEmployer).toBe(65_000);
  });
});

describe('Congés Code du travail 015/2002', () => {
  it('accorde 1 jour par mois après 12 mois', () => {
    const hire = new Date('2025-01-01');
    const on = new Date('2026-01-01');
    expect(canTakeAnnualLeave(hire, on)).toBe(true);
    expect(annualLeaveEntitlementDays(hire, new Date('1990-01-01'), on)).toBe(12);
  });

  it('refuse le congé annuel avant 12 mois', () => {
    expect(canTakeAnnualLeave(new Date('2026-03-01'), new Date('2026-08-01'))).toBe(false);
  });
});
