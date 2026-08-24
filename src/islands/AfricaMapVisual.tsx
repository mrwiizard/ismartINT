import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Country nodes mapping on the 400x400 SVG grid
const COUNTRIES = [
  { name: 'Ghana', node: [150, 212], label: [70, 240], align: 'end', id: 'ghana' },
  { name: "Cote d'Ivoire", node: [125, 205], label: [45, 205], align: 'end', id: 'cote' },
  { name: 'Burkina Faso', node: [138, 178], label: [95, 135], align: 'end', id: 'burkina' },
  { name: 'Senegal', node: [90, 160], label: [35, 160], align: 'end', id: 'senegal' },
  { name: 'Rwanda', node: [242, 265], label: [180, 310], align: 'end', id: 'rwanda' },
  { name: 'Kenya', node: [265, 245], label: [325, 245], align: 'start', id: 'kenya' }
];

export default function AfricaMapVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const connectionPathRef = useRef<SVGPathElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeNodes, setActiveNodes] = useState<string[]>([]);

  useEffect(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const trigger = ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        pin: true,
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);

          // Animate the path stroke-dashoffset based on scroll
          if (connectionPathRef.current) {
            const length = connectionPathRef.current.getTotalLength();
            connectionPathRef.current.style.strokeDasharray = `${length}`;
            connectionPathRef.current.style.strokeDashoffset = `${length * (1 - progress)}`;
          }

          // Sequence country activation
          const count = COUNTRIES.length;
          const activated: string[] = [];
          COUNTRIES.forEach((c, idx) => {
            const threshold = idx / (count - 1);
            if (progress >= threshold - 0.05) {
              activated.push(c.id);
            }
          });
          setActiveNodes(activated);
        }
      });
      return () => trigger.kill();
    });

    mm.add("(max-width: 1023px)", () => {
      // Mobile fallback: All hubs connected and lit up instantly
      setActiveNodes(COUNTRIES.map(c => c.id));
      setScrollProgress(1);
      if (connectionPathRef.current) {
        connectionPathRef.current.style.strokeDashoffset = '0';
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {/* Pinned section wrapper */}
      <div ref={triggerRef} className="h-auto lg:h-screen py-20 lg:py-0 bg-graphite-dark flex items-center relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2D2E32_1px,transparent_1px),linear-gradient(to_bottom,#2D2E32_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full h-full grid grid-cols-1 lg:grid-cols-12 items-center relative gap-12 lg:gap-0">

          {/* Left Side: Stats and Info */}
          <div className="lg:col-span-5 flex flex-col gap-6 z-10 text-white">
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-brand-bronze font-semibold">
              // Direct Connectivity
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white leading-tight">
              Built in Africa.<br />Designed for the world.
            </h2>
            <p className="text-sm md:text-base text-silver-muted leading-relaxed max-w-md">
              iSmart's payment and eSIM networks link primary economic corridors in Africa to global markets, allowing companies to scale treasury and cellular operations seamlessly.
            </p>

            {/* Operates stats */}
            <div className="mt-4 lg:mt-8 flex items-center gap-12 border-t border-graphite-border/30 pt-6 lg:pt-8">
              <div>
                <div className="text-3xl lg:text-4xl font-display font-black text-white">6</div>
                <div className="text-xs uppercase tracking-widest text-silver-muted mt-1">Active Markets</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-display font-black text-brand-emerald">100%</div>
                <div className="text-xs uppercase tracking-widest text-silver-muted mt-1">Interconnected</div>
              </div>
            </div>

            {/* Hub list */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-5">
              {COUNTRIES.map((c, idx) => {
                const isActive = activeNodes.includes(c.id);
                return (
                  <React.Fragment key={c.id}>
                    {idx > 0 && <span className="text-silver-muted/20 select-none text-[10px] md:text-xs font-mono">•</span>}
                    <span 
                      className={`text-[10px] md:text-xs font-mono transition-all duration-500 ${
                        isActive 
                          ? 'text-brand-bronze font-bold' 
                          : 'text-silver-muted/45'
                      }`}
                    >
                      {c.name}
                    </span>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Right Side: High-Fidelity 3D Africa Map Image — Enlarged Layout */}
          <div className="lg:col-span-7 w-full h-[55vh] lg:h-[80vh] flex items-center justify-center relative overflow-visible">
            <div className="absolute w-80 h-80 rounded-full bg-brand-bronze/5 blur-3xl pointer-events-none" />

            <img
              src="/africa-map-detailed.png"
              alt="3D metallic Africa map highlighting iSmart's active markets in Ghana, Côte d'Ivoire, Burkina Faso, Senegal, Kenya, and Rwanda"
              className="w-full max-w-[620px] lg:max-w-[780px] xl:max-w-[880px] h-auto object-contain drop-shadow-[0_28px_80px_rgba(0,0,0,0.55)] transition-transform duration-700 hover:scale-[1.03] lg:scale-[1.12] lg:translate-x-[4%] origin-center"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
