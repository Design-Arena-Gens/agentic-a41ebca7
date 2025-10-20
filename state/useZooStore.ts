import { create } from 'zustand';
import { nanoid } from './utils';

export type Pony = {
  id: string;
  name: string;
  color: string;
  position: [number, number, number];
  lastPetTs: number;
};

type ZooState = {
  ponies: Pony[];
  selectedId?: string;
  addPony: () => void;
  removeSelected: () => void;
  select: (id?: string) => void;
  pet: (id: string) => void;
  randomizeColors: () => void;
};

const niceColors = [
  '#ff99c8', '#ffc8dd', '#bde0fe', '#a3e635', '#facc15', '#fda4af',
  '#93c5fd', '#86efac', '#f0abfc', '#f472b6', '#f97316', '#22d3ee'
];

function randomColor() { return niceColors[Math.floor(Math.random() * niceColors.length)]; }

function randomPosition(radius = 6): [number, number, number] {
  const angle = Math.random() * Math.PI * 2;
  const r = 1 + Math.random() * (radius - 1);
  const x = Math.cos(angle) * r;
  const z = Math.sin(angle) * r;
  return [x, 0, z];
}

export const useZooStore = create<ZooState>((set, get) => ({
  ponies: Array.from({ length: 3 }, (_, i) => ({
    id: nanoid(),
    name: `Pony ${i + 1}`,
    color: randomColor(),
    position: randomPosition(),
    lastPetTs: 0,
  })),
  selectedId: undefined,
  addPony: () => set(({ ponies }) => ({
    ponies: [
      ...ponies,
      { id: nanoid(), name: `Pony ${ponies.length + 1}`, color: randomColor(), position: randomPosition(), lastPetTs: 0 }
    ]
  })),
  removeSelected: () => set(({ ponies, selectedId }) => ({
    ponies: selectedId ? ponies.filter(p => p.id !== selectedId) : ponies.slice(0, -1),
    selectedId: undefined,
  })),
  select: (id?: string) => set({ selectedId: id }),
  pet: (id: string) => set(({ ponies }) => ({
    ponies: ponies.map(p => p.id === id ? { ...p, lastPetTs: Date.now() } : p)
  })),
  randomizeColors: () => set(({ ponies }) => ({
    ponies: ponies.map(p => ({ ...p, color: randomColor() }))
  })),
}));
