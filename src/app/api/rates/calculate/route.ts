import { NextRequest } from 'next/server';
import { getMarket, getConfig } from '@/lib/rateData';
import { calculateRates, CompanyType } from '@/lib/rateEngine';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { marketId, roleId, payRate, companyType = 'Direct' } = body as {
    marketId: string;
    roleId: string;
    payRate: number;
    companyType?: CompanyType;
  };

  const market = getMarket(marketId);
  if (!market) return Response.json({ error: 'Destination not found' }, { status: 404 });

  const config = getConfig(marketId, roleId);
  if (!config) return Response.json({ error: 'Content type config not found' }, { status: 404 });

  if (!payRate || payRate <= 0) {
    return Response.json({ error: 'payRate must be a positive number' }, { status: 400 });
  }

  const result = calculateRates(payRate, config.overheadRate, market, config.avgRate, companyType);
  return Response.json(result);
}
