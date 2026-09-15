"use client";

import React, { useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, User, Globe, CheckCircle2 } from "lucide-react";
import { TritechWord } from "@/lib/wordList";

interface AddWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWord: (wordObj: TritechWord) => void;
}

export function AddWordModal({ isOpen, onClose, onAddWord }: AddWordModalProps) {
  const [wordText, setWordText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [country, setCountry] = useState("Guatemala");
  const [success, setSuccess] = useState(false);

  const countriesList = [
    "Guatemala",
    "El Salvador",
    "Costa Rica",
    "México",
    "Colombia",
    "Nicaragua",
    "Honduras",
    "Panamá",
    "República Dominicana",
  ];

  const handleWordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s+/g, "").toUpperCase();
    if (val.length <= 20) {
      setWordText(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordText.trim()) return;

    // Random orbit radius & angle for newly added custom words
    const angle = Math.random() * Math.PI * 2;
    const radius = 3.5 + Math.random() * 2;
    const z = (Math.random() - 0.5) * 2;

    const newWordObj: TritechWord = {
      id: `custom-${Date.now()}`,
      text: wordText.trim(),
      author: authorName.trim() || "Colaborador Tritech",
      plant: country,
      country: country,
      position: [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.8, z],
      color: "#f59e0b", // Gold highlight for user contributed words
      size: 1.3,
      isCustom: true,
    };

    onAddWord(newWordObj);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      setWordText("");
      setAuthorName("");
      onClose();
    }, 1500);
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
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative z-10 w-full max-w-lg max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {success ? (
              <div className="py-8 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">¡Palabra Integrada al 52!</h3>
                <p className="text-slate-400 text-xs">
                  Tu palabra <strong className="text-amber-400">&ldquo;{wordText}&rdquo;</strong> ({country}) ahora orbita en el mapa 3D conmemorativo de Grupo Tritech.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                
                <div className="flex flex-col gap-1">
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
                    <Sparkles className="w-4 h-4" />
                    CAMPAÑA 52 AÑOS TRITECH
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Suma tu Palabra al Mapa 3D
                  </h3>
                  <p className="text-slate-400 text-xs font-light">
                    Escribe la palabra que representa los 52 años de trayectoria y tu experiencia en Tritech.
                  </p>
                </div>

                {/* Field 1: Word */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                      Tu Palabra Clave (1 sola palabra) <span className="text-amber-400">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">{wordText.length}/20</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ej. CONFIANZA, ALIADOS, FUTURO"
                    value={wordText}
                    onChange={handleWordChange}
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-amber-500/50 text-amber-300 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 text-base font-extrabold uppercase tracking-widest transition-all"
                  />
                </div>

                {/* Field 2: Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    Tu Nombre (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Ing. Carlos Mendoza"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 text-sm transition-all"
                  />
                </div>

                {/* Field 3: Country */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-400" />
                    País de Operación
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 text-sm transition-all"
                  >
                    {countriesList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="mt-2 w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  Agregar al 52 Orbitante
                </button>

              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
