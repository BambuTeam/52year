"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { TritechWord } from "@/lib/wordList";

interface EnergyBeamsProps {
  words: TritechWord[];
  activeFocusId: string | null;
  lastSubmittedWordId?: string;
}

interface BeamItemProps {
  startPos: [number, number, number];
  color: string;
  isHighIntensity?: boolean;
}

function BeamItem({ startPos, color, isHighIntensity }: BeamItemProps) {
  const lineRef = useRef<THREE.Line>(null);
  const particleMeshRef = useRef<THREE.Mesh>(null);

  // Construct quadratic curve from startPos to [0, 0, 0] with slight curve offset
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...startPos);
    const end = new THREE.Vector3(0, 0, 0);
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    // Add subtle perpendicular arch offset for cinematic curved laser ray
    mid.x += Math.sin(start.x) * 0.4;
    mid.y += Math.cos(start.y) * 0.4;
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [startPos]);

  const points = useMemo(() => curve.getPoints(32), [curve]);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  useFrame((state) => {
    const t = (state.clock.getElapsedTime() * (isHighIntensity ? 2.2 : 1.2)) % 1;
    if (particleMeshRef.current) {
      const pos = curve.getPointAt(t);
      particleMeshRef.current.position.copy(pos);
    }
  });

  return (
    <group>
      {/* Laser Ray Line */}
      <primitive
        object={
          new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({
              color: isHighIntensity ? "#fbbf24" : color || "#38bdf8",
              transparent: true,
              opacity: isHighIntensity ? 0.85 : 0.45,
              blending: THREE.AdditiveBlending,
              linewidth: 1.5,
            })
          )
        }
        ref={lineRef}
      />

      {/* Traveling Energy Pulse Sphere along Curve */}
      <mesh ref={particleMeshRef}>
        <sphereGeometry args={[isHighIntensity ? 0.08 : 0.045, 12, 12]} />
        <meshBasicMaterial
          color={isHighIntensity ? "#fbbf24" : "#38bdf8"}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export function EnergyBeams({ words, activeFocusId, lastSubmittedWordId }: EnergyBeamsProps) {
  const activeWords = useMemo(() => {
    return words.filter(
      (w) => w.id === activeFocusId || w.id === lastSubmittedWordId || w.isCustom
    );
  }, [words, activeFocusId, lastSubmittedWordId]);

  if (activeWords.length === 0) return null;

  return (
    <group>
      {activeWords.map((word) => (
        <BeamItem
          key={`beam-${word.id}`}
          startPos={word.position}
          color={word.color || "#38bdf8"}
          isHighIntensity={word.id === lastSubmittedWordId}
        />
      ))}
    </group>
  );
}
