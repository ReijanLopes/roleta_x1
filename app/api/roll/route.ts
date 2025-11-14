// pages/api/roll.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import type { Prize } from "@/type";

const SAMPLE_PRIZES: Prize[] = [
  { id: "p1", description: "Agora você poderá jogar o dobro", name: "Hora dobrada", imageUrl: "/assets/skin.png", color: "#0ea5e9"},
  { id: "p2", description: "Você pode jogar até as 22h sem pagar nada", name: "Noite de Jogatina", imageUrl: "/assets/coupon10.png", color: "#7c3aed" },
  { id: "p3", description: "Não ganha nada", name: "Game Over", imageUrl: "/assets/headset.png", color: "#06b6d4" },
  { id: "p4", description: "jogue quando puder", name: "1h grátis", imageUrl: "/assets/mouse.png", color: "#8b5cf6" },
  { id: "p5", description: "Seu duo recebe 50% de desconto", name: "Com o amigo é mais legal", imageUrl: "/assets/shirt.png", color: "#60a5fa" },
  { id: "p6", description: "Não ganha nada", name: "Rodou na Pista", imageUrl: "/assets/credit.png", color: "#a78bfa" },
  { id: "p7", description: "Não ganha nada", name: "Gol Contra", imageUrl: "/assets/shirt.png", color: "#60a5fa" },
  { id: "p8", description: "Ganha 50% de desconto para jogar mais 1h", name: "Penalidade Máxima", imageUrl: "/assets/credit.png", color: "#a78bfa" },
];


export async function POST(req:NextRequest) {
  const pool = SAMPLE_PRIZES;

  if (!pool || pool.length === 0) {
    return NextResponse.json({ error: "No prizes available" }, { status: 500 });
  }

  const chosen = pool[Math.floor(Math.random() * pool.length)];

  return NextResponse.json({ prize: chosen, pool }, { status: 200 });
}

