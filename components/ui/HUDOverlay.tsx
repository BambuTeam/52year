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
  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 sm:p-6 md:p-8 selection:bg-none">

      {/* Top Bar: Brand & Stats */}
      <div className="flex items-center justify-between w-full gap-2">
        {/* Top-Left: Official Logo Floating Pill */}
        <div className="pointer-events-auto flex items-center gap-2.5 sm:gap-3.5 backdrop-blur-2xl bg-slate-950/90 border border-slate-800/90 hover:border-blue-500/50 rounded-full px-3.5 py-2 sm:px-5 sm:py-2.5 shadow-2xl shadow-blue-950/60 transition-all hover:scale-105 group">
          <img
            src="/l_oficial.svg"
            alt="Grupo Tritech Logo Oficial"
            className="h-6 sm:h-8 md:h-9 w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(56,102,242,0.4)] group-hover:scale-105 transition-transform"
          />
          <div className="h-4 sm:h-5 w-px bg-slate-800/90 hidden xs:block" />
          <div className="hidden xs:flex flex-col">
            <span className="text-white font-extrabold tracking-widest text-[8px] sm:text-[10px] uppercase flex items-center gap-1.5">
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
            <strong className="text-amber-400 text-xs sm:text-sm ml-1 font-bold">{wordCount}</strong>
          </span>
        </div>
      </div>

      {/* Selected Word Active Detail Floating Card (with Official History Note) */}
      {selectedWord && (
        <div className="pointer-events-auto self-center bg-slate-950/95 border border-amber-500/60 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl max-w-[92vw] sm:max-w-md w-full text-center flex flex-col items-center gap-2.5 sm:gap-3 animate-in fade-in zoom-in duration-300 my-auto">

          <div className="flex items-center justify-between w-full border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono text-amber-400 uppercase tracking-widest truncate">
              <History className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">
                {selectedWord.id === lastSubmittedWordId
                  ? "★ ÚLTIMA PALABRA SUBIDA ★"
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

      {/* Bottom Floating Control Bar */}
      <div className="pointer-events-auto self-center backdrop-blur-2xl bg-slate-950/90 border border-slate-800/90 rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 shadow-2xl flex items-center gap-2 sm:gap-3 max-w-[96vw] sm:max-w-none">

        {/* Button 1: Add Word */}
        <button
          onClick={onOpenAddModal}
          className="px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-600 text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center gap-1.5 sm:gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Sumar mi Palabra</span>
        </button>

        {/* Button 2: Share Snapshot */}
        <button
          onClick={onOpenShareModal}
          className="px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-slate-900 border border-amber-500/40 hover:border-amber-500 text-amber-300 font-bold text-[10px] sm:text-xs uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
          <span className="hidden xs:inline">Capturar & Compartir</span>
          <span className="xs:hidden">Compartir</span>
        </button>

        {/* Button 3: Reset View */}
        <button
          onClick={onResetSelection}
          className="p-2.5 sm:p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all shrink-0"
          title="Centrar mapa 3D"
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

      </div>

    </div>
  );
}
