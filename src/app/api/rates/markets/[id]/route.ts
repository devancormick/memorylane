import { NextRequest } from 'next/server';
import { getMarket, getMarketConfigs, ROLES } from '@/lib/rateData';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const market = getMarket(id);
  if (!market) return Response.json({ error: 'Market not found' }, { status: 404 });

  const configs = getMarketConfigs(id);
  const roles = configs.map(c => {
    const role = ROLES.find(r => r.id === c.roleId);
    return { role, overheadRate: c.overheadRate, avgRate: c.avgRate };
  });

  return Response.json({ market, roles });
}
