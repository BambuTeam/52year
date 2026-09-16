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
        {/* Top-Left: Elevated Official Tritech Corporate Logo Pill */}
        <div className="pointer-events-auto relative flex items-center gap-3 sm:gap-4 backdrop-blur-2xl bg-slate-950/90 border border-cyan-400/40 hover:border-cyan-400/80 rounded-full px-4 py-2.5 sm:px-6 sm:py-3.5 shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all hover:scale-[1.03] group overflow-hidden">
          <img
            src="/l_oficial.svg"
            alt="Grupo Tritech Logo Oficial"
            className="h-8 sm:h-10 md:h-12 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(6,182,212,0.5)] group-hover:scale-105 transition-transform"
          />
          <div className="h-5 sm:h-7 w-px bg-cyan-400/30 hidden xs:block" />
          <div className="hidden xs:flex flex-col">
            <span className="text-white font-extrabold tracking-widest text-[9px] sm:text-[11px] uppercase flex items-center gap-1.5 font-sans">
              52 AÑOS DE HISTORIA
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
            </span>
            <span className="text-[9px] sm:text-[10px] text-emerald-400 font-mono tracking-widest uppercase font-bold">
              1974 - 2026
            </span>
          </div>
        </div>

        {/* Top-Right: Counter Pill */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 backdrop-blur-xl bg-slate-950/80 border border-slate-800 rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 shadow-2xl">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 animate-spin" style={{ animationDuration: "10s" }} />
          <span className="text-[10px] sm:text-xs font-mono text-slate-300">
            <span className="hidden xs:inline">CONCEPTOS 3D:</span>
            <strong className="text-cyan-300 text-xs sm:text-sm ml-1 font-mono font-extrabold">{wordCount}</strong>
          </span>
        </div>
      </div>

      {/* Selected Word Active Detail Floating Card / Responsive Milestone Modal */}
      {selectedWord && (
        <div className="pointer-events-auto relative self-center bg-slate-950/95 border border-cyan-400/50 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_0_40px_rgba(6,182,212,0.25)] max-w-sm w-[92vw] sm:max-w-md text-center flex flex-col items-center gap-2.5 sm:gap-3 animate-in fade-in zoom-in duration-300 my-auto max-h-[70vh] sm:max-h-[80vh] overflow-y-auto overflow-x-hidden selection:bg-none">
          <div className="hud-corner-tl !border-cyan-400" />
          <div className="hud-corner-tr !border-cyan-400" />
          <div className="hud-corner-bl !border-cyan-400" />
          <div className="hud-corner-br !border-cyan-400" />

          {/* Quick Top-Right Close Button */}
          <button
            onClick={onResetSelection}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-400 hover:text-white hover:border-cyan-400/60 transition-all z-20"
            title="Cerrar modal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center justify-between w-full border-b border-slate-800/90 pb-2 pr-7">
            <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono text-cyan-400 uppercase tracking-widest truncate">
              <History className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-cyan-400" />
              <span className="truncate">
                {selectedWord.id === lastSubmittedWordId
                  ? "★ ÚLTIMA FRASE SUBIDA ★"
                  : "HITO HISTÓRICO TRITECH"}
              </span>
            </div>

            {selectedWord.year ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] sm:text-[10px] font-mono font-bold flex items-center gap-1 shrink-0">
                <Calendar className="w-3 h-3" />
                {selectedWord.year}
              </span>
            ) : selectedWord.id === lastSubmittedWordId ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-[9px] sm:text-[10px] font-mono font-bold shrink-0">
                NUEVO APORTE
              </span>
            ) : null}
          </div>

          <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-emerald-300 uppercase tracking-wider leading-tight">
            &ldquo;{selectedWord.text}&rdquo;
          </div>

          {selectedWord.historyNote ? (
            <p className="text-[11px] sm:text-xs text-slate-300 font-light leading-relaxed px-2 bg-slate-900/70 p-2.5 sm:p-3 rounded-xl border border-slate-800/80 w-full text-left">
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
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              Capturar Hito
            </button>
            <button
              onClick={onResetSelection}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-[10px] sm:text-xs font-mono"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Bottom Fixed Control Bar: Spacecraft Command Strip with Low-Profile Perimeter Glow & Mobile Safe Area */}
      <div className="pointer-events-auto fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 backdrop-blur-2xl bg-cyan-950/30 border border-cyan-400/30 hover:border-cyan-400/60 rounded-3xl p-2 sm:px-5 sm:py-3 shadow-[0_0_20px_rgba(6,182,212,0.18),inset_0_1px_1px_rgba(255,255,255,0.12)] flex items-center justify-center gap-2 sm:gap-3.5 w-[94vw] sm:w-auto max-w-md sm:max-w-none transition-all pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="hud-corner-tl !border-cyan-400/70" />
        <div className="hud-corner-tr !border-cyan-400/70" />
        <div className="hud-corner-bl !border-cyan-400/70" />
        <div className="hud-corner-br !border-cyan-400/70" />

        {/* Spacecraft Telemetry Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-[9px] font-mono text-cyan-300 tracking-wider uppercase mr-1 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          COMMAND STRIP
        </div>

        {/* Primary Button: Digitar Frase / Palabra with Loading Ring Feedback */}
        <button
          onClick={handleOpenAdd}
          disabled={isLoadingAdd}
          className="flex-1 sm:flex-initial px-5 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-95 transition-all ring-2 ring-cyan-400/40 relative overflow-hidden"
        >
          {isLoadingAdd ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <PlusCircle className="w-4 h-4 text-white stroke-[2.5]" />
          )}
          <span className="whitespace-nowrap">DIGITAR FRASE</span>
        </button>

        {/* Secondary Button: Share Snapshot */}
        <button
          onClick={onOpenShareModal}
          className="px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-slate-900/80 border border-cyan-400/30 hover:border-cyan-400 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-cyan-950/50 hover:scale-[1.03] active:scale-95 transition-all shadow-[inset_0_0_10px_rgba(6,182,212,0.15)]"
        >
          <Camera className="w-4 h-4 text-cyan-400" />
          <span className="hidden xs:inline sm:inline">COMPARTIR</span>
        </button>

        {/* Tertiary Button: Reset View */}
        <button
          onClick={onResetSelection}
          className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/60 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/40 hover:bg-cyan-950/40 transition-all shrink-0"
          title="Centrar mapa 3D"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
}
