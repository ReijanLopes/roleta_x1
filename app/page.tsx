"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import logoX1 from "@/public/logo/LogoColor.png"

import type { Prize } from "../type";


const MAX_CHARS_PER_LINE = 10; // define após quantos caracteres quebrar

function splitTextByLength(text: string, maxLength: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxLength) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);

  return lines;
}

export default function RoulettePage() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [defaultError, setDefaultError] = useState<boolean>(false);
  const [result, setResult] = useState<Prize | null>(null);
  const wheelRef = useRef<SVGSVGElement | null>(null);
  const needleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchPrizes = async () => {
      try {
        const res = await fetch("/api/roll", { method: "POST" });

        if (!res.ok) throw new Error("no prizes endpoint");

        const data: {
          prize: Prize;
          pool: Prize[];
        } = await res.json();

        if (!mounted) return;
        // console.log("Prizes fetched:", data, data.pool ,Array.isArray(data.pool));
        if (Array.isArray(data.pool) && data.pool.length > 0) {
          setPrizes(data.pool);
        } else {
          setDefaultError(true);
        }
      } catch (error) {
        if (!mounted) return;
        setDefaultError(true);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchPrizes();

    // return () => {
    //   mounted = false;
    // };
  }, []);
  // load once

  // compute slice angle for each prize
  const sliceAngle = useMemo(
    () => (prizes.length > 0 ? 360 / prizes.length : 360),
    [prizes]
  );

  // helper to draw SVG arc path (pie slice)
  function polarToCartesian(
    cx: number,
    cy: number,
    r: number,
    angleDeg: number
  ) {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  }

  function describeSlice(
    cx: number,
    cy: number,
    r: number,
    startAngle: number,
    endAngle: number
  ) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
  }

  // perform spin: call /api/roll, then animate wheel to land on prize
  async function handleSpin() {
    if (spinning) return;
    setResult(null);
    setSpinning(true);
    if (wheelRef.current) {
      wheelRef.current.style.transition = "transform 0.5s ease";
      wheelRef.current.style.transform = "rotate(0deg)";
    }
    try {
      const res = await fetch("/api/roll", { method: "POST" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erro no sorteio");
      }
      const data = await res.json();
      // Expect data.prize or full prize object
      const drawn: Prize = data.prize; // tolerate both shapes

      // find index in our prizes list
      const idx = prizes.findIndex((p) => p.id === drawn.id);
      // if not found, try to append the drawn prize at the end so wheel can display it
      let chosenIndex = idx;
      // compute rotation: many full turns + angle to center of chosen slice
      const rounds = 6; // number of full rotations
      // slices are laid out starting at angle 0 at top (-90 deg in SVG). We'll align so that slice center lines with needle at top.
      const sliceCenterAngle = chosenIndex * sliceAngle + sliceAngle / 2; // degrees from 0
      // SVG wheel rotation is clockwise positive, but CSS rotate rotates clockwise positive. We want to rotate negative so that chosen slice moves to top (0deg).
      const target = rounds * 360 + (360 - sliceCenterAngle); // rotate degrees

      if (wheelRef.current) {
        const wheel = wheelRef.current;
        // reset transition to instant before setting transform baseline to avoid jump
        wheel.style.transition = "none";
        // read current transform to keep continuity
        // setTimeout to allow style applied
        requestAnimationFrame(() => {
          wheel.style.transition = "transform 5s cubic-bezier(.17,.67,.34,1)";
          wheel.style.transform = `rotate(${target}deg)`;
        });
      }

      // after animation completes, reveal prize
      setTimeout(() => {
        setResult(drawn);
        setSpinning(false);
        // keep wheel at final position
      }, 5200);
    } catch (err: any) {
      console.error("spin error:", err);
      alert("Erro ao sortear: " + (err?.message ?? "erro desconhecido"));
      setSpinning(false);
    }
  }

  // visual needle bounce animation when spinning
  useEffect(() => {
    if (!needleRef.current) return;
    if (spinning) {
      needleRef.current.animate(
        [
          { transform: "translateY(-2px)" },
          { transform: "translateY(2px)" },
          { transform: "translateY(-2px)" },
        ],
        { duration: 250, iterations: Infinity }
      );
    } else {
      needleRef.current.getAnimations().forEach((a) => a.cancel());
    }
  }, [spinning]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mb-4">Carregando roleta...</div>
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin border-blue-400 mx-auto" />
        </div>
      </div>
    );
  }

  if (defaultError) {
    return (
      <div className="min-h-screen flex items-center justify-center  text-white bg-gradient-to-b from-black via-zinc-900 to-purple-900">
        <div className="flex flex-col p-4 rounded-xl items-center bg-black border border-gray-600">
          <h1>Não existem premios cadastrados 😭</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-full bg-gradient-to-b from-black via-zinc-900 to-purple-900 text-white p-6 flex flex-col items-center">
      <div className="relative">
        {/* Needle */}
        <div
          ref={needleRef}
          className="absolute left-1/2 -translate-x-1/2 -top-4 text-4xl z-20"
          aria-hidden
          style={{ filter: "drop-shadow(0 0 8px rgba(14,165,233,0.9))" }}
        >
          ▼
        </div>
        <div className="absolute left-1/2 -translate-x-[calc(50%+2px)] lg:-translate-x-[calc(50%+4px)] translate-y-1/2 bottom-1/2 text-4xl z-20">
         <Image src={logoX1} alt="Logo da X1" height={60} width={60} className="w-[40px] h-[40px] lg:w-[60px] lg:h-[60px]"/>
        </div>

        {/* Wheel (SVG) */}
        <svg
          ref={wheelRef}
          viewBox="0 0 420 420"
          className="w-[320px] h-[320px] lg:w-[420px] lg:h-[420px] rounded-full shadow-xl block"
          style={{
            transition: "transform 0s",
            transform: "rotate(0deg)",
            display: "block",
            background:
              "radial-gradient(circle at 30% 30%, rgba(99,102,241,0.06), transparent 20%)",
            borderRadius: "9999px",
          }}
        >
          <defs>
            <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* outer ring */}
          <circle
            cx="210"
            cy="210"
            r="200"
            fill="#0b1220"
            stroke="#111827"
            strokeWidth="6"
          />

          {/* slices */}
          {prizes.map((p, i) => {
            const start = i * sliceAngle;
            const end = start + sliceAngle;
            const path = describeSlice(210, 210, 200, start, end);

            // ângulo central do slice
            const textAngle = start + sliceAngle / 2;

            // deixa o texto colado na borda interna (200 é o raio)
            const labelRadius = 170; // ajuste fino: 160–185
            const labelPos = polarToCartesian(210, 210, labelRadius, textAngle);

            const color = p.color ?? (i % 2 === 0 ? "#0ea5e9" : "#7c3aed");

            // evita texto de cabeça para baixo
            const adjustedAngle =
              textAngle > 90 && textAngle < 270 ? textAngle + 180 : textAngle;

            const isBottom = textAngle > 90 && textAngle < 270;

            return (
              <g key={p.id}>
                <path
                  d={path}
                  fill={color}
                  stroke="#020617"
                  strokeWidth="2"
                  style={{ filter: "url(#neon)" }}
                />

                <text
                  fontSize={12}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  style={{ fill: "#0f172a", fontWeight: 700 }}
                  x={labelPos.x}
                  y={labelPos.y}
                  transform={
                    !isBottom
                      ? `rotate(${adjustedAngle} ${labelPos.x} ${labelPos.y})`
                      : `rotate(${adjustedAngle - 180} ${labelPos.x} ${
                          labelPos.y
                        })`
                  }
                >
                  {splitTextByLength(p.name, MAX_CHARS_PER_LINE).map(
                    (line, i) => (
                      <tspan key={i} x={labelPos.x} dy={i === 0 ? 0 : 14}>
                        {line}
                      </tspan>
                    )
                  )}
                </text>
              </g>
            );
          })}

          {/* center circle */}
          <circle
            cx="210"
            cy="210"
            r="62"
            fill="#05060a"
            stroke="#0ea5e9"
            strokeWidth="3"
          />
        </svg>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        <button
          onClick={handleSpin}
          disabled={spinning}
          className="px-6 py-3 rounded-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 shadow-md hover:scale-105 transform transition disabled:opacity-50"
        >
          {spinning ? "Girando..." : "Rodar"}
        </button>

        <a
          href="/terms"
          className="text-sm underline text-zinc-300 self-center"
        >
          Termos do Sorteio
        </a>
      </div>

      {/* Result card */}
      {result && (
        <div className="mt-8 p-6 bg-gradient-to-b from-zinc-900/80 to-black/60 border border-zinc-700 rounded-xl w-full max-w-xl shadow-lg">
          <div className="flex items-center gap-6">
            {/* <img
              src={result.imageUrl ?? "/assets/prize-placeholder.png"}
              alt={result.name}
              className="w-28 h-28 object-cover rounded"
            /> */}
            <div>
              <h2 className="text-2xl font-extrabold neon-text">
                {result.name}
              </h2>
              <p>{result.description}</p>
              <p className="mt-3 text-sm text-zinc-300">
                Parabéns! Este é o prêmio sorteado. Mostre esta tela na loja
                para resgatar o prêmio. Consulte os{" "}
                <a href="/terms" className="underline">
                  termos
                </a>
                .
              </p>
              <div className="mt-3">
                <button
                  onClick={() => {
                    setResult(null);
                    // optionally reset wheel rotation
                    if (wheelRef.current) {
                      wheelRef.current.style.transition = "transform 0.5s ease";
                      // wheelRef.current.style.transform = "rotate(0deg)";
                    }
                  }}
                  className="mt-2 px-4 py-2 rounded bg-zinc-800/80 hover:bg-zinc-700"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .neon-text {
          text-shadow: 0 0 12px rgba(14, 165, 233, 0.9),
            0 0 24px rgba(124, 58, 237, 0.6);
        }
      `}</style>
    </div>
  );
}
