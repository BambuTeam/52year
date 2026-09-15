"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Award } from "lucide-react";
import EmblemCanvas from "../3d/EmblemCanvas";

export function HeroSection() {
  return (
    <section id="inicio" className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden">
      {/* Background Decorative Metallic Grid & Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.18),rgba(255,255,255,0))]" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(to right, #cbd5e1 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating Light Accents */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Typography & Corporate Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 flex flex-col gap-6 text-left"
        >
          {/* Commemorative Tag Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 backdrop-blur-md self-start shadow-xl">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: "8s" }} />
            <span className="text-xs font-mono font-medium text-slate-300 uppercase tracking-widest">
              Aniversario Conmemorativo 1974 - 2026
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
            52 Años que{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300">
              Transforman
            </span>{" "}
            a Grupo Tritech
          </h1>

          {/* Subtitle / Narrative */}
          <p className="text-slate-400 text-lg sm:text-xl font-light leading-relaxed max-w-2xl">
            Celebramos más de cinco décadas de liderazgo industrial, innovación continua y el esfuerzo incansable de miles de colaboradores que mueven a nuestra gran familia.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="#participar"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-600 text-white font-bold text-sm uppercase tracking-wider shadow-2xl shadow-blue-600/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border border-blue-400/30"
            >
              <span>Deja Tu Palabra Clave</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#mosaico"
              className="px-8 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm uppercase tracking-wider backdrop-blur-md transition-all hover:scale-105"
            >
              Explorar Mosaico
            </a>
          </div>

          {/* Key Industrial Indicators Grid */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 max-w-xl">
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-1 font-mono">
                52
                <span className="text-amber-400 text-sm">Años</span>
              </span>
              <span className="text-xs text-slate-400 font-light mt-1">Trayectoria Industrial</span>
            </div>

            <div className="flex flex-col border-l border-slate-800 pl-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-400 flex items-center gap-1 font-mono">
                100%
              </span>
              <span className="text-xs text-slate-400 font-light mt-1">Compromiso Humano</span>
            </div>

            <div className="flex flex-col border-l border-slate-800 pl-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 flex items-center gap-1 font-mono">
                52k+
              </span>
              <span className="text-xs text-slate-400 font-light mt-1">Historias Compartidas</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Interactive 3D Canvas Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:col-span-5 h-[420px] sm:h-[500px] w-full relative flex items-center justify-center"
        >
          {/* Glassmorphic Frame Backdrop */}
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-2xl rounded-3xl border border-slate-800/80 shadow-2xl shadow-blue-950/40 p-4 overflow-hidden">
            <EmblemCanvas />
          </div>

          {/* Floating Metallic Overlay Cards */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -bottom-4 -left-4 sm:left-4 bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-20"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white">Engranaje 3D Interactivo</span>
              <span className="text-[10px] text-slate-400">Mueve el cursor sobre la figura</span>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute -top-4 -right-4 bg-slate-900/90 border border-amber-500/30 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-20"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white">Edición Aniversario</span>
              <span className="text-[10px] text-amber-400/90 font-mono">1974 - 2026</span>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
