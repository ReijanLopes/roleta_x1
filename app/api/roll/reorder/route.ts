import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const [supabase, { items }] = await Promise.all([
    createClient(),
    req.json()
  ]);
  try {
    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { data: {}, message: "Formato inválido: items é obrigatório", error: true },
        { status: 400 }
      );
    }

    // Atualiza cada index de cada prêmio
    const updates = items.map((item) =>
      supabase
        .from("prize")
        .update({ index: item.index })
        .eq("id", item.id)
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { data: {}, message: "Erro interno ao reordenar prêmios", error: true },
      { status: 500 }
    );
  }
}
