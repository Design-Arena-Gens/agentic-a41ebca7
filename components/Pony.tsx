// @ts-nocheck
"use client";
import { useRef } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { useZooStore, Pony as PonyType } from '../state/useZooStore';

function useBounce(baseY = 0, speed = 1, amplitude = 0.05) {
  const t = useRef(Math.random() * Math.PI * 2);
  useFrame((_, delta) => {
    t.current += delta * speed;
  });
  return baseY + Math.sin(t.current) * amplitude;
}

export function Pony({ pony }: { pony: PonyType }) {
  const groupRef = useRef<Mesh>(null!);
  const headRef = useRef<Mesh>(null!);
  const bodyRef = useRef<Mesh>(null!);
  const legRefs = [useRef<Mesh>(null!), useRef<Mesh>(null!), useRef<Mesh>(null!), useRef<Mesh>(null!)];

  const select = useZooStore((s) => s.select);
  const selectedId = useZooStore((s) => s.selectedId);
  const pet = useZooStore((s) => s.pet);

  const isSelected = selectedId === pony.id;

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    // Idle sway
    group.rotation.y += Math.sin(state.clock.elapsedTime * 0.5 + group.position.x) * 0.002;

    // Little breathing scale
    const s = 1 + Math.sin(state.clock.elapsedTime * 2 + group.position.x) * 0.01;
    bodyRef.current.scale.set(1, s, 1);

    // Leg shuffle
    const t = state.clock.elapsedTime * 5;
    legRefs.forEach((leg, i) => {
      const phase = i % 2 === 0 ? 0 : Math.PI;
      leg.current.rotation.x = Math.sin(t + phase) * 0.1;
    });

    // Pet head bob when recently petted
    const sincePet = (Date.now() - pony.lastPetTs) / 1000;
    const petPulse = Math.max(0, 1 - Math.min(sincePet / 1.5, 1));
    headRef.current.rotation.x = petPulse * 0.5;

    // Lift selected slightly
    const lift = isSelected ? 0.15 : 0;
    group.position.y = lift;
  });

  const hoverY = useBounce(0, 1, 0.02);

  const handleClick = (e: any) => {
    e.stopPropagation();
    select(pony.id);
  };

  const handleHeadClick = (e: any) => {
    e.stopPropagation();
    pet(pony.id);
  };

  return (
    <mesh ref={groupRef} position={pony.position as any} onClick={handleClick}>
      {/* Shadow catcher slightly below ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
        <circleGeometry args={[0.6, 24]} />
        <meshBasicMaterial color="#000" transparent opacity={0.12} />
      </mesh>

      {/* Body */}
      <mesh ref={bodyRef} castShadow receiveShadow position={[0, 0.4 + hoverY, 0]}>
        <capsuleGeometry args={[0.35, 0.6, 8, 16]} />
        <meshStandardMaterial color={pony.color} metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} castShadow position={[0.35, 0.8 + hoverY, 0]} onClick={handleHeadClick}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color={pony.color} />
      </mesh>

      {/* Ears */}
      <mesh castShadow position={[0.42, 1.0 + hoverY, 0.08]}>
        <coneGeometry args={[0.06, 0.12, 8]} />
        <meshStandardMaterial color="#fef2f2" />
      </mesh>
      <mesh castShadow position={[0.42, 1.0 + hoverY, -0.08]}>
        <coneGeometry args={[0.06, 0.12, 8]} />
        <meshStandardMaterial color="#fef2f2" />
      </mesh>

      {/* Eyes */}
      <mesh position={[0.43, 0.82 + hoverY, 0.09]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[0.43, 0.82 + hoverY, -0.09]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      {/* Muzzle */}
      <mesh position={[0.50, 0.74 + hoverY, 0]}>
        <capsuleGeometry args={[0.07, 0.1, 8, 12]} />
        <meshStandardMaterial color="#fde68a" />
      </mesh>

      {/* Mane */}
      <mesh position={[0.15, 0.95 + hoverY, 0]} rotation={[0, 0, Math.PI / 8]}>
        <torusGeometry args={[0.18, 0.04, 12, 24, Math.PI]} />
        <meshStandardMaterial color="#f472b6" roughness={0.6} />
      </mesh>

      {/* Tail */}
      <mesh position={[-0.45, 0.65 + hoverY, 0]}>
        <coneGeometry args={[0.08, 0.35, 10]} />
        <meshStandardMaterial color="#a78bfa" />
      </mesh>

      {/* Legs */}
      <mesh ref={legRefs[0]} castShadow position={[0.1, 0.2, 0.12]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh ref={legRefs[1]} castShadow position={[0.1, 0.2, -0.12]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh ref={legRefs[2]} castShadow position={[-0.2, 0.2, 0.12]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh ref={legRefs[3]} castShadow position={[-0.2, 0.2, -0.12]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#fff" />
      </mesh>

      {/* Nameplate removed for simplicity */}
    </mesh>
  );
}
