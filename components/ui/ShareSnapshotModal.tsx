"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share2, Check, Sparkles, Shield } from "lucide-react";
import { toPng } from "html-to-image";
import confetti from "canvas-confetti";
import { TritechWord } from "@/lib/wordList";

interface ShareSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedWord: TritechWord | null;
}

export function ShareSnapshotModal({ isOpen, onClose, selectedWord }: ShareSnapshotModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aspectFormat, setAspectFormat] = useState<"square" | "story">("square");

  const highlightedWord = selectedWord ? selectedWord.text : "52 AÑOS DE EXCELENCIA";

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#09402c", "#10b981", "#38bdf8"],
      });

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        quality: 0.98,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `Tritech-52-${highlightedWord.replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error al exportar captura:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative z-10 w-full max-w-md max-h-[94vh] overflow-y-auto bg-slate-900/95 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center gap-4 sm:gap-5 backdrop-blur-2xl overflow-hidden"
          >
            {/* Tactical Laser Scanning Line Effect */}
            <div className="laser-scanline" />

            {/* HUD Corner Accents */}
            <div className="hud-corner-tl" />
            <div className="hud-corner-tr" />
            <div className="hud-corner-bl" />
            <div className="hud-corner-br" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800 transition-all z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center flex flex-col gap-1">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                TARJETA CONMEMORATIVA TRITECH 52
              </span>
              <h3 className="text-xl font-bold text-white">Capturar & Compartir Hito</h3>
            </div>

            {/* Format Selector Toggle */}
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px] font-mono">
              <button
                onClick={() => setAspectFormat("square")}
                className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all ${
                  aspectFormat === "square" ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Cuadrado (1:1)
              </button>
              <button
                onClick={() => setAspectFormat("story")}
                className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all ${
                  aspectFormat === "story" ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Historia (9:16)
              </button>
            </div>

            {/* Social Media Pass Card Container */}
            <div
              ref={cardRef}
              className={`w-full rounded-2xl p-5 relative overflow-hidden bg-slate-950 border border-slate-700/80 shadow-2xl flex flex-col justify-between transition-all ${
                aspectFormat === "square" ? "aspect-square" : "aspect-[9/14]"
              }`}
              style={{
                background: "radial-gradient(circle at 50% 25%, #0f172a 0%, #040817 100%)",
              }}
            >
              {/* HUD Inner Frame */}
              <div className="hud-corner-tl" />
              <div className="hud-corner-tr" />
              <div className="hud-corner-bl" />
              <div className="hud-corner-br" />

              {/* Background Glow Orbs */}
              <div className="absolute -top-20 -right-20 w-44 h-44 bg-blue-600/25 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Card Header */}
              <div className="relative z-10 flex items-center justify-between border-b border-slate-800/90 pb-3">
                <div className="flex items-center gap-2">
                  <img
                    src="/l_oficial.svg"
                    alt="Grupo Tritech Logo Oficial"
                    className="h-7 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(56,102,242,0.4)]"
                  />
                </div>

                <div className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/40 text-[9px] font-mono text-emerald-300 font-bold flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span>1974 - 2026</span>
                </div>
              </div>

              {/* Center Highlighted Concept */}
              <div className="relative z-10 my-auto text-center flex flex-col gap-2.5 py-4">
                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1">
                  {selectedWord?.year ? `HITO HISTÓRICO ${selectedWord.year}` : "CONCEPTO DE NUESTROS 52 AÑOS"}
                </span>

                <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-300 uppercase tracking-wider leading-tight px-2">
                  &ldquo;{highlightedWord}&rdquo;
                </div>

                {selectedWord?.historyNote ? (
                  <p className="text-slate-300 text-[10px] sm:text-xs font-light leading-relaxed px-3 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/90 max-w-xs mx-auto">
                    {selectedWord.historyNote}
                  </p>
                ) : selectedWord?.author ? (
                  <p className="text-slate-400 text-[11px] font-mono">
                    Aportado por: <strong className="text-white">{selectedWord.author}</strong> ({selectedWord.country || selectedWord.plant})
                  </p>
                ) : (
                  <p className="text-slate-400 text-[11px] font-light max-w-xs mx-auto">
                    Representando la solidez, liderazgo y compromiso humano que mueven a Grupo Tritech.
                  </p>
                )}
              </div>

              {/* Card Footer */}
              <div className="relative z-10 pt-3 border-t border-slate-800/90 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                <span className="font-semibold text-emerald-400">TRITECH 52 ANIVERSARIO</span>
                <span className="text-slate-500">GRUPO TRITECH</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full pt-1">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? "Exportando..." : "Descargar Imagen PNG"}</span>
              </button>

              <button
                onClick={handleShareLink}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all"
                title="Copiar enlace"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
