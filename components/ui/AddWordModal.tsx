"use client";

import React, { useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, User, Building2, MessageSquareQuote, CheckCircle2, Loader2 } from "lucide-react";
import { TritechWord } from "@/lib/wordList";

interface AddWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWord: (wordObj: TritechWord) => void;
}

export function AddWordModal({ isOpen, onClose, onAddWord }: AddWordModalProps) {
  const [message, setMessage] = useState("");
  const [author, setAuthor] = useState("");
  const [department, setDepartment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    if (val.length <= 48) {
      setMessage(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/phrases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: message.trim(),
          author: author.trim() || "Colaborador Tritech",
          department: department.trim() || "Grupo Tritech",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error guardando la frase.");
      }

      const createdPhrase = data.phrase;

      // Pass new 3D word item up to main state
      const newWordObj: TritechWord = {
        id: createdPhrase.id,
        text: createdPhrase.text,
        author: createdPhrase.author,
        plant: createdPhrase.department,
        country: createdPhrase.country,
        position: createdPhrase.position,
        color: createdPhrase.color || "#38bdf8",
        isCustom: true,
      };

      onAddWord(newWordObj);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setMessage("");
        setAuthor("");
        setDepartment("");
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 selection:bg-none">
          {/* Glassmorphism Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
          />

          {/* Holographic Glass Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-lg max-h-[92vh] overflow-y-auto bg-slate-950/80 border border-cyan-400/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.15),inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-2xl overflow-hidden"
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
              className="absolute top-4 right-4 p-2.5 rounded-2xl bg-cyan-950/50 text-cyan-300 hover:text-white border border-cyan-400/30 hover:border-cyan-400/60 transition-all z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 flex flex-col items-center text-center gap-4"
              >
                <div className="w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] animate-bounce">
                  <CheckCircle2 className="w-12 h-12 stroke-[2.2]" />
                </div>
                <h3 className="text-2xl font-mono font-bold text-white tracking-tight">
                  ¡Frase Registrada en la Galaxia!
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xs font-mono">
                  Tu mensaje <strong className="text-cyan-300 font-bold">&ldquo;{message}&rdquo;</strong> se guardó exitosamente y ya orbita con la insignia del 52 Aniversario.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
                <div className="flex flex-col gap-1">
                  <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "8s" }} />
                    CAMPAÑA 52 AÑOS GRUPO TRITECH
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
                    DIGITAR FRASE / CONCEPTO
                  </h3>
                  <p className="text-slate-400 text-xs font-light leading-relaxed">
                    Escribe un mensaje o hito para ser integrado de forma inmediata al universo 3D interactivo.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-mono">
                    {errorMessage}
                  </div>
                )}

                {/* Field 1: Message / Phrase */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold flex items-center gap-1.5">
                      <MessageSquareQuote className="w-4 h-4 text-cyan-400" />
                      Mensaje / Frase <span className="text-cyan-400">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">{message.length}/48</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 52 AÑOS LIDERANDO LA LUBRICACIÓN"
                    value={message}
                    onChange={handleMessageChange}
                    className="w-full px-4 py-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-400/40 text-cyan-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 text-sm sm:text-base font-mono font-bold uppercase tracking-wider transition-all shadow-[inset_0_0_12px_rgba(6,182,212,0.15)]"
                  />
                </div>

                {/* Field 2: Author / Team */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-cyan-400" />
                    Autor / Equipo
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Ing. Carlos Mendoza / Equipo Técnico"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900/60 border border-slate-700/60 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 text-sm transition-all"
                  />
                </div>

                {/* Field 3: Department / Plant */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    Departamento / Planta
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Operaciones Guatemala / Planta Escuintla"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900/60 border border-slate-700/60 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 text-sm transition-all"
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="mt-2 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>REGISTRANDO EN BASE DE DATOS...</span>
                    </>
                  ) : (
                    <span>AGREGAR AL 52 ORBITANTE</span>
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
