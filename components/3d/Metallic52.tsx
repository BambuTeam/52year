"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text3D, Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

export function Metallic52() {
  const mainGroup = useRef<THREE.Group>(null);
  const gearRef1 = useRef<THREE.Mesh>(null);
  const gearRef2 = useRef<THREE.Mesh>(null);
  const coreRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (mainGroup.current) {
      // Gentle floating and mouse parallax rotation
      mainGroup.current.rotation.y = Math.sin(t * 0.4) * 0.2 + (state.pointer.x * 0.3);
      mainGroup.current.rotation.x = Math.cos(t * 0.3) * 0.1 - (state.pointer.y * 0.2);
    }

    if (gearRef1.current) {
      gearRef1.current.rotation.z = t * 0.2;
    }
    if (gearRef2.current) {
      gearRef2.current.rotation.z = -t * 0.15;
    }
    if (coreRingRef.current) {
      coreRingRef.current.rotation.x = t * 0.3;
      coreRingRef.current.rotation.y = t * 0.2;
    }
  });

  return (
    <group ref={mainGroup} scale={0.95}>
      {/* Outer Industrial Gear 1 */}
      <mesh ref={gearRef1} position={[0, 0, -0.5]}>
        <torusGeometry args={[2.8, 0.08, 16, 60]} />
        <meshStandardMaterial
          color="#2563eb"
          metalness={0.95}
          roughness={0.15}
          wireframe={false}
          emissive="#1e3a8a"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Industrial Teeth / Pins around Gear */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 2.8;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius,
              -0.5,
            ]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[0.2, 0.15, 0.25]} />
            <meshStandardMaterial
              color="#d97706"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        );
      })}

      {/* Outer Industrial Gear 2 - Counter Rotating */}
      <mesh ref={gearRef2} position={[0, 0, -0.8]}>
        <torusGeometry args={[3.4, 0.05, 16, 80]} />
        <meshStandardMaterial
          color="#475569"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Inner Glowing Core Ring */}
      <mesh ref={coreRingRef} position={[0, 0, 0]}>
        <torusGeometry args={[1.9, 0.04, 16, 50]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.8}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>

      {/* 3D Extruded Metallic "52" Emblem */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group position={[-1.35, -0.7, 0.2]}>
          <Text3D
            font="https://threejs.org/examples/fonts/helvetiker_bold.typeface.json"
            size={1.6}
            height={0.45}
            curveSegments={16}
            bevelEnabled
            bevelThickness={0.06}
            bevelSize={0.04}
            bevelOffset={0}
            bevelSegments={8}
          >
            52
            <meshPhysicalMaterial
              color="#e2e8f0"
              metalness={0.95}
              roughness={0.12}
              clearcoat={1}
              clearcoatRoughness={0.1}
              reflectivity={0.9}
              emissive="#1e293b"
              emissiveIntensity={0.2}
            />
          </Text3D>
        </group>
      </Float>

      {/* Metallic Accent Nodes */}
      <mesh position={[-2.2, 1.8, 0.3]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[2.2, -1.8, 0.3]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.95} roughness={0.1} />
      </mesh>
    </group>
  );
}
