import { NextResponse } from "next/server";
import { getApprovedPhrases, getAllPhrases, addPhrase, deletePhrase } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode");

  if (mode === "admin") {
    const phrases = getAllPhrases();
    return NextResponse.json({ success: true, phrases });
  }

  const phrases = getApprovedPhrases();
  return NextResponse.json({ success: true, phrases });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, author, department, country } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { success: false, error: "El campo mensaje / frase es obligatorio." },
        { status: 400 }
      );
    }

    const phrase = addPhrase({
      text,
      author: author || "Colaborador Tritech",
      department: department || "Grupo Tritech",
      country: country || department || "Guatemala",
    });

    return NextResponse.json({ success: true, phrase }, { status: 201 });
  } catch (error) {
    console.error("Error creating phrase:", error);
    return NextResponse.json(
      { success: false, error: "Error interno guardando la frase." },
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
  } catch (error) {
    console.error("Error deleting phrase:", error);
    return NextResponse.json(
      { success: false, error: "Error eliminando la frase." },
      { status: 500 }
    );
  }
}
