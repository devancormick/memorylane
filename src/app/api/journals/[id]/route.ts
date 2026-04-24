import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { Journal } from '@/lib/models/Journal';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const journal = await Journal.findById(id).lean();
  if (!journal) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(journal);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const body = await request.json();
  const journal = await Journal.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!journal) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(journal);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  await Journal.findByIdAndDelete(id);
  return new Response(null, { status: 204 });
}
