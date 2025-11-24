// pages/api/roll.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import type { Prize } from "@/type";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const pool = await supabase.from("prize").select("*").order("index", { ascending: true }).then(res => res.data ?? []);

  if (!pool || pool.length === 0) {
    return NextResponse.json({ error: "No prizes available" }, { status: 500 });
  }

  const chosen = pool[Math.floor(Math.random() * pool.length)];

  return NextResponse.json({ prize: chosen, pool }, { status: 200 });
}
