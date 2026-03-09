import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  return NextResponse.json({
    message: 'API route for Rome itinerary app',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}

// For static export, we need to handle all methods
// but this is a static site, so API routes are limited
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed for static export' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed for static export' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed for static export' },
    { status: 405 }
  );
}
