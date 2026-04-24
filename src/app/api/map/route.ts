import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const location = req.nextUrl.searchParams.get('location') ?? '';
  if (!location.trim()) {
    return new Response('Missing location', { status: 400 });
  }

  // Geocode the location name to lat/lng using Nominatim (no API key required)
  let lat: string, lon: string;
  try {
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'MemoryLane/1.0 (travel-journal-app)' } }
    );
    const geoData = await geoRes.json();
    if (!Array.isArray(geoData) || !geoData.length) {
      return new Response('Location not found', { status: 404 });
    }
    ({ lat, lon } = geoData[0]);
  } catch {
    return new Response('Geocoding failed', { status: 502 });
  }

  // Proxy the static map image to avoid browser CORS restrictions
  const mapUrl =
    `https://staticmap.openstreetmap.de/staticmap.php` +
    `?center=${lat},${lon}&zoom=14&size=300x200&markers=${lat},${lon},red`;

  try {
    const mapRes = await fetch(mapUrl, {
      headers: { 'User-Agent': 'MemoryLane/1.0' },
    });
    if (!mapRes.ok) {
      return new Response('Map image unavailable', { status: 502 });
    }
    const buffer = await mapRes.arrayBuffer();
    return new Response(buffer, {
      headers: {
        'Content-Type': mapRes.headers.get('Content-Type') ?? 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch {
    return new Response('Map fetch failed', { status: 502 });
  }
}
