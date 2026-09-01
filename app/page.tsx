import { PulseOrbit } from '@/components/pulse-orbit';

export default function Home() {
  return (
    <main className="experience" aria-label="Pulsing orbit artwork">
      <div className="artwork-frame">
        <img
          className="artwork"
          src="/orbit-reference.svg"
          alt="Abstract purple orbit artwork"
        />

        <PulseOrbit />
      </div>
    </main>
  );
}
