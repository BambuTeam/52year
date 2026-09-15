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

  const highlightedWord = selectedWord ? selectedWord.text : "52 AÑOS DE EXCELENCIA";

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#d97706", "#38bdf8"],
      });

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        quality: 0.95,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `Tritech-52-${highlightedWord}.png`;
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="relative z-10 w-full max-w-md max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col items-center gap-5 sm:gap-6"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800 transition-all z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center flex flex-col gap-1">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                TARJETA CONMEMORATIVA PARA REDES
              </span>
              <h3 className="text-xl font-bold text-white">Captura & Compartir</h3>
            </div>

            {/* Social Media Pass Card */}
            <div
              ref={cardRef}
              className="w-full aspect-[4/5] rounded-2xl p-6 relative overflow-hidden bg-slate-950 border border-slate-700/80 shadow-2xl flex flex-col justify-between"
              style={{
                background: "radial-gradient(circle at 50% 20%, #1e293b 0%, #07090e 100%)",
              }}
            >
              {/* Foil Border & Glow */}
              <div className="absolute inset-0 border border-slate-700/50 rounded-2xl pointer-events-none" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Card Header */}
              <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <img
                    src="/l_oficial.svg"
                    alt="Grupo Tritech Logo Oficial"
                    className="h-7 w-auto object-contain filter drop-shadow"
                  />
                </div>

                <div className="px-2 py-0.5 rounded-full bg-slate-900 border border-amber-500/40 text-[9px] font-mono text-amber-300 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-amber-400" />
                  <span>1974 - 2026</span>
                </div>
              </div>

              {/* Center Highlighted Concept */}
              <div className="relative z-10 my-auto text-center flex flex-col gap-3 py-6">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  CONCEPTO DE NUESTROS 52 AÑOS
                </span>
                <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300 uppercase tracking-wider leading-tight">
                  &ldquo;{highlightedWord}&rdquo;
                </div>
                <p className="text-slate-400 text-xs font-light max-w-xs mx-auto">
                  Representando la solidez, liderazgo y el compromiso humano que mueve a Grupo Tritech.
                </p>
              </div>

              {/* Card Footer */}
              <div className="relative z-10 pt-3 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                <span>CONFIANZA • ALIADOS • FUTURO</span>
                <span>EDICIÓN 52 AÑOS</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? "Guardando..." : "Descargar Imagen"}</span>
              </button>

              <button
                onClick={handleShareLink}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all"
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
