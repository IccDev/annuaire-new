import { NextResponse } from "next/server";
// import type { AnnuaireContactResult } from '@/types/interfaces/annuaire-search-result';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const res = await fetch(
      `http://84.234.16.224:4042/annuaire/query/user/${id}/contact`,
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
    console.error("Erreur de fetch :", error);
    return NextResponse.json(
      { error: "Echec de recuperation des informations de utilisateur" },
      { status: 500 }
    );
  }
}
