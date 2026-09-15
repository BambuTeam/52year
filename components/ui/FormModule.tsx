"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { User, Building, Sparkles, Upload, CheckCircle2, ShieldCheck } from "lucide-react";
import { BadgePreview } from "./BadgePreview";
import { CollaboratorBadge } from "@/lib/mockData";
import { generateBadgeId } from "@/lib/utils";

interface FormModuleProps {
  onAddBadge: (badge: CollaboratorBadge) => void;
}

export function FormModule({ onAddBadge }: FormModuleProps) {
  const [formData, setFormData] = useState<Partial<CollaboratorBadge>>({
    name: "",
    role: "",
    plant: "Planta Toluca",
    word: "",
    photoUrl: "",
    badgeId: "TRITECH-52-5200",
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, badgeId: generateBadgeId() }));
  }, []);

  const [submitted, setSubmitted] = useState(false);

  const plantsList = [
    "Planta Toluca",
    "Planta Querétaro",
    "Planta Silao",
    "Centro de Desarrollo Monterrey",
    "Sede Corporativa CDMX",
    "Planta Guadalajara",
  ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWordChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Clean and restrict to a single word (no spaces allowed)
    const val = e.target.value.replace(/\s+/g, "").toUpperCase();
    if (val.length <= 20) {
      setFormData((prev) => ({ ...prev, word: val }));
    }
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.word) return;

    const newBadge: CollaboratorBadge = {
      id: Date.now().toString(),
      name: formData.name,
      role: formData.role || "Colaborador Tritech",
      plant: formData.plant || "Sede Corporativa",
      word: formData.word,
      photoUrl: formData.photoUrl,
      badgeId: formData.badgeId || generateBadgeId(),
      createdAt: new Date().toISOString().split("T")[0],
    };

    onAddBadge(newBadge);
    setSubmitted(true);
  };

  return (
    <section id="participar" className="py-24 relative overflow-hidden bg-slate-950/60 border-y border-slate-800/80">
      {/* Glow overlays */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Módulo de Participación
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            52 Palabras que Mueven a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-300">
              Tritech
            </span>
          </h2>

          <p className="text-slate-400 text-base sm:text-lg font-light">
            Escribe la palabra clave que define tu trayectoria en Grupo Tritech. Tu voz formará parte de la insignia conmemorativa y del mosaico histórico de los 52 Años.
          </p>
        </div>

        {/* Interactive Grid: Form on Left, Live Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl"
          >
            {submitted ? (
              <div className="py-12 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">¡Gracias por ser parte de la Historia!</h3>
                <p className="text-slate-400 text-sm max-w-md">
                  Tu palabra <strong className="text-blue-400">&ldquo;{formData.word}&rdquo;</strong> ha sido registrada en el mosaico colectivo de Grupo Tritech.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  Crear otra Insignia
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* Field 1: Full Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    Nombre Completo <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Ej. Ing. Laura Fernández"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                  />
                </div>

                {/* Field 2 & 3: Role & Plant Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Building className="w-4 h-4 text-blue-400" />
                      Puesto / Cargo
                    </label>
                    <input
                      type="text"
                      name="role"
                      placeholder="Ej. Especialista de Calidad"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      Planta / Sede
                    </label>
                    <select
                      name="plant"
                      value={formData.plant}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                    >
                      {plantsList.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Field 4: Single Key Word */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Tu Palabra Clave (1 sola palabra) <span className="text-amber-400">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">
                      {formData.word?.length || 0}/20
                    </span>
                  </div>
                  <input
                    type="text"
                    name="word"
                    required
                    placeholder="Ej. INNOVACIÓN, FAMILIA, EXCELENCIA"
                    value={formData.word}
                    onChange={handleWordChange}
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-300 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-base font-extrabold uppercase tracking-widest transition-all"
                  />
                  <p className="text-[11px] text-slate-500 font-light">
                    * Ingresa una única palabra en mayúsculas que exprese lo que significa Tritech para ti.
                  </p>
                </div>

                {/* Field 5: Optional Photo Upload */}
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-blue-400" />
                    Fotografía de Perfil (Opcional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload-input"
                    />
                    <label
                      htmlFor="photo-upload-input"
                      className="w-full py-4 px-4 rounded-xl bg-slate-950 border border-dashed border-slate-700 hover:border-blue-500 flex items-center justify-center gap-3 cursor-pointer text-slate-400 hover:text-white transition-all text-xs font-mono"
                    >
                      <Upload className="w-4 h-4 text-slate-400" />
                      <span>
                        {formData.photoUrl ? "Cambiar Fotografía Cargada" : "Haz clic para subir tu foto (JPG / PNG)"}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="mt-4 w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-amber-500 text-white font-bold text-sm uppercase tracking-wider shadow-2xl shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  Generar Insignia y Unirse al Mosaico
                </button>

              </form>
            )}
          </motion.div>

          {/* Real-time Badge Preview on Right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col items-center"
          >
            <div className="mb-4 text-center">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                VISTA PREVIA EN TIEMPO REAL
              </span>
            </div>
            <BadgePreview data={formData} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
