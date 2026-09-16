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

  // Gentle, serene swirl orbit around central Y axis
  float angle = uTime * aSpeed * 0.12 + aPhase;
  float cosA = cos(angle);
  float sinA = sin(angle);

  vec3 rotatedPos;
  rotatedPos.x = pos.x * cosA - pos.z * sinA;
  rotatedPos.z = pos.x * sinA + pos.z * cosA;
  rotatedPos.y = pos.y + sin(uTime * aSpeed * 0.3 + aPhase) * 0.25;

  // Subtle magnetic mouse interaction field
  vec3 distVec = rotatedPos - uMouse;
  float dist = length(distVec);
  if (dist < 4.0 && dist > 0.001) {
    float force = (1.0 - dist / 4.0);
    rotatedPos += normalize(distVec) * force * 0.6;
  }

  // Kinetic submission surge shockwave
  if (uSurge > 0.001) {
    vec3 radial = normalize(rotatedPos);
    float wave = sin(uSurge * 3.14159);
    rotatedPos += radial * wave * (1.8 + aPhase * 0.8);
  }

  vec4 mvPosition = modelViewMatrix * vec4(rotatedPos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Soft, non-glaring size attenuation
  gl_PointSize = aScale * (90.0 / -mvPosition.z) * (1.0 + uSurge * 0.4);

  // Soft edge fading with low maximum opacity (0.35 max) for breathable elegance
  vAlpha = smoothstep(26.0, 5.0, length(rotatedPos)) * 0.35;
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
  count = 550, // Reduced by 70% from 1800 for pristine clarity
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

    const royalBlue = new THREE.Color("#2563eb");
    const cyanBlue = new THREE.Color("#38bdf8");
    const emeraldColor = new THREE.Color("#52b788");
    const greenColor = new THREE.Color("#10b981");
    const whiteColor = new THREE.Color("#ffffff");

    for (let i = 0; i < count; i++) {
      // Disperse particles in an expanded, breathable volumetric ring field away from central core
      const radius = THREE.MathUtils.lerp(3.8, 13.5, Math.pow(Math.random(), 0.6));
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.5;

      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi) * 1.1;
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const randColor = Math.random();
      const c =
        randColor < 0.35
          ? royalBlue
          : randColor < 0.55
          ? cyanBlue
          : randColor < 0.75
          ? emeraldColor
          : randColor < 0.9
          ? greenColor
          : whiteColor;

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      scales[i] = THREE.MathUtils.lerp(0.35, 1.0, Math.random());
      speeds[i] = THREE.MathUtils.lerp(0.15, 0.5, Math.random()); // Slow, tranquil floating speed
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

    const pointer3D = new THREE.Vector3(
      (state.pointer.x * state.viewport.width) / 2,
      (state.pointer.y * state.viewport.height) / 2,
      0
    );

    uniformsRef.current.uMouse.value.lerp(pointer3D, 0.1);
  });

  return <points ref={pointsRef} geometry={geometry} material={shaderMaterial} />;
}

