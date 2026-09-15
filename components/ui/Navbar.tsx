"use client";

import React, { useState } from "react";
import { Shield, Sparkles, Volume2, VolumeX, Menu, X } from "lucide-react";

export function Navbar() {
  const [muted, setMuted] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto backdrop-blur-xl bg-slate-950/70 border border-slate-800/80 rounded-2xl px-6 py-3 shadow-2xl flex items-center justify-between">
        
        {/* Brand Logo & Anniversary Emblem */}
        <a href="#" className="flex items-center gap-3 group px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800/80 hover:border-blue-500/40 backdrop-blur-xl transition-all">
          <img
            src="/l_oficial.svg"
            alt="Grupo Tritech Logo Oficial"
            className="h-7 sm:h-8 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(56,102,242,0.3)] group-hover:scale-105 transition-transform"
          />
          <div className="h-5 w-px bg-slate-800" />
          <span className="text-[10px] text-amber-400 font-mono tracking-widest uppercase">
            52 AÑOS DE EXCELENCIA
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a
            href="#inicio"
            className="hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            Inicio
          </a>
          <a
            href="#participar"
            className="hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            52 Palabras
          </a>
          <a
            href="#insignia"
            className="hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            Generador de Insignias
          </a>
          <a
            href="#mosaico"
            className="hover:text-blue-400 transition-colors"
          >
            Mosaico Colectivo
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMuted(!muted)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all flex items-center gap-2 text-xs font-mono"
            title={muted ? "Activar audio ambiental" : "Silenciar audio"}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
            <span className="hidden sm:inline">{muted ? "MUTE" : "AUDIO"}</span>
          </button>

          <a
            href="#participar"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-xs uppercase tracking-wider hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
          >
            Participar Ahora
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden mt-2 p-6 rounded-2xl bg-slate-950/95 border border-slate-800 backdrop-blur-2xl flex flex-col gap-4 text-slate-200 text-sm">
          <a
            href="#inicio"
            onClick={() => setMobileOpen(false)}
            className="py-2 hover:text-blue-400 border-b border-slate-900"
          >
            Inicio
          </a>
          <a
            href="#participar"
            onClick={() => setMobileOpen(false)}
            className="py-2 hover:text-blue-400 border-b border-slate-900 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            52 Palabras que Mueven a Tritech
          </a>
          <a
            href="#insignia"
            onClick={() => setMobileOpen(false)}
            className="py-2 hover:text-blue-400 border-b border-slate-900 flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-blue-400" />
            Generador de Insignias
          </a>
          <a
            href="#mosaico"
            onClick={() => setMobileOpen(false)}
            className="py-2 hover:text-blue-400"
          >
            Mosaico Colectivo
          </a>
        </div>
      )}
    </header>
  );
}
