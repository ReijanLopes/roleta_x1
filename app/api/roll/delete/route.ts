// app/api/prizes/delete/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
 // seu client supabase

export async function POST(req: NextRequest) {
  const [supabase, { id }] = await Promise.all([
    createClient(),
    req.json()
  ]);
  try {
    if (!id) {
      return NextResponse.json({ data: {}, message: "ID do prêmio não informado", error: true }, { status: 400 });
    }

    // 1️⃣ Deletar o prêmio
    const { error: deleteError } = await supabase
      .from("prize")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json({ data: {}, message: deleteError.message, error: true }, { status: 500 });
    }

    // 2️⃣ Buscar prêmios restantes
    const { data: remainingPrizes, error: fetchError } = await supabase
      .from("prize")
      .select("*")
      .order("index", { ascending: true });

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // 3️⃣ Reindexar os prêmios restantes
    const updatePromises = remainingPrizes.map((prize, idx) =>
      supabase.from("prize").update({ index: idx + 1 }).eq("id", prize.id)
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      message: "Prêmio deletado e índices atualizados com sucesso!",
      data: remainingPrizes.map((p, idx) => ({ ...p, index: idx + 1 })),
      error: null
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
