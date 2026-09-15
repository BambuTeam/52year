"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, PerspectiveCamera } from "@react-three/drei";
import { Metallic52 } from "./Metallic52";

function CanvasLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs uppercase tracking-widest text-slate-500 font-mono">
        Cargando Núcleo 3D...
      </span>
    </div>
  );
}

export default function EmblemCanvas() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <CanvasLoader />;
  }

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      {/* Subtle background glow effect behind 3D canvas */}
      <div className="absolute inset-0 bg-radial from-blue-600/15 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />

      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={45} />

        {/* Studio Metallic Lighting Setup */}
        <ambientLight intensity={0.6} color="#0f172a" />
        <directionalLight position={[5, 5, 5]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[-5, -5, -2]} intensity={1.8} color="#2563eb" />
        <directionalLight position={[0, -5, 3]} intensity={1.2} color="#10b981" />
        <pointLight position={[0, 0, 4]} intensity={0.8} color="#38bdf8" />

        <Suspense fallback={null}>
          <Metallic52 />
          {/* 100% Offline Procedural Environment */}
          <Environment background={false}>
            <Lightformer form="rect" intensity={4} color="#ffffff" position={[10, 10, 10]} scale={[10, 10, 1]} />
            <Lightformer form="rect" intensity={3} color="#38bdf8" position={[-10, -10, -5]} scale={[10, 10, 1]} />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}
