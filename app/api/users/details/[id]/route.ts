import { NextResponse } from 'next/server';
import type { RegisterFormDataResult } from '@/types/interfaces/annuaire';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  try {
    const res = await fetch(
      `http://84.234.16.224:4042/annuaire/query/user/${id}`,
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
    console.error('Error fetching user details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user details' },
      { status: 500 }
    );
  }
}