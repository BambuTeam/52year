"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { OrbitingWords3D } from "./OrbitingWords3D";
import { TritechWord } from "@/lib/wordList";

interface WordCloud52CanvasProps {
  words: TritechWord[];
  onSelectWord: (word: TritechWord) => void;
  selectedWordId?: string;
  lastSubmittedWordId?: string;
}

function ResponsiveCameraController() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / size.height;
    if (camera instanceof THREE.PerspectiveCamera) {
      if (aspect < 0.75) {
        // Narrow mobile portrait (iPhone / Android portrait)
        camera.position.set(0, 0, 16.5);
        camera.fov = 55;
      } else if (aspect < 1.0) {
        // Mobile / Tablet portrait
        camera.position.set(0, 0, 14.2);
        camera.fov = 50;
      } else if (aspect < 1.3) {
        // Small laptop / tablet landscape
        camera.position.set(0, 0, 12.2);
        camera.fov = 48;
      } else {
        // Desktop / 4K monitors
        camera.position.set(0, 0, 10.8);
        camera.fov = 45;
      }
      camera.updateProjectionMatrix();
    }
  }, [camera, size]);

  return null;
}

export function WordCloud52Canvas({
  words,
  onSelectWord,
  selectedWordId,
  lastSubmittedWordId,
}: WordCloud52CanvasProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2 bg-[#07090e]">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs uppercase tracking-widest font-mono text-slate-500">
          Iniciando Universo 3D Tritech 52...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing touch-none select-none">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-radial from-blue-900/20 via-transparent to-transparent pointer-events-none blur-3xl" />

      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 11]} fov={45} />
        <ResponsiveCameraController />

        {/* Ambient & Studio Directional Lights */}
        <ambientLight intensity={0.7} color="#0f172a" />
        <directionalLight position={[10, 12, 10]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1.8} color="#3b82f6" />
        <directionalLight position={[0, -10, 8]} intensity={1.5} color="#10b981" />
        <pointLight position={[0, 0, 4]} intensity={1.2} color="#38bdf8" />

        <Suspense fallback={null}>
          <OrbitingWords3D
            words={words}
            onSelectWord={onSelectWord}
            selectedWordId={selectedWordId}
            lastSubmittedWordId={lastSubmittedWordId}
          />
          {/* 100% Offline Procedural Metallic Environment Map */}
          <Environment background={false}>
            <Lightformer form="rect" intensity={5} color="#ffffff" position={[10, 10, 10]} scale={[12, 12, 1]} />
            <Lightformer form="rect" intensity={3} color="#38bdf8" position={[-10, -10, -5]} scale={[10, 10, 1]} />
            <Lightformer form="ring" intensity={3} color="#10b981" position={[0, -10, 8]} scale={[8, 8, 1]} />
            <Lightformer form="circle" intensity={4} color="#ffffff" position={[0, 10, -10]} scale={[14, 14, 1]} />
          </Environment>
        </Suspense>

        <OrbitControls
          enableZoom={true}
          maxDistance={25}
          minDistance={4}
          enablePan={false}
          rotateSpeed={0.6}
          autoRotate={false}
          touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
        />
      </Canvas>
    </div>
  );
}
