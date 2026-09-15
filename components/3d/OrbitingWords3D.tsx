"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float, Sparkles, Html } from "@react-three/drei";
import * as THREE from "three";
import { TritechWord } from "@/lib/wordList";
import { Metallic52Core } from "./Metallic52Core";

interface OrbitingWords3DProps {
  words: TritechWord[];
  onSelectWord: (word: TritechWord) => void;
  selectedWordId?: string;
  lastSubmittedWordId?: string;
}

function WordCloudItem({
  word,
  onSelect,
  isSelected,
  isLastSubmitted,
}: {
  word: TritechWord;
  onSelect: (word: TritechWord) => void;
  isSelected: boolean;
  isLastSubmitted?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const textRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (textRef.current) {
      // Billboarding lock: face camera at all times
      textRef.current.quaternion.copy(state.camera.quaternion);
    }
  });

  const isHighlighted = hovered || isSelected;
  const textColor = isLastSubmitted ? "#fbbf24" : isHighlighted ? "#fbbf24" : word.color || "#ffffff";
  const pillScale = isLastSubmitted ? (isHighlighted ? 1.35 : 1.2) : isHighlighted ? 1.25 : 1.0;
  const pillWidth = Math.max(word.text.length * 0.11 + 0.36, 0.85);

  return (
    <group
      ref={textRef}
      position={word.position}
      scale={pillScale}
      renderOrder={isLastSubmitted || isHighlighted ? 120 : 60}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(word);
      }}
    >
      {/* Floating Badge Tag for the Last Submitted Phrase */}
      {isLastSubmitted && (
        <group position={[0, 0.22, 0.02]} renderOrder={150}>
          {/* Badge Background Mesh */}
          <mesh position={[0, 0, -0.005]}>
            <planeGeometry args={[1.25, 0.15]} />
            <meshStandardMaterial
              color="#451a03"
              emissive="#d97706"
              emissiveIntensity={1.2}
              roughness={0.2}
              metalness={0.9}
              depthTest={false}
            />
          </mesh>
          {/* Badge Golden Border Line */}
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[1.29, 0.18]} />
            <meshBasicMaterial color="#fbbf24" depthTest={false} />
          </mesh>
          {/* Badge Text */}
          <Text
            fontSize={0.062}
            letterSpacing={0.06}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            position={[0, 0, 0.005]}
            renderOrder={150}
          >
            ★ ÚLTIMA FRASE SUBIDA ★
            <meshBasicMaterial color="#ffffff" depthTest={false} />
          </Text>
        </group>
      )}

      {/* Contrast Halo Backdrop Mesh to isolate text from background starfield */}
      <mesh position={[0, 0, -0.025]}>
        <planeGeometry args={[pillWidth + 0.35, 0.42]} />
        <meshBasicMaterial color="#02040a" transparent opacity={0.7} depthTest={false} />
      </mesh>

      {/* 3D Glass Pill Backdrop Container Mesh */}
      <mesh position={[0, 0, -0.015]}>
        <planeGeometry args={[pillWidth, 0.22]} />
        <meshStandardMaterial
          color={isLastSubmitted ? "#1e1b4b" : isHighlighted ? "#0f172a" : "#040817"}
          roughness={0.2}
          metalness={0.92}
          transparent
          opacity={isLastSubmitted ? 0.95 : isHighlighted ? 0.95 : 0.88}
          depthTest={false}
        />
      </mesh>

      {/* 3D Glass Pill Border Line */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[pillWidth + 0.03, 0.25]} />
        <meshBasicMaterial
          color={isLastSubmitted ? "#f59e0b" : isHighlighted ? "#fbbf24" : "#1e293b"}
          transparent
          opacity={isLastSubmitted ? 1.0 : isHighlighted ? 0.95 : 0.65}
          depthTest={false}
        />
      </mesh>

      {/* Swatch Color Bullet Sphere */}
      <mesh position={[-pillWidth / 2 + 0.12, 0, 0]}>
        <sphereGeometry args={[isLastSubmitted ? 0.042 : 0.032, 16, 16]} />
        <meshBasicMaterial color={isLastSubmitted ? "#fbbf24" : word.color || "#38bdf8"} depthTest={false} />
      </mesh>

      {/* 3D Concept Text */}
      <Text
        fontSize={0.105}
        letterSpacing={0.05}
        textAlign="left"
        anchorX="center"
        anchorY="middle"
        position={[0.05, 0, 0]}
        renderOrder={130}
      >
        {word.text}
        <meshStandardMaterial
          color={textColor}
          emissive={isLastSubmitted ? "#f59e0b" : isHighlighted ? "#f59e0b" : textColor === "#ffffff" ? "#1d4ed8" : textColor}
          emissiveIntensity={isLastSubmitted ? 2.2 : isHighlighted ? 1.5 : 0.6}
          depthTest={false}
        />
      </Text>
    </group>
  );
}

export function OrbitingWords3D({
  words,
  onSelectWord,
  selectedWordId,
  lastSubmittedWordId,
}: OrbitingWords3DProps) {
  const orbitGroupRef = useRef<THREE.Group>(null);
  const starFarRef = useRef<THREE.Group>(null);
  const starMidRef = useRef<THREE.Group>(null);
  const starNearRef = useRef<THREE.Group>(null);
  const [scaleFactor, setScaleFactor] = useState(0.01);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Smooth staggered scale intro on load
    if (scaleFactor < 1) {
      setScaleFactor((prev) => Math.min(1, prev + delta * 1.8));
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
      {/* Central Metallic Extruded "52" Emblem Core */}
      <Metallic52Core />

      {/* 1. Deep Background Starfield Layer (Slow Cyan Orbit) */}
      <group ref={starFarRef}>
        <Sparkles count={260} scale={24} size={4.0} speed={0.15} opacity={0.7} color="#38bdf8" />
      </group>

      {/* 2. Midground Starfield Layer (Medium Emerald Green Orbit) */}
      <group ref={starMidRef}>
        <Sparkles count={180} scale={18} size={3.2} speed={0.25} opacity={0.8} color="#52b788" />
      </group>

      {/* 3. Foreground Dust Starfield Layer (Fast Gold & White Dust) */}
      <group ref={starNearRef}>
        <Sparkles count={100} scale={12} size={2.5} speed={0.35} opacity={0.9} color="#fbbf24" />
        <Sparkles count={60} scale={10} size={2.0} speed={0.4} opacity={0.85} color="#ffffff" />
      </group>

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
            />
          ))}
        </Float>
      </group>
    </group>
  );
}
