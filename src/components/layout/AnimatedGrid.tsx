
export const AnimatedGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dark gradient fade for the top and bottom to blend with background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10" />
      
      {/* The moving grid */}
      <div className="absolute inset-0 [perspective:1000px]">
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
          style={{
            transform: 'rotateX(60deg) scale(2.5)',
            transformOrigin: 'top center',
            animation: 'grid-forward 20s linear infinite'
          }}
        />
      </div>

      {/* Glowing moving beams */}
      <div className="absolute inset-0 z-0 opacity-50">
        <div 
          className="absolute top-0 left-[20%] w-[2px] h-[30%] bg-gradient-to-b from-transparent via-[var(--color-primary)] to-transparent blur-[2px]" 
          style={{ animation: 'beam-fall 8s linear infinite' }}
        />
        <div 
          className="absolute top-0 left-[70%] w-[2px] h-[40%] bg-gradient-to-b from-transparent via-[var(--color-secondary)] to-transparent blur-[2px]" 
          style={{ animation: 'beam-fall 12s linear infinite 3s' }}
        />
        <div 
          className="absolute top-0 left-[45%] w-[1px] h-[20%] bg-gradient-to-b from-transparent via-[var(--color-accent)] to-transparent blur-[1px]" 
          style={{ animation: 'beam-fall 10s linear infinite 5s' }}
        />
      </div>
    </div>
  );
};
