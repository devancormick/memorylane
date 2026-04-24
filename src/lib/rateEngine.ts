import { Market } from './rateData';

export type CompanyType = 'Direct' | 'Agency' | 'Platform';

export interface RateResult {
  payRate: number;       // base day rate entered by user
  overheadRate: number;  // overhead % (gear + travel + editing)
  costPerDay: number;    // base × (1 + overhead/100)
  dayRate: number;       // what to charge the client (standard)
  rushRate: number;      // urgent/rush delivery rate (dayRate × 1.5)
  profitPerDay: number;  // dayRate − costPerDay
  actualGP: number;      // actual margin %
  targetGP: number;      // destination target margin %
  minGP: number;         // floor margin — negotiate or decline below
  atOrAboveTarget: boolean;
  belowMin: boolean;
  avgRate: number;       // destination average base day rate for this content type
  companyType: CompanyType;
}

const r2 = (n: number) => Math.round(n * 100) / 100;
const r1 = (n: number) => Math.round(n * 10) / 10;

/**
 * Core day-rate calculation formula.
 *
 * Direct:   day_rate = base × (1 + overhead/100) / (1 − targetMargin/100)
 * Agency:   day_rate = base × (1 + agencyMU/100)
 * Platform: day_rate = base × (1 + platformMU/100)
 *
 * rush_rate    = day_rate × 1.5
 * cost_per_day = base × (1 + overhead/100)
 * profit_day   = day_rate − cost_per_day
 * actual_margin = profit_day / day_rate × 100
 */
export function calculateRates(
  payRate: number,
  overheadRate: number,
  market: Market,
  avgRate: number,
  companyType: CompanyType = 'Direct'
): RateResult {
  const costPerDay = payRate * (1 + overheadRate / 100);

  let dayRate: number;
  if (companyType === 'Agency') {
    dayRate = payRate * (1 + market.agencyMU / 100);
  } else if (companyType === 'Platform') {
    dayRate = payRate * (1 + market.platformMU / 100);
  } else {
    dayRate = costPerDay / (1 - market.targetGP / 100);
  }

  const rushRate = dayRate * 1.5;
  const profitPerDay = dayRate - costPerDay;
  const actualGP = dayRate > 0 ? (profitPerDay / dayRate) * 100 : 0;

  return {
    payRate:          r2(payRate),
    overheadRate:     r1(overheadRate),
    costPerDay:       r2(costPerDay),
    dayRate:          r2(dayRate),
    rushRate:         r2(rushRate),
    profitPerDay:     r2(profitPerDay),
    actualGP:         r1(actualGP),
    targetGP:         market.targetGP,
    minGP:            market.minGP,
    atOrAboveTarget:  actualGP >= market.targetGP,
    belowMin:         actualGP < market.minGP,
    avgRate,
    companyType,
  };
}

/** Generate base-rate dropdown options from $200 to $2000 in $50 increments. */
export function payRateOptions(min = 200, max = 2000, step = 50): number[] {
  const opts: number[] = [];
  for (let v = min; v <= max; v = r2(v + step)) opts.push(v);
  return opts;
}

export function fmt$(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}
