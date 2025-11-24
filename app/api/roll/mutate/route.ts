// app/api/roll/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims) {
    return NextResponse.json(
      { data: {}, message: "You must be authenticated to access this route. 🔒", error: true },
      { status: 401 }
    );
  }

  const formData = await req.formData();
  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string | null;
  const description = formData.get("description") as string | null;
  // const imageUrl = formData.get("imageUrl") as string | null;
  const index = formData.get("index") as string | null;
  const color = formData.get("color") as string | null;
  // || !imageUrl
  if (!name || !description  || !index || !color) {
    return NextResponse.json(
      { data: {}, message: "Missing required fields.", error: true },
      { status: 400 }
    );
  }

  try {
    // --- UPDATE ---
    if (id) {
      const { data, error, status } = await supabase
        .from("prize")
        .update({
          name,
          description,
          imageUrl: "",
          index: parseInt(index, 10),
          color,
        })
        .eq("id", id)
        .select('*')
        .single();

      if (error) {
        return NextResponse.json(
          { data: {}, message: error.message, error: true },
          { status }
        );
      }

      return NextResponse.json({ data, error: false }, { status });
    }

    // --- CREATE ---
    const { data, error, status } = await supabase
      .from("prize")
      .insert({
        name,
        description,
        imageUrl: "",
        index: parseInt(index, 10),
        color,
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json(
        { data: {}, message: error.message, error: true },
        { status }
      );
    }

    return NextResponse.json({ data, error: false }, { status });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { data: {}, message: "Internal Server Error", error: true },
      { status: 500 }
    );
  }
}
