'use client';

import dynamic from 'next/dynamic';
import { useZooStore } from '../state/useZooStore';

const ThreeScene = dynamic(() => import('../components/ThreeScene'), { ssr: false });

export default function Page() {
  const ponyCount = useZooStore((s) => s.ponies.length);
  const addPony = useZooStore((s) => s.addPony);
  const removeSelected = useZooStore((s) => s.removeSelected);
  const randomizeColors = useZooStore((s) => s.randomizeColors);

  return (
    <main>
      <div className="canvas-container">
        <ThreeScene />
      </div>

      <div className="overlay">
        <button className="button" onClick={() => addPony()}>Add Pony</button>
        <button className="button" onClick={() => removeSelected()}>Remove Selected</button>
        <button className="button" onClick={() => randomizeColors()}>Randomize Colors</button>
        <span className="badge">Ponies: {ponyCount}</span>
      </div>

      <div className="instructions">
        <strong>How to play:</strong> Click a pony to select. Click its head to pet! Scroll to zoom, drag to orbit.
      </div>
    </main>
  );
}
