import { NextResponse } from "next/server";
import type { AnnuaireSearch } from "@/types/interfaces/annuaire";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key") || "";
  const church = url.searchParams.get("church") || "toutes";

  if (!key) {
    return NextResponse.json(
      { error: 'Le paramètre "key" est requis' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `http://84.234.16.224:4042/annuaire/query/users/${key}/${church}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Erreur HTTP: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return NextResponse.json(
      {
        error: "Échec de la récupération des utilisateurs",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
