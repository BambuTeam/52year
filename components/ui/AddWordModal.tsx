"use client";

import React, { useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, User, Globe, MessageSquareQuote, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { TritechWord, SAFE_TRITECH_PHRASES } from "@/lib/wordList";

interface AddWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWord: (wordObj: TritechWord) => void;
}

export function AddWordModal({ isOpen, onClose, onAddWord }: AddWordModalProps) {
  const [message, setMessage] = useState("");
  const [author, setAuthor] = useState("");
  const [country, setCountry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    if (val.length <= 48) {
      setMessage(val);
    }
  };

  const handleSelectSafePhrase = (phrase: string) => {
    setMessage(phrase);
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanText = message.trim();
    if (!cleanText) return;

    if (cleanText.length < 3) {
      setErrorMessage("El mensaje debe tener al menos 3 caracteres.");
      return;
    }

    if (/^(.)\1{4,}$/.test(cleanText)) {
      setErrorMessage("Por favor elige una palabra de la lista sugerida o escribe un concepto válido.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/phrases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: cleanText,
          author: author.trim() || "Colaborador Tritech",
          country: country.trim() || "Guatemala",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error guardando el mensaje.");
      }

      const createdPhrase = data.phrase;

      // Pass new 3D word item up to main state with distinctive Golden Amber color (#fbbf24)
      const newWordObj: TritechWord = {
        id: createdPhrase.id,
        text: createdPhrase.text,
        author: createdPhrase.author,
        plant: createdPhrase.country || createdPhrase.department || "Guatemala",
        country: createdPhrase.country || "Guatemala",
        position:
          createdPhrase.position &&
          Array.isArray(createdPhrase.position) &&
          createdPhrase.position.length === 3
            ? createdPhrase.position
            : [7.2, 1.8, 0.5],
        color: createdPhrase.color || "#fbbf24", // Exclusive Golden Amber Glow for custom user messages
        isCustom: true,
      };

      onAddWord(newWordObj);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setMessage("");
        setAuthor("");
        setCountry("");
        setIsSubmitting(false);
        onClose();
      }, 1600);
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMessage(err.message || "No se pudo enviar el mensaje.");
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 selection:bg-none">
          {/* Glassmorphism Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-xl"
          />

          {/* Holographic Glass Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-950/90 border border-cyan-400/35 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(6,182,212,0.18),inset_0_1px_1px_rgba(255,255,255,0.12)] backdrop-blur-2xl"
          >
            {/* Tactical Scanline */}
            <div className="laser-scanline" />

            {/* Cyan HUD Corner Markers */}
            <div className="hud-corner-tl !border-cyan-400/70" />
            <div className="hud-corner-tr !border-cyan-400/70" />
            <div className="hud-corner-bl !border-cyan-400/70" />
            <div className="hud-corner-br !border-cyan-400/70" />

            {/* Soft Cyan Background Radial Glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Action Button */}
            <button
              onClick={onClose}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 sm:p-2.5 rounded-2xl bg-cyan-950/50 text-cyan-300 hover:text-white border border-cyan-400/30 hover:border-cyan-400/60 transition-all z-20"
              title="Cerrar ventana"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 sm:py-10 flex flex-col items-center text-center gap-4"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.4)] animate-bounce">
                  <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight">
                  ¡Mensaje Registrado en la Galaxia!
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xs font-mono">
                  Tu mensaje <strong className="text-amber-300 font-bold">&ldquo;{message}&rdquo;</strong> se guardó exitosamente y ya orbita con resplandor dorado en la galaxia Tritech.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
                <div className="flex flex-col gap-1 pr-6">
                  <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "8s" }} />
                    CAMPAÑA 52 AÑOS GRUPO TRITECH
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight font-sans">
                    DIGITAR MENSAJE / CONCEPTO
                  </h3>
                  <p className="text-slate-400 text-xs font-light leading-relaxed">
                    Selecciona una palabra segura sugerida o escribe tu concepto conmemorativo.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-mono">
                    {errorMessage}
                  </div>
                )}

                {/* Field 1: Message / Phrase (Max 48 chars) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold flex items-center gap-1.5">
                      <MessageSquareQuote className="w-4 h-4 text-cyan-400 shrink-0" />
                      Mensaje / Frase <span className="text-cyan-400">*</span>
                    </label>
                    <span
                      className={`text-[10px] font-mono ${
                        message.length >= 44 ? "text-amber-400 font-bold" : "text-slate-500"
                      }`}
                    >
                      {message.length}/48
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={48}
                    placeholder="Ej. 52 AÑOS LIDERANDO LA LUBRICACIÓN"
                    value={message}
                    onChange={handleMessageChange}
                    className="w-full px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-400/40 text-cyan-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 text-sm sm:text-base font-mono font-bold uppercase tracking-wider transition-all shadow-[inset_0_0_12px_rgba(6,182,212,0.15)]"
                  />
                </div>

                {/* Safe Words Quick-Select Section */}
                <div className="flex flex-col gap-2 p-3 rounded-2xl bg-cyan-950/30 border border-cyan-400/20">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-300 uppercase font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>PALABRAS / FRASES SEGURAS SUGERIDAS (CLIC PARA ELEGIR):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1 scrollbar-thin">
                    {SAFE_TRITECH_PHRASES.map((safePhrase) => {
                      const isSelected = message === safePhrase;
                      return (
                        <button
                          key={safePhrase}
                          type="button"
                          onClick={() => handleSelectSafePhrase(safePhrase)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-mono transition-all ${
                            isSelected
                              ? "bg-amber-500 text-slate-950 font-bold border border-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                              : "bg-slate-900/80 text-cyan-200 border border-cyan-400/20 hover:border-cyan-400/60 hover:bg-cyan-900/40"
                          }`}
                        >
                          {safePhrase}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Field 2: Author / Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-cyan-400 shrink-0" />
                    Autor / Nombre y Apellido
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Ing. Carlos Mendoza"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-slate-900/60 border border-slate-700/60 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 text-sm transition-all"
                  />
                </div>

                {/* Field 3: Country */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                    País
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Guatemala, México, El Salvador..."
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-slate-900/60 border border-slate-700/60 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 text-sm transition-all"
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="mt-1 sm:mt-2 w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm uppercase tracking-widest shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>REGISTRANDO MENSAJE...</span>
                    </>
                  ) : (
                    <span>AGREGAR MENSAJE</span>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

