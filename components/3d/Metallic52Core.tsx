"use client";

import React, { useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import * as THREE from "three";

function useGlowTexture(colorInner: string, colorOuter: string) {
  return React.useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, colorInner);
    gradient.addColorStop(0.25, colorOuter);
    gradient.addColorStop(0.65, "rgba(37,99,235,0.2)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [colorInner, colorOuter]);
}

function WankelCinematicFlare() {
  const flareGroupRef = useRef<THREE.Group>(null);
  const glowTextureBlue = useGlowTexture("#ffffff", "#38bdf8");
  const glowTextureEmerald = useGlowTexture("#ffffff", "#52b788");

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (flareGroupRef.current) {
      flareGroupRef.current.rotation.z = t * 0.15;
    }
  });

  return (
    <group ref={flareGroupRef} position={[0, 0, -0.45]}>
      {/* 1. Ultra-Smooth Camera-Facing Radial Glow Flare Sprite (Cyan/Blue) - Positioned BEHIND models */}
      {glowTextureBlue && (
        <sprite position={[0, 0, -0.1]} scale={[3.2, 3.2, 1]}>
          <spriteMaterial
            map={glowTextureBlue}
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      )}

      {/* 2. Soft Emerald Energy Accent Flare Sprite */}
      {glowTextureEmerald && (
        <sprite position={[0, 0, -0.08]} scale={[2.5, 2.5, 1]}>
          <spriteMaterial
            map={glowTextureEmerald}
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      )}

      {/* 3. 3D Volumetric Light Cone Emerging From Wankel Rotor Core */}
      <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 1.4, 2.4, 32, 1, true]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Specular Ambient Lighting */}
      <pointLight position={[0, 0, 0.2]} intensity={0.8} color="#38bdf8" distance={6} />
      <pointLight position={[0, 0, 0.1]} intensity={0.6} color="#52b788" distance={4} />
    </group>
  );
}

export function Metallic52Core() {
  const { scene: scene52 } = useGLTF("/52year.glb");
  const { scene: sceneWankel } = useGLTF("/wankel.glb");

  const coreGroup = useRef<THREE.Group>(null);
  const wankelRotorRef = useRef<THREE.Group>(null);
  const ringBlueRef = useRef<THREE.Group>(null);
  const ringGoldRef = useRef<THREE.Group>(null);
  const ringCyanRef = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    if (scene52) {
      // Center 52 Model
      const box = new THREE.Box3().setFromObject(scene52);
      const center = box.getCenter(new THREE.Vector3());
      scene52.position.sub(center);

      scene52.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color("#ffffff"), // Platinum Liquid Base
            metalness: 0.98,
            roughness: 0.08,
            clearcoat: 0.9,
            clearcoatRoughness: 0.04,
            reflectivity: 0.95,
            emissive: new THREE.Color("#2563eb"),
            emissiveIntensity: 0.15,
          });
        }
      });
    }

    if (sceneWankel) {
      // Center Wankel Rotary Motor Model
      const boxW = new THREE.Box3().setFromObject(sceneWankel);
      const centerW = boxW.getCenter(new THREE.Vector3());
      sceneWankel.position.sub(centerW);

      sceneWankel.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color("#cbd5e1"), // Titanium Base
            metalness: 0.95,
            roughness: 0.15,
            clearcoat: 0.7,
            clearcoatRoughness: 0.1,
            reflectivity: 0.85,
            emissive: new THREE.Color("#0833a1"),
            emissiveIntensity: 0.1,
          });
        }
      });
    }
  }, [scene52, sceneWankel]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (coreGroup.current) {
      coreGroup.current.rotation.y = Math.sin(t * 0.35) * 0.18 + state.pointer.x * 0.15;
      coreGroup.current.rotation.x = Math.cos(t * 0.25) * 0.08 - state.pointer.y * 0.1;
      coreGroup.current.position.y = Math.sin(t * 0.5) * 0.08;
    }

    if (wankelRotorRef.current) {
      wankelRotorRef.current.rotation.z = t * 0.35;
      wankelRotorRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
    }

    if (ringBlueRef.current) {
      ringBlueRef.current.rotation.z = t * 0.18;
      ringBlueRef.current.rotation.x = Math.sin(t * 0.1) * 0.15 + 0.2;
    }

    if (ringGoldRef.current) {
      ringGoldRef.current.rotation.z = -t * 0.12;
      ringGoldRef.current.rotation.y = Math.cos(t * 0.12) * 0.2 - 0.3;
    }

    if (ringCyanRef.current) {
      ringCyanRef.current.rotation.z = t * 0.25;
    }
  });

  return (
    <group ref={coreGroup} position={[0, 0, 0]}>
      
      {/* Background Light Glow & Lens Flare */}
      <WankelCinematicFlare />

      {/* 1. Official 3D Wankel Rotary Motor Center Frame */}
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
        <group ref={wankelRotorRef} scale={0.46} position={[0, 0, -0.25]}>
          <primitive object={sceneWankel} />
        </group>
      </Float>

      {/* 2. Official "52" Model Emblem */}
      <Float speed={1.4} rotationIntensity={0.08} floatIntensity={0.25}>
        <group scale={0.58} position={[0, 0, 0.4]}>
          <primitive object={scene52} />
        </group>
      </Float>

      {/* Dedicated Front Spotlight for 52 Emblem */}
      <directionalLight position={[0, 2, 6]} intensity={1.8} color="#ffffff" />
      <pointLight position={[0, 0, 1.2]} intensity={1.0} color="#60a5fa" distance={5} />

      {/* 3. Royal Blue Precision Orbital Ring */}
      <group ref={ringBlueRef} rotation={[0.25, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[2.2, 0.025, 32, 100]} />
          <meshPhysicalMaterial
            color="#0833a1"
            emissive="#1e40af"
            emissiveIntensity={0.35}
            metalness={0.95}
            roughness={0.12}
            clearcoat={0.9}
          />
        </mesh>
        {/* Orbital Nodes along Blue Ring */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh
              key={`node-blue-${i}`}
              position={[Math.cos(angle) * 2.2, Math.sin(angle) * 2.2, 0]}
            >
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.4} />
            </mesh>
          );
        })}
      </group>

      {/* 4. Industrial Emerald Green Orbital Ring */}
      <group ref={ringGoldRef} rotation={[-0.35, 0.2, 0]}>
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[2.8, 0.02, 32, 100]} />
          <meshPhysicalMaterial
            color="#09402c"
            emissive="#064e3b"
            emissiveIntensity={0.3}
            metalness={0.95}
            roughness={0.12}
            clearcoat={0.9}
          />
        </mesh>
        {/* Micro Industrial Emerald Spheres along Ring */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh
              key={`node-green-${i}`}
              position={[Math.cos(angle) * 2.8, Math.sin(angle) * 2.8, 0]}
            >
              <sphereGeometry args={[0.038, 16, 16]} />
              <meshStandardMaterial color="#52b788" emissive="#10b981" emissiveIntensity={0.4} />
            </mesh>
          );
        })}
      </group>

      {/* 5. Platinum Silver Metallic Ring */}
      <group ref={ringCyanRef}>
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[1.6, 0.012, 16, 80]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.95} roughness={0.12} emissive="#6b7280" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* Studio Metallic Lighting Accent */}
      <pointLight position={[0, 0, 2]} intensity={1.0} color="#38bdf8" />
      <pointLight position={[2, -2, 1]} intensity={0.8} color="#52b788" />
    </group>
  );
}

useGLTF.preload("/52year.glb");
useGLTF.preload("/wankel.glb");
