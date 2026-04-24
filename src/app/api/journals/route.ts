import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { Journal } from '@/lib/models/Journal';

export async function GET() {
  await connectDB();
  const journals = await Journal.find({}).sort({ updatedAt: -1 }).lean();
  return Response.json(journals);
}

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  const journal = await Journal.create(body);
  return Response.json(journal, { status: 201 });
}
