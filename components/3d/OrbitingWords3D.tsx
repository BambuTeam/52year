"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sparkles, Html } from "@react-three/drei";
import * as THREE from "three";
import { TritechWord } from "@/lib/wordList";
import { Metallic52Core } from "./Metallic52Core";
import { EnergyBeams } from "./EnergyBeams";

interface OrbitingWords3DProps {
  words: TritechWord[];
  onSelectWord: (word: TritechWord) => void;
  selectedWordId?: string;
  lastSubmittedWordId?: string;
  powerUpTimestamp?: number;
  introProgress?: number;
}

interface WordCloudItemProps {
  word: TritechWord;
  onSelect: (word: TritechWord) => void;
  isSelected: boolean;
  isLastSubmitted?: boolean;
  activeFocusId: string | null;
  setHoveredId: (id: string | null) => void;
}

function WordCloudItem({
  word,
  onSelect,
  isSelected,
  isLastSubmitted,
  activeFocusId,
  setHoveredId,
}: WordCloudItemProps) {
  const textRef = useRef<THREE.Group>(null);
  const isHovered = activeFocusId === word.id && !isSelected;
  const isFocused = isSelected || isHovered;
  const hasGlobalFocus = Boolean(activeFocusId);
  const isDimmed = hasGlobalFocus && !isFocused;

  useFrame((state) => {
    if (textRef.current) {
      // Billboarding lock: face camera at all times
      textRef.current.quaternion.copy(state.camera.quaternion);
    }
  });

  return (
    <group ref={textRef} position={word.position}>
      <Html
        center
        zIndexRange={[isFocused ? 100 : 50, 0]}
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          pointerEvents: "auto",
        }}
      >
        {/* Outer Fixed Hit Box Area (Prevents Pointer Resizing Jitter) */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(word);
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            setHoveredId(word.id);
          }}
          onMouseLeave={() => setHoveredId(null)}
          className="p-2 -m-2 cursor-pointer select-none"
        >
          {/* Inner Scaling Visual Node with GPU Acceleration */}
          <div
            className={`relative group transform-gpu will-change-transform transition-all duration-300 ease-out flex items-center gap-1.5 ${
              isDimmed
                ? "opacity-20 scale-90"
                : isFocused
                ? "opacity-100 scale-110 z-50"
                : "opacity-50 hover:opacity-100 hover:scale-105"
            }`}
          >
            {/* Last Submitted Badge Tag */}
            {isLastSubmitted && (
              <div className="absolute -top-5 left-0 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-300 text-[8px] font-mono font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(245,158,11,0.4)] whitespace-nowrap backdrop-blur-sm pointer-events-none">
                ★ ÚLTIMA FRASE SUBIDA ★
              </div>
            )}

            {/* Tiny Glowing Cyan Point Node */}
            <span
              className={`rounded-full shrink-0 transform-gpu transition-all duration-300 ${
                isLastSubmitted
                  ? "w-2.5 h-2.5 bg-amber-400 shadow-[0_0_12px_#fbbf24]"
                  : isFocused
                  ? "w-2.5 h-2.5 bg-cyan-300 shadow-[0_0_14px_#38bdf8]"
                  : "w-2 h-2 bg-cyan-400 shadow-[0_0_8px_#38bdf8] group-hover:scale-125"
              }`}
              style={{
                backgroundColor: isLastSubmitted ? "#fbbf24" : word.color || "#38bdf8",
                boxShadow: isFocused
                  ? `0 0 14px ${isLastSubmitted ? "#fbbf24" : word.color || "#38bdf8"}`
                  : `0 0 8px ${word.color || "#38bdf8"}80`,
              }}
            />

            {/* Ultra-Thin Semi-Transparent Tech Line Connector */}
            <span className="w-4 border-t border-cyan-400/40 opacity-50 group-hover:opacity-100 group-hover:w-6 group-hover:border-cyan-400/80 transition-all shrink-0" />

            {/* Clean White Sci-Fi Floating Typography */}
            <span
              className={`font-mono text-xs tracking-wider whitespace-nowrap transition-all duration-300 ${
                isLastSubmitted
                  ? "text-amber-200 font-bold"
                  : isFocused
                  ? "text-cyan-50 font-bold text-shadow-[0_0_10px_rgba(56,189,248,0.7)]"
                  : "text-white/80 font-medium group-hover:text-white"
              }`}
            >
              {word.text}
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
}

export function OrbitingWords3D({
  words,
  onSelectWord,
  selectedWordId,
  lastSubmittedWordId,
  powerUpTimestamp,
  introProgress,
}: OrbitingWords3DProps) {
  const orbitGroupRef = useRef<THREE.Group>(null);
  const starFarRef = useRef<THREE.Group>(null);
  const starMidRef = useRef<THREE.Group>(null);
  const starNearRef = useRef<THREE.Group>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [scaleFactor, setScaleFactor] = useState(0.01);

  const activeFocusId = selectedWordId || hoveredId;

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Smooth staggered radar entry scaling on load
    if (scaleFactor < 1) {
      setScaleFactor((prev) => Math.min(1, prev + delta * 1.6));
    }

    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y = t * 0.035 + state.pointer.x * 0.08;
      orbitGroupRef.current.rotation.x = Math.sin(t * 0.03) * 0.05 - state.pointer.y * 0.06;
    }

    // Differential Parallax Starfield Rotations
    if (starFarRef.current) {
      starFarRef.current.rotation.y = -t * 0.012;
      starFarRef.current.rotation.z = Math.sin(t * 0.01) * 0.05;
    }
    if (starMidRef.current) {
      starMidRef.current.rotation.y = t * 0.028;
    }
    if (starNearRef.current) {
      starNearRef.current.rotation.y = -t * 0.055;
      starNearRef.current.rotation.x = Math.cos(t * 0.02) * 0.04;
    }
  });

  return (
    <group scale={scaleFactor}>
      {/* Central Metallic Extruded "52" Emblem Core with Power-Up Reaction */}
      <Metallic52Core powerUpTimestamp={powerUpTimestamp} introProgress={introProgress} />

      {/* 1. Deep Background Starfield Layer (Slow Cyan Orbit) */}
      <group ref={starFarRef}>
        <Sparkles count={260} scale={28} size={4.0} speed={0.15} opacity={0.7} color="#38bdf8" />
      </group>

      {/* 2. Midground Starfield Layer (Medium Emerald Green Orbit) */}
      <group ref={starMidRef}>
        <Sparkles count={180} scale={20} size={3.2} speed={0.25} opacity={0.8} color="#52b788" />
      </group>

      {/* 3. Foreground Dust Starfield Layer (Fast Gold & White Dust) */}
      <group ref={starNearRef}>
        <Sparkles count={100} scale={14} size={2.5} speed={0.35} opacity={0.9} color="#fbbf24" />
        <Sparkles count={60} scale={12} size={2.0} speed={0.4} opacity={0.85} color="#ffffff" />
      </group>

      {/* Dynamic Laser Energy Beams Inward to Core */}
      <EnergyBeams
        words={words}
        activeFocusId={activeFocusId}
        lastSubmittedWordId={lastSubmittedWordId}
      />

      {/* Orbiting 3D Historical Word Constellation */}
      <group ref={orbitGroupRef}>
        <Float speed={0.6} rotationIntensity={0.05} floatIntensity={0.2}>
          {words.map((word) => (
            <WordCloudItem
              key={word.id}
              word={word}
              onSelect={onSelectWord}
              isSelected={word.id === selectedWordId}
              isLastSubmitted={word.id === lastSubmittedWordId}
              activeFocusId={activeFocusId}
              setHoveredId={setHoveredId}
            />
          ))}
        </Float>
      </group>
    </group>
  );
}
