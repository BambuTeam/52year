"use client";

import React from "react";
import { Shield, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-slate-800 to-amber-500 p-[1px] flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-white text-xs">52</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-white font-bold text-sm tracking-widest uppercase">
              GRUPO TRITECH
            </span>
            <span className="text-[10px] text-amber-400 font-mono tracking-widest">
              52 AÑOS DE LIDERAZGO INDUSTRIAL • 1974 - 2026
            </span>
          </div>
        </div>

        {/* Center: Commemorative Note */}
        <div className="text-xs text-slate-500 text-center flex items-center gap-1.5 font-mono">
          <span>Diseñado con pasión e innovación para la comunidad Tritech</span>
          <Heart className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
        </div>

        {/* Right: Copyright & Badge Security */}
        <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1 text-slate-400">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            Plataforma Oficial
          </span>
          <span>© 2026 Grupo Tritech.</span>
        </div>

      </div>
    </footer>
  );
}
