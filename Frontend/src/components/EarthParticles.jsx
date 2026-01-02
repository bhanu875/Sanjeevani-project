const EarthParticles = () => {
  const particles = Array.from({ length: 40 });

  return (
    <>
      {particles.map((_, i) => {
        const size = Math.random() * 18 + 6;
        const left = Math.random() * 100;
        const duration = Math.random() * 30 + 20;
        const delay = Math.random() * -40;

        const isGlow = i % 6 === 0;
        const isEdge = left < 15 || left > 85;

        return (
          <span
            key={i}
            className="earth-particle"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
background: isGlow
  ? "rgba(220, 255, 220, 0.75)"   // pollen glow
  : isEdge
  ? "rgba(90, 170, 120, 0.55)"    // depth edges
  : "rgba(120, 210, 150, 0.65)",  // floating leaf dust

filter: isGlow
  ? "blur(2.5px)"
  : isEdge
  ? "blur(2px)"
  : "blur(1.8px)",

              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </>
  );
};

export default EarthParticles;
