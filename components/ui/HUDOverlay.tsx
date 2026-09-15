"use client";

import React from "react";
import { Sparkles, PlusCircle, Camera, RotateCcw, ShieldCheck, History, Calendar } from "lucide-react";
import { TritechWord } from "@/lib/wordList";

interface HUDOverlayProps {
  wordCount: number;
  selectedWord: TritechWord | null;
  lastSubmittedWordId?: string;
  onOpenAddModal: () => void;
  onOpenShareModal: () => void;
  onResetSelection: () => void;
}

export function HUDOverlay({
  wordCount,
  selectedWord,
  lastSubmittedWordId,
  onOpenAddModal,
  onOpenShareModal,
  onResetSelection,
}: HUDOverlayProps) {
  const [isLoadingAdd, setIsLoadingAdd] = React.useState(false);

  const handleOpenAdd = () => {
    setIsLoadingAdd(true);
    setTimeout(() => {
      setIsLoadingAdd(false);
      onOpenAddModal();
    }, 250);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 sm:p-6 md:p-8 selection:bg-none">

      {/* Top Bar: Brand & Stats */}
      <div className="flex items-center justify-between w-full gap-2">
        {/* Top-Left: Official Logo Floating Pill */}
        <div className="pointer-events-auto relative flex items-center gap-2.5 sm:gap-3.5 backdrop-blur-2xl bg-slate-950/90 border border-slate-800/90 hover:border-blue-500/50 rounded-full px-3.5 py-2 sm:px-5 sm:py-2.5 shadow-2xl shadow-blue-950/60 transition-all hover:scale-105 group overflow-hidden">
          <img
            src="/l_oficial.svg"
            alt="Grupo Tritech Logo Oficial"
            className="h-6 sm:h-8 md:h-9 w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(56,102,242,0.4)] group-hover:scale-105 transition-transform"
          />
          <div className="h-4 sm:h-5 w-px bg-slate-800/90 hidden xs:block" />
          <div className="hidden xs:flex flex-col">
            <span className="text-white font-extrabold tracking-widest text-[8px] sm:text-[10px] uppercase flex items-center gap-1.5 font-sans">
              52 AÑOS DE HISTORIA
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            </span>
            <span className="text-[8px] sm:text-[9px] text-amber-400 font-mono tracking-widest uppercase">
              1974 - 2026
            </span>
          </div>
        </div>

        {/* Top-Right: Counter Pill */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 backdrop-blur-xl bg-slate-950/80 border border-slate-800 rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 shadow-2xl">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-spin" style={{ animationDuration: "10s" }} />
          <span className="text-[10px] sm:text-xs font-mono text-slate-300">
            <span className="hidden xs:inline">CONCEPTOS 3D:</span>
            <strong className="text-amber-400 text-xs sm:text-sm ml-1 font-mono font-extrabold">{wordCount}</strong>
          </span>
        </div>
      </div>

      {/* Selected Word Active Detail Floating Card (with Official History Note) */}
      {selectedWord && (
        <div className="pointer-events-auto relative self-center bg-slate-950/95 border border-amber-500/60 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl max-w-[92vw] sm:max-w-md w-full text-center flex flex-col items-center gap-2.5 sm:gap-3 animate-in fade-in zoom-in duration-300 my-auto shadow-[0_0_35px_rgba(37,99,235,0.25)]">
          <div className="hud-corner-tl" />
          <div className="hud-corner-tr" />
          <div className="hud-corner-bl" />
          <div className="hud-corner-br" />

          <div className="flex items-center justify-between w-full border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono text-amber-400 uppercase tracking-widest truncate">
              <History className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">
                {selectedWord.id === lastSubmittedWordId
                  ? "★ ÚLTIMA FRASE SUBIDA ★"
                  : "HITO HISTÓRICO TRITECH"}
              </span>
            </div>

            {selectedWord.year ? (
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] sm:text-[10px] font-mono font-bold flex items-center gap-1 shrink-0">
                <Calendar className="w-3 h-3" />
                {selectedWord.year}
              </span>
            ) : selectedWord.id === lastSubmittedWordId ? (
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/50 text-amber-400 text-[9px] sm:text-[10px] font-mono font-bold shrink-0">
                NUEVO APORTE
              </span>
            ) : null}
          </div>

          <div className="text-xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300 uppercase tracking-wider">
            &ldquo;{selectedWord.text}&rdquo;
          </div>

          {selectedWord.historyNote ? (
            <p className="text-[11px] sm:text-xs text-slate-300 font-light leading-relaxed px-2 bg-slate-900/60 p-2.5 sm:p-3 rounded-xl border border-slate-800">
              {selectedWord.historyNote}
            </p>
          ) : selectedWord.author ? (
            <span className="text-[11px] sm:text-xs text-slate-400">
              Aportado por: <strong className="text-white">{selectedWord.author}</strong> ({selectedWord.country || selectedWord.plant})
            </span>
          ) : null}

          <div className="flex items-center gap-2 pt-1 w-full justify-center">
            <button
              onClick={onOpenShareModal}
              className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all shadow-md shadow-blue-600/30"
            >
              Capturar Hito
            </button>
            <button
              onClick={onResetSelection}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-[10px] sm:text-xs"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Bottom Fixed Control Bar (Pinned safely above mobile browser gesture bar with Glassmorphism) */}
      <div className="pointer-events-auto fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 backdrop-blur-2xl bg-black/70 border border-white/15 hover:border-amber-400/50 rounded-2xl p-2.5 sm:px-5 sm:py-3.5 shadow-[0_0_35px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 sm:gap-3.5 w-[94vw] sm:w-auto max-w-md sm:max-w-none transition-all pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        {/* Primary Button: Digitar Frase / Palabra with Loading Ring Feedback */}
        <button
          onClick={handleOpenAdd}
          disabled={isLoadingAdd}
          className="flex-1 sm:flex-initial px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-95 transition-all ring-2 ring-amber-400/40 animate-pulse relative overflow-hidden"
          style={{ animationDuration: "3.5s" }}
        >
          {isLoadingAdd ? (
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <PlusCircle className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          )}
          <span className="whitespace-nowrap">DIGITAR FRASE</span>
        </button>

        {/* Secondary Button: Share Snapshot */}
        <button
          onClick={onOpenShareModal}
          className="px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 hover:scale-[1.03] active:scale-95 transition-all"
        >
          <Camera className="w-4 h-4 text-cyan-400" />
          <span className="hidden xs:inline sm:inline">COMPARTIR</span>
        </button>

        {/* Tertiary Button: Reset View */}
        <button
          onClick={onResetSelection}
          className="p-3 sm:p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white transition-all shrink-0"
          title="Centrar mapa 3D"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
}
