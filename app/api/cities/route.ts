import { NextResponse } from 'next/server';
import { citiesByCountry } from '@/data/locations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const country = body.country;

    if (!country) {
      return NextResponse.json(
        { error: 'Country is required' },
        { status: 400 }
      );
    }

    const cities = citiesByCountry[country] || [];
    return NextResponse.json({ data: cities });
  } catch (error) {
    console.error("Erreur lors de la récupération des villes:", error);
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}
