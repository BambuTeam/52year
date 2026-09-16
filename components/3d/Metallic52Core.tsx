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

// GLSL 2D FBM Noise & Domain-Warped Flow for Procedural Internal Oil Swirl (Fragment Shader Only)
const FRAGMENT_OIL_FLOW_GLSL = `
vec2 hash22(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash22(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}

float fbm2D(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 3; i++) {
    v += a * noise2D(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}
`;

function ProceduralUVFlowLiquid({ powerUpTimestamp }: { powerUpTimestamp?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniformsRef = useRef({
    uTime: { value: 0 },
    uFlowSpeed: { value: 1.0 },
  });

  const handleBeforeCompile = (shader: any) => {
    shader.uniforms.uTime = uniformsRef.current.uTime;
    shader.uniforms.uFlowSpeed = uniformsRef.current.uFlowSpeed;

    shader.fragmentShader = `
      uniform float uTime;
      uniform float uFlowSpeed;
      ${FRAGMENT_OIL_FLOW_GLSL}
      ${shader.fragmentShader}
    `;

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `
      #include <color_fragment>
      vec2 st = vUv * vec2(6.0, 3.0);
      vec2 q = vec2(0.0);
      q.x = fbm2D(st + vec2(0.0, uTime * 0.25 * uFlowSpeed));
      q.y = fbm2D(st + vec2(1.0, uTime * 0.18 * uFlowSpeed));

      vec2 r = vec2(0.0);
      r.x = fbm2D(st + 1.0 * q + vec2(1.7, 9.2) + 0.12 * uTime * uFlowSpeed);
      r.y = fbm2D(st + 1.0 * q + vec2(8.3, 2.8) + 0.1 * uTime * uFlowSpeed);

      float f = fbm2D(st + r);

      // Swirling amber-gold color gradient
      vec3 colBase = vec3(0.96, 0.62, 0.07); // #f59e0b
      vec3 colGlow = vec3(0.98, 0.75, 0.14); // #fbbf24
      vec3 colDark = vec3(0.85, 0.46, 0.02); // #d97706

      vec3 oilFlowColor = mix(colBase, colGlow, clamp(f * f * 3.5, 0.0, 1.0));
      oilFlowColor = mix(oilFlowColor, colDark, clamp(length(q), 0.0, 1.0) * 0.35);

      diffuseColor.rgb *= oilFlowColor;
      `
    );
  };

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    let surgeFactor = 0;
    if (powerUpTimestamp) {
      const elapsed = (Date.now() - powerUpTimestamp) / 1000;
      if (elapsed < 3.5) {
        surgeFactor = Math.pow(1 - elapsed / 3.5, 2);
      }
    }

    const targetFlowSpeed = 1.0 + surgeFactor * 2.8;
    uniformsRef.current.uFlowSpeed.value = THREE.MathUtils.damp(
      uniformsRef.current.uFlowSpeed.value,
      targetFlowSpeed,
      6,
      delta
    );

    uniformsRef.current.uTime.value += delta * uniformsRef.current.uFlowSpeed.value;

    if (meshRef.current) {
      meshRef.current.rotation.z = -t * 0.15;
      meshRef.current.rotation.y = Math.sin(t * 0.2) * 0.08;
    }
  });

  return (
    <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.15}>
      <mesh ref={meshRef} renderOrder={1} position={[0, 0, -0.05]}>
        <torusGeometry args={[1.32, 0.36, 64, 128]} />
        <meshPhysicalMaterial
          color={new THREE.Color("#f59e0b")}
          emissive={new THREE.Color("#d97706")}
          emissiveIntensity={0.1}
          metalness={0.0}
          roughness={0.05}
          transmission={0.95}
          thickness={2.0}
          ior={1.47}
          specularIntensity={1.0}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          reflectivity={0.95}
          transparent={true}
          opacity={0.95}
          depthWrite={false}
          onBeforeCompile={handleBeforeCompile}
        />
      </mesh>
    </Float>
  );
}

interface Metallic52CoreProps {
  powerUpTimestamp?: number;
  introProgress?: number;
}

export function Metallic52Core({ powerUpTimestamp, introProgress = 1 }: Metallic52CoreProps) {
  const { scene: scene52 } = useGLTF("/52year.glb");
  const { scene: sceneWankel } = useGLTF("/wankel.glb");

  const coreGroup = useRef<THREE.Group>(null);
  const emblemGroupRef = useRef<THREE.Group>(null);
  const wankelRotorRef = useRef<THREE.Group>(null);
  const ringBlueRef = useRef<THREE.Group>(null);
  const ringGoldRef = useRef<THREE.Group>(null);
  const ringCyanRef = useRef<THREE.Group>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

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

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Calculate Power-Up Surge factor (3.5 second decay)
    let surgeFactor = 0;
    if (powerUpTimestamp) {
      const elapsed = (Date.now() - powerUpTimestamp) / 1000;
      if (elapsed < 3.5) {
        surgeFactor = Math.pow(1 - elapsed / 3.5, 2);
      }
    }

    if (coreGroup.current) {
      coreGroup.current.rotation.y = Math.sin(t * 0.35) * 0.18 + state.pointer.x * 0.15;
      coreGroup.current.rotation.x = Math.cos(t * 0.25) * 0.08 - state.pointer.y * 0.1;
      coreGroup.current.position.y = Math.sin(t * 0.5) * 0.08;

      // Scale bounce surge animation upon submission
      const scaleBounce = 1.0 + Math.sin(surgeFactor * Math.PI) * 0.14;
      coreGroup.current.scale.set(scaleBounce, scaleBounce, scaleBounce);
    }

    // Dynamic Chromatic Aura Loop for 52 Emblem
    const waveCyanBlue = (Math.sin(t * 0.8) + 1) / 2;
    const waveGold = (Math.sin(t * 0.4 + 1.2) + 1) / 2;
    const colorCyan = new THREE.Color("#38bdf8");
    const colorBlue = new THREE.Color("#2563eb");
    const colorGold = new THREE.Color("#fbbf24");

    const dynamicAuraColor = new THREE.Color()
      .lerpColors(colorCyan, colorBlue, waveCyanBlue)
      .lerp(colorGold, waveGold * 0.35);

    // Apply Chromatic Aura to 52 Emblem Mesh Materials
    if (scene52) {
      const p = Math.min(1, Math.max(0, introProgress));
      const ease = 1 - Math.pow(1 - p, 3);
      const breathingPulse = 0.15 + Math.sin(t * 1.2) * 0.08;
      const currentEmissiveIntensity = p < 1 ? THREE.MathUtils.lerp(2.5, 0.15, ease) : breathingPulse + surgeFactor * 1.5;

      scene52.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
          const mat = (child as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
          mat.emissive.copy(dynamicAuraColor);
          mat.emissiveIntensity = currentEmissiveIntensity;
        }
      });
    }

    // Dynamic 52 Emblem Intro Insertion Animation
    if (emblemGroupRef.current) {
      const p = Math.min(1, Math.max(0, introProgress));
      const ease = 1 - Math.pow(1 - p, 3); // Ease-out cubic curve

      // Scale down from massive 2.8x down to locked 0.58
      const currentScale = THREE.MathUtils.lerp(2.8, 0.58, ease);
      emblemGroupRef.current.scale.set(currentScale, currentScale, currentScale);

      // Z-position shifts back from 1.8 forward to locked 0.4
      const currentZ = THREE.MathUtils.lerp(1.8, 0.4, ease);
      emblemGroupRef.current.position.z = currentZ;
    }

    if (wankelRotorRef.current) {
      // Accelerate spin during power-up
      const spinSpeed = 0.35 + surgeFactor * 2.5;
      wankelRotorRef.current.rotation.z += delta * spinSpeed;
      wankelRotorRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
    }

    // Synchronized Atmospheric Point Light Radiating Dynamic Color onto Wankel Core Surfaces
    if (pointLightRef.current) {
      const introGlow = introProgress < 1 ? (1 - introProgress) * 4.5 : 0;
      pointLightRef.current.intensity = 1.2 + surgeFactor * 4.5 + introGlow + Math.sin(t * 0.8) * 0.3;
      pointLightRef.current.color.copy(surgeFactor > 0.2 ? colorGold : dynamicAuraColor);
    }

    if (shockwaveRef.current) {
      if (surgeFactor > 0.01) {
        shockwaveRef.current.visible = true;
        const scale = 1.0 + (1 - surgeFactor) * 4.8;
        shockwaveRef.current.scale.set(scale, scale, scale);
        (shockwaveRef.current.material as THREE.MeshBasicMaterial).opacity = surgeFactor * 0.75;
      } else {
        shockwaveRef.current.visible = false;
      }
    }

    if (ringBlueRef.current) {
      ringBlueRef.current.rotation.z += delta * (0.18 + surgeFactor * 0.5);
      ringBlueRef.current.rotation.x = Math.sin(t * 0.1) * 0.15 + 0.2;
    }

    if (ringGoldRef.current) {
      ringGoldRef.current.rotation.z -= delta * (0.12 + surgeFactor * 0.4);
      ringGoldRef.current.rotation.y = Math.cos(t * 0.12) * 0.2 - 0.3;
    }

    if (ringCyanRef.current) {
      ringCyanRef.current.rotation.z += delta * (0.25 + surgeFactor * 0.6);
    }
  });

  return (
    <group ref={coreGroup} position={[0, 0, 0]}>
      
      {/* Background Light Glow & Lens Flare */}
      <WankelCinematicFlare />

      {/* Expanding Energy Power-Up Shockwave Mesh Ring */}
      <mesh ref={shockwaveRef} rotation={[Math.PI / 2, 0, 0]} visible={false}>
        <torusGeometry args={[1.5, 0.06, 16, 64]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* 1. Official 3D Wankel Rotary Motor Center Frame */}
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
        <group ref={wankelRotorRef} scale={0.46} position={[0, 0, -0.25]}>
          <primitive object={sceneWankel} />
        </group>
      </Float>

      {/* 2. Procedural Fragment Shader UV Flow Liquid (Rock-solid geometry, internal oil currents) */}
      <ProceduralUVFlowLiquid powerUpTimestamp={powerUpTimestamp} />

      {/* 3. Official "52" Model Emblem with Dynamic Intro Scale & Insertion */}
      <Float speed={1.4} rotationIntensity={0.08} floatIntensity={0.25}>
        <group ref={emblemGroupRef} scale={0.58} position={[0, 0, 0.4]}>
          <primitive object={scene52} />
        </group>
      </Float>

      {/* Dedicated Front Spotlight for 52 Emblem */}
      <directionalLight position={[0, 2, 6]} intensity={1.8} color="#ffffff" />
      <pointLight ref={pointLightRef} position={[0, 0, 1.2]} intensity={1.0} color="#60a5fa" distance={6} />

      {/* 4. Royal Blue Precision Orbital Ring */}
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

      {/* 5. Industrial Emerald Green Orbital Ring */}
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

      {/* 6. Platinum Silver Metallic Ring */}
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
useGLTF.preload("/fluido.glb");
