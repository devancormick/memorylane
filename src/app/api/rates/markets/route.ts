import { MARKETS } from '@/lib/rateData';

export async function GET() {
  return Response.json(MARKETS);
}
