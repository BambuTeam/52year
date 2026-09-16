"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { OrbitingWords3D } from "./OrbitingWords3D";
import { TritechWord } from "@/lib/wordList";

interface WordCloud52CanvasProps {
  words: TritechWord[];
  onSelectWord: (word: TritechWord) => void;
  selectedWordId?: string;
  lastSubmittedWordId?: string;
  powerUpTimestamp?: number;
}

function CinematicIntroController({
  onProgress,
  onComplete,
}: {
  onProgress: (progress: number) => void;
  onComplete: () => void;
}) {
  const { camera, size } = useThree();
  const startTimeRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  useFrame((state) => {
    if (completedRef.current) return;

    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.getElapsedTime();
    }

    const elapsed = state.clock.getElapsedTime() - startTimeRef.current;
    const duration = 4.8; // 4.8-second Hollywood-style slow cinematic zoom-out
    const progress = Math.min(1, elapsed / duration);
    onProgress(progress);

    const aspect = size.width / size.height;
    const targetZ = aspect < 0.75 ? 16.2 : aspect < 1.0 ? 15.6 : 15.0;
    const targetFov = aspect < 0.75 ? 58 : aspect < 1.0 ? 54 : 48;

    if (elapsed < duration) {
      // Buttery-smooth ease-out cubic curve
      const ease = 1 - Math.pow(1 - progress, 3);

      camera.position.z = THREE.MathUtils.lerp(4.5, targetZ, ease);
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = targetFov;
        camera.updateProjectionMatrix();
      }
    } else {
      camera.position.z = targetZ;
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = targetFov;
        camera.updateProjectionMatrix();
      }
      completedRef.current = true;
      onComplete();
    }
  });

  return null;
}

function SelectedWordCameraController({ hasSelectedWord }: { hasSelectedWord: boolean }) {
  const { camera, size } = useThree();

  useFrame((_, delta) => {
    const aspect = size.width / size.height;
    if (aspect < 1.0) {
      // Mobile portrait safe framing when a modal is open
      const targetY = hasSelectedWord ? 0.75 : 0;
      const targetZ = hasSelectedWord ? 16.8 : 15.6;
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 4, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 4, delta);
    } else {
      // Desktop framing
      const targetY = hasSelectedWord ? 0.35 : 0;
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 4, delta);
    }
  });

  return null;
}

export function WordCloud52Canvas({
  words,
  onSelectWord,
  selectedWordId,
  lastSubmittedWordId,
  powerUpTimestamp,
}: WordCloud52CanvasProps) {
  const [mounted, setMounted] = useState(false);
  const [introProgress, setIntroProgress] = useState(0);
  const [introCompleted, setIntroCompleted] = useState(false);

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
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing touch-none select-none bg-gradient-to-b from-[#03050c] via-[#070b1e] to-[#020307]">
      {/* 2050.earth Atmospheric Deep Space Radial Glow */}
      <div className="absolute inset-0 bg-radial from-cyan-950/25 via-blue-950/10 to-transparent pointer-events-none blur-3xl" />

      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 4.5]} fov={48} />
        <CinematicIntroController
          onProgress={setIntroProgress}
          onComplete={() => setIntroCompleted(true)}
        />
        {introCompleted && (
          <SelectedWordCameraController hasSelectedWord={Boolean(selectedWordId)} />
        )}

        {/* Ambient & Studio Directional Lights */}
        <ambientLight intensity={0.4} color="#0f172a" />
        <directionalLight position={[10, 12, 10]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1.0} color="#3b82f6" />
        <directionalLight position={[0, -10, 8]} intensity={0.8} color="#10b981" />
        <pointLight position={[0, 0, 4]} intensity={0.8} color="#38bdf8" />

        <Suspense fallback={null}>
          <OrbitingWords3D
            words={words}
            onSelectWord={onSelectWord}
            selectedWordId={selectedWordId}
            lastSubmittedWordId={lastSubmittedWordId}
            powerUpTimestamp={powerUpTimestamp}
            introProgress={introProgress}
          />
          {/* 100% Offline Procedural Metallic Environment Map */}
          <Environment background={false}>
            <Lightformer form="rect" intensity={2} color="#ffffff" position={[10, 10, 10]} scale={[12, 12, 1]} />
            <Lightformer form="rect" intensity={1.5} color="#38bdf8" position={[-10, -10, -5]} scale={[10, 10, 1]} />
            <Lightformer form="ring" intensity={1.2} color="#10b981" position={[0, -10, 8]} scale={[8, 8, 1]} />
            <Lightformer form="circle" intensity={1.8} color="#ffffff" position={[0, 10, -10]} scale={[14, 14, 1]} />
          </Environment>

          {/* Ultra-subtle Post-processing Bloom (No glare, crisp contrast) */}
          <EffectComposer enableNormalPass={false} multisampling={0}>
            <Bloom
              intensity={0.25}
              luminanceThreshold={0.85}
              luminanceSmoothing={0.9}
              mipmapBlur={true}
            />
          </EffectComposer>
        </Suspense>

        <OrbitControls
          enabled={introCompleted}
          enableZoom={true}
          maxDistance={24}
          minDistance={2.5}
          enablePan={false}
          rotateSpeed={0.6}
          enableDamping={true}
          dampingFactor={0.05}
          autoRotate={false}
          touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
        />
      </Canvas>
    </div>
  );
}
