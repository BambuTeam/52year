"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_VERTEX_SHADER = `
uniform float uTime;
uniform float uSurge;
uniform vec3 uMouse;
attribute float aScale;
attribute float aSpeed;
attribute float aPhase;
attribute vec3 aColor;

varying vec3 vColor;
varying float vAlpha;

void main() {
  vColor = aColor;

  vec3 pos = position;

  // Swirling viscous orbit around central Y axis
  float angle = uTime * aSpeed * 0.35 + aPhase;
  float cosA = cos(angle);
  float sinA = sin(angle);

  vec3 rotatedPos;
  rotatedPos.x = pos.x * cosA - pos.z * sinA;
  rotatedPos.z = pos.x * sinA + pos.z * cosA;
  rotatedPos.y = pos.y + sin(uTime * aSpeed * 0.8 + aPhase) * 0.35;

  // Magnetic mouse interaction field
  vec3 distVec = rotatedPos - uMouse;
  float dist = length(distVec);
  if (dist < 3.8 && dist > 0.001) {
    float force = (1.0 - dist / 3.8);
    rotatedPos += normalize(distVec) * force * 1.1;
  }

  // Kinetic submission surge shockwave
  if (uSurge > 0.001) {
    vec3 radial = normalize(rotatedPos);
    float wave = sin(uSurge * 3.14159);
    rotatedPos += radial * wave * (2.2 + aPhase * 1.2);
  }

  vec4 mvPosition = modelViewMatrix * vec4(rotatedPos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Size attenuation
  gl_PointSize = aScale * (160.0 / -mvPosition.z) * (1.0 + uSurge * 0.6);

  // Smooth edge fading
  vAlpha = smoothstep(22.0, 3.5, length(rotatedPos)) * 0.7;
}
`;

const PARTICLE_FRAGMENT_SHADER = `
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;

  // Soft glowing radial falloff
  float alpha = (1.0 - dist * 2.0) * vAlpha;
  gl_FragColor = vec4(vColor, alpha);
}
`;

interface InteractiveOilParticlesProps {
  powerUpTimestamp?: number;
  count?: number;
}

export function InteractiveOilParticles({
  powerUpTimestamp,
  count = 1800,
}: InteractiveOilParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const uniformsRef = useRef({
    uTime: { value: 0 },
    uSurge: { value: 0 },
    uMouse: { value: new THREE.Vector3(0, 0, 0) },
  });

  const { geometry, shaderMaterial } = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);

    const amberColor = new THREE.Color("#f59e0b");
    const goldColor = new THREE.Color("#fbbf24");
    const cyanColor = new THREE.Color("#38bdf8");
    const tealColor = new THREE.Color("#06b6d4");

    for (let i = 0; i < count; i++) {
      // Distribute particles in a volumetric donut / sphere field around core
      const radius = THREE.MathUtils.lerp(1.8, 9.5, Math.pow(Math.random(), 0.7));
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.6;

      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi) * 1.2;
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      // Color mix: 60% amber-gold oil, 40% cyan-teal sparks
      const isAmber = Math.random() > 0.4;
      const c = isAmber
        ? (Math.random() > 0.5 ? amberColor : goldColor)
        : (Math.random() > 0.5 ? cyanColor : tealColor);

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      scales[i] = THREE.MathUtils.lerp(0.4, 1.3, Math.random());
      speeds[i] = THREE.MathUtils.lerp(0.6, 1.8, Math.random());
      phases[i] = Math.random() * Math.PI * 2;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERTEX_SHADER,
      fragmentShader: PARTICLE_FRAGMENT_SHADER,
      uniforms: uniformsRef.current,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { geometry: geo, shaderMaterial: mat };
  }, [count]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    uniformsRef.current.uTime.value = t;

    // Surge decay calculation
    let surgeFactor = 0;
    if (powerUpTimestamp) {
      const elapsed = (Date.now() - powerUpTimestamp) / 1000;
      if (elapsed < 3.5) {
        surgeFactor = Math.pow(1 - elapsed / 3.5, 2);
      }
    }

    uniformsRef.current.uSurge.value = THREE.MathUtils.damp(
      uniformsRef.current.uSurge.value,
      surgeFactor,
      6,
      delta
    );

    // Map pointer coordinates to 3D world space for mouse interaction
    const pointer3D = new THREE.Vector3(
      (state.pointer.x * state.viewport.width) / 2,
      (state.pointer.y * state.viewport.height) / 2,
      0
    );

    uniformsRef.current.uMouse.value.lerp(pointer3D, 0.1);
  });

  return <points ref={pointsRef} geometry={geometry} material={shaderMaterial} />;
}
