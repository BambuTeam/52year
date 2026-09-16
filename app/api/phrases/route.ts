import { NextResponse } from "next/server";
import { getApprovedPhrases, getAllPhrases, addPhrase, deletePhrase } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    if (mode === "admin") {
      const phrases = getAllPhrases();
      return NextResponse.json({ success: true, phrases });
    }

    const phrases = getApprovedPhrases();
    return NextResponse.json({ success: true, phrases });
  } catch (error: any) {
    console.error("Error fetching phrases:", error);
    return NextResponse.json(
      { success: false, error: "Error obteniendo las frases.", details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Formato JSON de solicitud inválido." },
        { status: 400 }
      );
    }

    const { text, author, department, country } = body || {};

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { success: false, error: "El campo mensaje / frase es obligatorio." },
        { status: 400 }
      );
    }

    const phrase = addPhrase({
      text: text.trim(),
      author: typeof author === "string" ? author : "Colaborador Tritech",
      department: typeof country === "string" ? country : department || "Guatemala",
      country: typeof country === "string" ? country : department || "Guatemala",
    });

    return NextResponse.json({ success: true, phrase }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating phrase:", error);
    return NextResponse.json(
      { success: false, error: "Error interno guardando la frase.", details: error?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Parámetro ID faltante." },
        { status: 400 }
      );
    }

    const removed = deletePhrase(id);
    if (!removed) {
      return NextResponse.json(
        { success: false, error: "Frase no encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("Error deleting phrase:", error);
    return NextResponse.json(
      { success: false, error: "Error eliminando la frase.", details: error?.message },
      { status: 500 }
    );
  }
}

