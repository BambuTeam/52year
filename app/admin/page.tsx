"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Trash2,
  Search,
  RefreshCw,
  ArrowLeft,
  MessageSquare,
  Building2,
  User,
  Clock,
  CheckCircle2,
  Lock,
  Unlock,
  Sparkles,
} from "lucide-react";
import { SubmittedPhrase } from "@/lib/db";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passError, setPassError] = useState(false);

  const [phrases, setPhrases] = useState<SubmittedPhrase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPhrases = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/phrases?mode=admin");
      const data = await res.json();
      if (data.success) {
        setPhrases(data.phrases);
      }
    } catch (err) {
      console.error("Error fetching admin phrases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPhrases();
    }
  }, [isAuthenticated]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim().toUpperCase() === "TRITECH52" || passcode.trim() === "5252") {
      setIsAuthenticated(true);
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar esta frase del universo 3D?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/phrases?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setPhrases((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(data.error || "No se pudo eliminar la frase.");
      }
    } catch (err) {
      console.error("Error deleting phrase:", err);
      alert("Error eliminando la frase.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPhrases = phrases.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.text.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q)
    );
  });

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#030712] text-slate-100 flex items-center justify-center p-4 selection:bg-none relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-cyan-950/30 via-slate-950 to-black pointer-events-none" />

        <div className="relative z-10 w-full max-w-md bg-slate-950/80 border border-cyan-400/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.2)] backdrop-blur-2xl">
          <div className="hud-corner-tl !border-cyan-400" />
          <div className="hud-corner-tr !border-cyan-400" />
          <div className="hud-corner-bl !border-cyan-400" />
          <div className="hud-corner-br !border-cyan-400" />

          <div className="flex flex-col items-center text-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-mono font-bold uppercase tracking-wider text-white">
              PANEL DE MODERACIÓN TRITECH
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Ingrese la clave de seguridad para administrar las frases subidas.
            </p>
          </div>

          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            {passError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-mono text-center">
                Clave incorrecta. (Sugerencia: TRITECH52)
              </div>
            )}

            <input
              type="password"
              placeholder="CLAVE DE ADMINISTRADOR"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-400/40 text-amber-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 font-mono text-center text-base tracking-widest uppercase transition-all shadow-[inset_0_0_10px_rgba(6,182,212,0.15)]"
            />

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              ACCEDER AL PANEL
            </button>

            <Link
              href="/"
              className="mt-2 text-center text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver al Mapa 3D
            </Link>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 p-4 sm:p-8 font-sans relative selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Top Admin Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-950/80 border border-cyan-400/30 backdrop-blur-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)]">
          <div className="flex items-center gap-3">
            <img src="/l_oficial.svg" alt="Tritech Logo" className="h-8 w-auto filter drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]" />
            <div className="h-6 w-px bg-slate-800 hidden xs:block" />
            <div className="flex flex-col">
              <div className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                PANEL DE ADMINISTRACIÓN Y MODERACIÓN
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                Gestión en Tiempo Real de Frases 3D
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={fetchPhrases}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </button>
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Ver Mapa 3D
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-slate-950/60 border border-cyan-400/20 backdrop-blur-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-400/30 text-cyan-400 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Total Registros</span>
              <strong className="text-2xl font-mono font-bold text-white">{phrases.length}</strong>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-950/60 border border-amber-500/20 backdrop-blur-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Activas en Órbita</span>
              <strong className="text-2xl font-mono font-bold text-amber-400">
                {phrases.filter((p) => p.status === "approved").length}
              </strong>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-950/60 border border-slate-800 backdrop-blur-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Estado de Servidor</span>
              <strong className="text-sm font-mono font-bold text-emerald-400 uppercase">ONLINE & SINCRONIZADO</strong>
            </div>
          </div>
        </div>

        {/* Filter & Table Container */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/80 border border-cyan-400/20 backdrop-blur-2xl flex flex-col gap-4 shadow-xl">
          
          {/* Search Bar */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <Search className="w-4 h-4 text-cyan-400 shrink-0" />
            <input
              type="text"
              placeholder="Buscar por mensaje, autor o departamento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none font-mono"
            />
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Mensaje / Frase</th>
                  <th className="py-3.5 px-4 font-semibold">Autor / Equipo</th>
                  <th className="py-3.5 px-4 font-semibold">Departamento</th>
                  <th className="py-3.5 px-4 font-semibold">Fecha y Hora</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 font-mono">
                      Cargando registros de frases...
                    </td>
                  </tr>
                ) : filteredPhrases.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 font-mono">
                      No se encontraron frases registradas.
                    </td>
                  </tr>
                ) : (
                  filteredPhrases.map((phrase) => (
                    <tr key={phrase.id} className="hover:bg-cyan-950/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-amber-300 text-sm block">
                          &ldquo;{phrase.text}&rdquo;
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {phrase.id}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-200 font-medium">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{phrase.author}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{phrase.department}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{new Date(phrase.timestamp).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDelete(phrase.id)}
                          disabled={deletingId === phrase.id}
                          className="px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-500/50 hover:bg-red-900/80 text-red-300 hover:text-white transition-all inline-flex items-center gap-1.5 text-[11px] font-bold uppercase disabled:opacity-50"
                          title="Eliminar del mapa 3D"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {deletingId === phrase.id ? "Eliminando..." : "Eliminar"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </main>
  );
}
