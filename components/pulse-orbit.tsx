const pulseRings = Array.from({ length: 5 }, (_, index) => index);

export function PulseOrbit() {
  return (
    <div className="pulse-origin" aria-hidden="true">
      <div className="core-aura" />
      {pulseRings.map((ring) => (
        <span
          className="pulse-ring"
          key={ring}
          style={{ '--ring-index': ring } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
