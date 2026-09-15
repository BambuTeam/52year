"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Filter, Building2, Tag } from "lucide-react";
import { CollaboratorBadge } from "@/lib/mockData";

interface WordsMosaicProps {
  badges: CollaboratorBadge[];
}

export function WordsMosaic({ badges }: WordsMosaicProps) {
  const [selectedPlant, setSelectedPlant] = useState<string>("TODAS");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const plants = ["TODAS", "Planta Toluca", "Planta Querétaro", "Planta Silao", "Centro de Desarrollo Monterrey", "Sede Corporativa CDMX"];

  const filteredBadges = badges.filter((badge) => {
    const matchesPlant = selectedPlant === "TODAS" || badge.plant === selectedPlant;
    const matchesSearch =
      badge.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badge.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPlant && matchesSearch;
  });

  return (
    <section id="mosaico" className="py-24 relative overflow-hidden bg-slate-950">
      {/* Background Lighting */}
      <div className="absolute inset-0 bg-radial from-blue-950/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono tracking-widest uppercase self-start">
              <Sparkles className="w-3.5 h-3.5" />
              Mosaico Colectivo
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Palabras de Nuestra{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400">
                Comunidad
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-light max-w-xl">
              Explora las palabras registradas por el equipo de Grupo Tritech a lo largo de todas nuestras plantas operativas y centros de innovación.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5">
            <Tag className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-mono text-slate-300">
              TOTAL DE PALABRAS: <strong className="text-white font-extrabold text-sm ml-1">{badges.length}</strong>
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
          
          {/* Plant Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-slate-500 hidden sm:block ml-2 shrink-0" />
            {plants.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPlant(p)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedPlant === p
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold"
                    : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                }`}
              >
                {p === "TODAS" ? "Todas las Plantas" : p}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar palabra o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredBadges.map((badge, idx) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 p-6 backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-blue-950/40 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-slate-300 font-bold text-sm uppercase">
                      {badge.photoUrl ? (
                        // eslint-disable-next-next/no-img-element
                        <img src={badge.photoUrl} alt={badge.name} className="w-full h-full object-cover" />
                      ) : (
                        badge.name.charAt(0)
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-sm line-clamp-1">{badge.name}</span>
                      <span className="text-slate-400 text-xs line-clamp-1">{badge.role}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-amber-400 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                    {badge.badgeId}
                  </span>
                </div>

                {/* Main Highlighted Word */}
                <div className="my-4 p-4 rounded-xl bg-slate-950 border border-slate-850 text-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                    PALABRA CLAVE
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300 uppercase tracking-wide">
                    &ldquo;{badge.word}&rdquo;
                  </div>
                </div>

                {/* Plant Footer */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-3">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    {badge.plant}
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">{badge.createdAt}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredBadges.length === 0 && (
          <div className="text-center py-16 text-slate-500 flex flex-col items-center gap-2">
            <Search className="w-8 h-8 text-slate-600" />
            <p className="text-sm">No se encontraron palabras para los filtros seleccionados.</p>
          </div>
        )}

      </div>
    </section>
  );
}
