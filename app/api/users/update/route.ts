import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();  
    const res = await fetch(
      `http://84.234.16.224:4042/annuaire/update/user/${payload.user_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload.data),
      }
    );
    
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}