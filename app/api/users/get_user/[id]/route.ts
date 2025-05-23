import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const res = await fetch(
      `http://84.234.16.224:4012/annuaire/query/user/${id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: `Erreur HTTP: ${res.status}` }));
      console.error("Erreur de l'API distante:", errorData);
      return NextResponse.json(
        { error: `Erreur lors de la récupération des informations utilisateur: ${res.status}`, details: errorData },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur de récupération des informations utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur de récupération des informations utilisateur." },
      { status: 500 }
    );
  }
}