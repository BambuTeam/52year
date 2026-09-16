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
    const trimmedText = typeof text === "string" ? text.trim() : "";

    if (!trimmedText) {
      return NextResponse.json(
        { success: false, error: "El campo mensaje / frase es obligatorio." },
        { status: 400 }
      );
    }

    if (trimmedText.length < 3) {
      return NextResponse.json(
        { success: false, error: "El mensaje debe tener al menos 3 caracteres." },
        { status: 400 }
      );
    }

    if (trimmedText.length > 48) {
      return NextResponse.json(
        { success: false, error: "El mensaje no puede exceder los 48 caracteres." },
        { status: 400 }
      );
    }

    // Check for repetitive gibberish (e.g., "aaaaa")
    if (/^(.)\1{4,}$/.test(trimmedText)) {
      return NextResponse.json(
        { success: false, error: "Por favor ingresa un mensaje o concepto válido." },
        { status: 400 }
      );
    }

    const phrase = addPhrase({
      text: trimmedText,
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

