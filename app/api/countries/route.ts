import { NextResponse } from "next/server";
import { countries } from "@/data/locations";

export async function GET() {
  return NextResponse.json({ data: countries });
}
