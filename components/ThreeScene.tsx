// @ts-nocheck
"use client";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Sparkles } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import { useZooStore } from '../state/useZooStore';
import { Pony } from './Pony';

function Ground() {
  const size = 60;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[size, size, 1, 1]} />
      <meshStandardMaterial color="#b7f0a1" roughness={1} metalness={0} />
    </mesh>
  );
}

export default function ThreeScene() {
  const ponies = useZooStore((s) => s.ponies);

  const ambientIntensity = 0.6;
  const sunPos = useMemo(() => [8, 12, 6] as [number, number, number], []);

  return (
    <Canvas shadows camera={{ position: [8, 6, 10], fov: 55 }}>
      <color attach="background" args={["#eaf6ff"]} />
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={sunPos}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Suspense fallback={null}>
        <Sky sunPosition={sunPos} mieCoefficient={0.02} mieDirectionalG={0.9} turbidity={6} rayleigh={1.2} />
      </Suspense>

      <Ground />

      {ponies.map((p) => (
        <Pony key={p.id} pony={p} />
      ))}

      <Sparkles count={80} scale={[40, 6, 40]} size={2} speed={0.2} opacity={0.15} color="#ffffff" />

      <OrbitControls enableDamping makeDefault />
    </Canvas>
  );
}
