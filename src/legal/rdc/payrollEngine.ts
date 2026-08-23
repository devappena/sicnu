import {
  INPP_RATE_SMALL,
  INSS_EMPLOYEE_RATE,
  INSS_EMPLOYER,
  IPR_FAMILY_REDUCTION_MAX,
  IPR_FAMILY_REDUCTION_RATE,
  IPR_MAX_RATE_OF_TAXABLE,
  IPR_MIN_MONTHLY_CDF,
  IPR_MONTHLY_BRACKETS,
  LABOR_CODE,
  ONEM_EMPLOYER_RATE,
} from './constants';

export interface PayslipInput {
  employeeId: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  inssNumber?: string;
  nationalId?: string;
  dependentsCount?: number;
  baseSalary: number;
  bonuses?: number;
  overtimeHoursWeekday?: number;
  overtimeHoursSunday?: number;
  otherDeductions?: number;
  periodLabel: string;
}

export interface PayslipResult {
  employeeId: string;
  fullName: string;
  position: string;
  department: string;
  inssNumber: string;
  periodLabel: string;
  baseSalary: number;
  bonuses: number;
  overtimePay: number;
  gross: number;
  taxable: number;
  inssEmployee: number;
  iprGross: number;
  iprFamilyReduction: number;
  ipr: number;
  otherDeductions: number;
  net: number;
  inssEmployer: number;
  inpp: number;
  onem: number;
  employerCost: number;
  breakdownIpr: Array<{ band: string; rate: number; amount: number }>;
}

function roundCdf(value: number): number {
  return Math.round(value);
}

export function calculateOvertimePay(hourlyRate: number, weekdayHours: number, sundayHours: number): number {
  const first = Math.min(weekdayHours, LABOR_CODE.overtimeFirstBandHours);
  const next = Math.max(0, weekdayHours - LABOR_CODE.overtimeFirstBandHours);
  const weekday =
    first * hourlyRate * (1 + LABOR_CODE.overtimeFirstBandRate) +
    next * hourlyRate * (1 + LABOR_CODE.overtimeNextBandRate);
  const sunday = sundayHours * hourlyRate * (1 + LABOR_CODE.sundayWorkRate);
  return roundCdf(weekday + sunday);
}

export function calculateIprMonthly(taxable: number, dependentsCount = 0): {
  ipr: number;
  iprGross: number;
  familyReduction: number;
  breakdown: Array<{ band: string; rate: number; amount: number }>;
} {
  const safeTaxable = Math.max(0, taxable);
  const breakdown: Array<{ band: string; rate: number; amount: number }> = [];
  let remaining = safeTaxable;
  let previousCap = 0;
  let iprGross = 0;

  for (const bracket of IPR_MONTHLY_BRACKETS) {
    const width = bracket.upTo - previousCap;
    const slice = Math.min(remaining, width);
    if (slice > 0) {
      const amount = slice * bracket.rate;
      iprGross += amount;
      breakdown.push({
        band: `${previousCap.toLocaleString('fr-FR')} – ${bracket.upTo === Number.POSITIVE_INFINITY ? '∞' : bracket.upTo.toLocaleString('fr-FR')} CDF`,
        rate: bracket.rate,
        amount: roundCdf(amount),
      });
      remaining -= slice;
    }
    previousCap = bracket.upTo;
    if (remaining <= 0) break;
  }

  const dependents = Math.min(Math.max(0, dependentsCount), IPR_FAMILY_REDUCTION_MAX);
  const familyReduction = iprGross * IPR_FAMILY_REDUCTION_RATE * dependents;
  let ipr = iprGross - familyReduction;
  ipr = Math.max(IPR_MIN_MONTHLY_CDF, Math.min(ipr, safeTaxable * IPR_MAX_RATE_OF_TAXABLE));

  return {
    ipr: roundCdf(ipr),
    iprGross: roundCdf(iprGross),
    familyReduction: roundCdf(familyReduction),
    breakdown,
  };
}

export function calculatePayslip(input: PayslipInput): PayslipResult {
  const bonuses = input.bonuses ?? 0;
  const monthlyHours = LABOR_CODE.weeklyHours * (52 / 12);
  const hourlyRate = input.baseSalary / monthlyHours;
  const overtimePay = calculateOvertimePay(
    hourlyRate,
    input.overtimeHoursWeekday ?? 0,
    input.overtimeHoursSunday ?? 0,
  );
  const gross = roundCdf(input.baseSalary + bonuses + overtimePay);
  const taxable = gross;
  const inssEmployee = roundCdf(gross * INSS_EMPLOYEE_RATE);
  const iprCalc = calculateIprMonthly(taxable, input.dependentsCount ?? 0);
  const otherDeductions = input.otherDeductions ?? 0;
  const net = roundCdf(gross - inssEmployee - iprCalc.ipr - otherDeductions);
  const inssEmployer = roundCdf(gross * INSS_EMPLOYER.total);
  const inpp = roundCdf(gross * INPP_RATE_SMALL);
  const onem = roundCdf(gross * ONEM_EMPLOYER_RATE);

  return {
    employeeId: input.employeeId,
    fullName: `${input.firstName} ${input.lastName}`,
    position: input.position,
    department: input.department,
    inssNumber: input.inssNumber || `INSS-CNU-${input.employeeId.padStart(4, '0')}`,
    periodLabel: input.periodLabel,
    baseSalary: roundCdf(input.baseSalary),
    bonuses: roundCdf(bonuses),
    overtimePay,
    gross,
    taxable,
    inssEmployee,
    iprGross: iprCalc.iprGross,
    iprFamilyReduction: iprCalc.familyReduction,
    ipr: iprCalc.ipr,
    otherDeductions: roundCdf(otherDeductions),
    net,
    inssEmployer,
    inpp,
    onem,
    employerCost: roundCdf(gross + inssEmployer + inpp + onem),
    breakdownIpr: iprCalc.breakdown,
  };
}
