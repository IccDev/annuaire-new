import { NextResponse } from 'next/server';
import type { Eglise } from '@/types/interfaces/annuaire';

export async function GET() {
  try {
    const res = await fetch(
      "http://84.234.16.224:4042/annuaire/query/all/churches",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching churches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch churches' },
      { status: 500 }
    );
  }
}