"use client";

import React, { useRef, useState } from "react";
import { Download, Sparkles, Shield, User, Share2, Check } from "lucide-react";
import { toPng } from "html-to-image";
import confetti from "canvas-confetti";
import { CollaboratorBadge } from "@/lib/mockData";

interface BadgePreviewProps {
  data: Partial<CollaboratorBadge>;
}

export function BadgePreview({ data }: BadgePreviewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayName = data.name && data.name.trim() !== "" ? data.name : "Tu Nombre";
  const displayRole = data.role && data.role.trim() !== "" ? data.role : "Puesto";
  const displayPlant = data.plant && data.plant.trim() !== "" ? data.plant : "Planta / Sede";
  const displayWord = data.word && data.word.trim() !== "" ? data.word.toUpperCase() : "TU PALABRA";
  const displayBadgeId = data.badgeId || "TRITECH-52-0000";

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      // Trigger festive celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#d97706", "#38bdf8", "#f59e0b"],
      });

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        quality: 0.95,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `Insignia-Tritech-52-${displayName.replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error al exportar insignia:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Container for Insignia Card */}
      <div
        ref={cardRef}
        className="w-full max-w-sm rounded-3xl p-6 relative overflow-hidden bg-slate-950 border border-slate-700/80 shadow-2xl shadow-blue-950/50 flex flex-col justify-between aspect-[4/5] selection:bg-none"
        style={{
          background: "radial-gradient(circle at 50% 0%, #1e293b 0%, #090d16 100%)",
        }}
      >
        {/* Metallic Foil Border Effects */}
        <div className="absolute inset-0 border-[2px] border-slate-700/50 rounded-3xl pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Industrial Metal Texture Lines */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #cbd5e1 0, #cbd5e1 1px, transparent 0, transparent 50%)",
            backgroundSize: "10px 10px",
          }}
        />

        {/* Card Header: Brand & Security Seal */}
        <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-amber-500 p-[1px]">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <span className="font-extrabold text-white text-xs">52</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xs tracking-wider uppercase">
                GRUPO TRITECH
              </span>
              <span className="text-[9px] text-amber-400 font-mono tracking-widest">
                INSIGNIA OFICIAL 2026
              </span>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-slate-900 border border-amber-500/40 text-[10px] font-mono text-amber-300 flex items-center gap-1 shadow-inner">
            <Shield className="w-3 h-3 text-amber-400" />
            <span>{displayBadgeId}</span>
          </div>
        </div>

        {/* Card Body: Photo & Name */}
        <div className="relative z-10 my-4 flex flex-col items-center text-center gap-3">
          {/* Avatar Container with Metallic Glow Ring */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-[2px] bg-gradient-to-tr from-blue-500 via-slate-600 to-amber-400 shadow-xl shadow-blue-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[14px] overflow-hidden flex items-center justify-center relative">
                {data.photoUrl ? (
                  // eslint-disable-next-next/no-img-element
                  <img
                    src={data.photoUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 gap-1">
                    <User className="w-10 h-10" />
                    <span className="text-[10px]">Sin foto</span>
                  </div>
                )}
              </div>
            </div>
            {/* Holographic Badge Icon */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-600 border-2 border-slate-900 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Collaborator Details */}
          <div className="flex flex-col gap-1 max-w-xs">
            <h3 className="text-white font-bold text-lg leading-snug line-clamp-1">
              {displayName}
            </h3>
            <p className="text-slate-400 text-xs font-light line-clamp-1">
              {displayRole} • <span className="text-slate-300 font-medium">{displayPlant}</span>
            </p>
          </div>
        </div>

        {/* Card Footer: Highlighted Word */}
        <div className="relative z-10 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 text-center backdrop-blur-md">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
            MI PALABRA TRITECH
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300 uppercase drop-shadow-md">
            &ldquo;{displayWord}&rdquo;
          </div>
        </div>

        {/* Bottom Micro Watermark */}
        <div className="relative z-10 pt-2 flex items-center justify-between text-[9px] text-slate-500 font-mono">
          <span>52 AÑOS DE HISTORIA</span>
          <span>TRITECH CORPORATE</span>
        </div>
      </div>

      {/* Export & Action Buttons */}
      <div className="flex items-center gap-3 w-full max-w-sm">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-semibold text-xs uppercase tracking-wider shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? "Exportando..." : "Descargar Insignia PNG"}</span>
        </button>

        <button
          onClick={handleShare}
          className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all"
          title="Copiar enlace"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
