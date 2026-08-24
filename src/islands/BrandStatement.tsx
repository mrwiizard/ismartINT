import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SLIDES = [
  {
    mark: { src: "/ismart-icon.png", filter: 'brightness(0) saturate(100%) opacity(0.82)', w: 256, h: 256 },
    title: "Liquidity Infrastructure",
    desc: "Capital is dynamic. We build core infrastructure that enables funds to be stored, converted, and cleared in real time across systems. Re-routing the flow of value with absolute speed.",
},
  {
    mark: { src: "/mark-circuit-black.webp", filter: undefined, w: 320, h: 321 },
    title: "Unified Cross-Border Payments",
    desc: "Accept cards, local wallets, and bank transfers using a single integration point. Bridge transaction systems instantly across borders with secure automated routing.",
},
  {
    mark: { src: "/mark-circuit-bronze.webp", filter: 'brightness(0.65) saturate(1.05)', w: 320, h: 321 },
    title: "Enterprise Ledger Platform",
    desc: "Scale local and international enterprises with custom transaction ledgers, robust webhook systems, and automatic multi-currency payouts aligned with security compliance.",
},
  {
    mark: { src: "/ismart-circuit-mark.webp", filter: undefined, w: 401, h: 300 },
    title: "Peer-to-Peer Networks",
    desc: "Seamless connectivity for individuals. Real-time P2P mobile transfers, utilities payments, and secure personal wallets bringing the digital economy to everyone.",
},
  {
    mark: { src: "/new ismart logo.png", filter: 'brightness(0) saturate(100%) opacity(0.86)', w: 2349, h: 626 },
    title: "Interconnected Corridors",
    desc: "Bridging cross-border transaction channels across West, East, and Southern Africa. A unified network core for borderless financial movement across the continent.",
}
];

export default function BrandStatement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Word refs
  const w1 = useRef<HTMLDivElement>(null);
  const w2 = useRef<HTMLDivElement>(null);
  const w3 = useRef<HTMLDivElement>(null);
  const w4 = useRef<HTMLDivElement>(null);
  const w5 = useRef<HTMLDivElement>(null);

  // Dot and line refs
  const dotRef = useRef<HTMLDivElement>(null);
  const lineProgressRef = useRef<HTMLDivElement>(null);

  // Active Index tracker state
  const [activeIndex, setActiveIndex] = useState(0);
  const lastIndexRef = useRef(0);

  // Layout refresh on mount to resolve late-loading styles or shifts in Astro
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // 1. Scroll timeline for timeline line coloring, dot path, and word highlights
  useEffect(() => {
    let mm = gsap.matchMedia();

    const setupTimelineAnimations = (tl: gsap.core.Timeline) => {
      const words = [w1.current, w2.current, w3.current, w4.current, w5.current];
      
      // Animate line progress height and dot positioning over the first 80% of timeline duration
      tl.to(lineProgressRef.current, { height: '100%', ease: 'none', duration: 0.8 });
      tl.to(dotRef.current, { top: '100%', ease: 'none', duration: 0.8 }, '<');

      // Staggered word color transitions over 0.0 - 0.8 duration
      words.forEach((word, index) => {
        const startPos = (index / (words.length - 1)) * 0.8;
        
        tl.to(word, {
          color: '#C57950', // Active bronze glow highlight
          textShadow: '0 0 20px rgba(197, 121, 80, 0.35)',
          opacity: 1,
          scale: 1.05,
          duration: 0.12,
          ease: 'power1.out',
        }, startPos - 0.04 > 0 ? startPos - 0.04 : 0)
        .to(word, {
          color: '#202124', // Completed graphite dark settling
          textShadow: '0 0 0px rgba(0,0,0,0)',
          opacity: 0.3, // Dim non-active words
          scale: 1.0,
          duration: 0.12,
          ease: 'power1.in',
        }, startPos + 0.12 < 0.8 ? startPos + 0.12 : 0.78);
      });

      // Add a 20% empty duration buffer at the end to hold the pin at the last slide
      tl.to({}, { duration: 0.2 });
    };

    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: '+=450%', // Pinned scroll distance extended on desktop for comfortable reading
          scrub: 0.4,    // Fluid scrub catch-up
          pin: true,
          snap: {
            snapTo: 0.2, // Snaps dot exactly to 0%, 20%, 40%, 60%, 80%, 100% increments
            duration: { min: 0.2, max: 0.45 },
            delay: 0.03,
            ease: 'power1.inOut'
          },
          onUpdate: (self) => {
            const progress = self.progress;
            
            // Map scroll progress to indices based on segment thresholds
            let idx = 0;
            if (progress < 0.1) idx = 0;
            else if (progress < 0.3) idx = 1;
            else if (progress < 0.5) idx = 2;
            else if (progress < 0.7) idx = 3;
            else idx = 4;

            if (idx !== lastIndexRef.current) {
              lastIndexRef.current = idx;
              setActiveIndex(idx);
            }
          }
        }
      });
      setupTimelineAnimations(tl);
    });

    mm.add("(max-width: 1023px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: '+=220%', // Pinned scroll range on mobile
          scrub: true,
          pin: true,
          snap: {
            snapTo: 0.2,
            duration: { min: 0.2, max: 0.3 },
            delay: 0.02,
            ease: 'power1.inOut'
          },
          onUpdate: (self) => {
            const progress = self.progress;
            
            let idx = 0;
            if (progress < 0.1) idx = 0;
            else if (progress < 0.3) idx = 1;
            else if (progress < 0.5) idx = 2;
            else if (progress < 0.7) idx = 3;
            else idx = 4;

            if (idx !== lastIndexRef.current) {
              lastIndexRef.current = idx;
              setActiveIndex(idx);
            }
          }
        }
      });
      setupTimelineAnimations(tl);
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {/* Pinned height view frame */}
      <div ref={triggerRef} className="h-screen flex items-center bg-off-white relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-brand-emerald/5 blur-[130px] pointer-events-none" />
        
        {/* Subtle vertical background grid lines (Stripe style) */}
        <div className="absolute inset-x-0 top-0 bottom-0 max-w-7xl mx-auto w-full h-full grid grid-cols-5 pointer-events-none px-6 md:px-12 z-0" aria-hidden="true">
          <div className="border-r border-neutral-200/40 h-full"></div>
          <div className="border-r border-neutral-200/40 h-full"></div>
          <div className="border-r border-neutral-200/40 h-full"></div>
          <div className="border-r border-neutral-200/40 h-full"></div>
          <div className="h-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Interactive Explainer Cards (Stacked absolute layout) */}
          <div className="lg:col-span-6 relative h-[360px] md:h-[280px] lg:h-[340px]">
            {SLIDES.map((slide, index) => {
              const isActive = activeIndex === index;
              return (
                <div 
                  key={index}
                  className={`absolute inset-0 flex flex-col md:flex-row items-center gap-6 md:gap-8 p-6 md:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.14)] border border-white/35 transition-all duration-500 ease-out overflow-hidden ${
                    isActive 
                      ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
                      : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                  }`}
                >
                  {/* Silver Titanium Metal Card Background Image */}
                  <img 
                    src="/silver-titanium-card.png" 
                    alt="" 
                    aria-hidden="true" 
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-3xl z-0"
                  />
                  {/* Gradient sheet to lighten the left metallic region for perfect text readability while keeping the brushed metal texture visible */}
                  <div className="absolute inset-y-0 left-0 w-full md:w-[70%] bg-gradient-to-r from-white/88 via-white/55 to-transparent pointer-events-none z-0" />
                  
                  {/* Subtle lighting shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/25 pointer-events-none z-0" />

                  {/* Slide text details */}
                  <div className="flex-1 flex flex-col gap-4 text-left relative z-10">
                    
                    <h3 className="text-2xl md:text-3xl font-display font-extrabold text-neutral-950 leading-tight">
                      {slide.title}
                    </h3>
                    
                    <p className="text-xs md:text-sm text-neutral-800 font-semibold leading-relaxed">
                      {slide.desc}
                    </p>
                  </div>

                  {/* Right: Brandmark card — frosted metallic inset */}
                  <div className="w-24 h-24 md:w-36 md:h-36 bg-white/30 border border-white/50 rounded-2xl flex-shrink-0 flex items-center justify-center p-3 shadow-[inset_0_2px_8px_rgba(255,255,255,0.45)] relative group overflow-hidden backdrop-blur-[3px] z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,121,80,0.06),transparent_70%)]" />
                    {/* Each slide carries its own mark, so the brandmark
                        changes as the scroll advances — the flat icon opens the
                        run and the full lockup closes it. Marks supplied as
                        white artwork are driven to graphite for this light
                        card; the bronze circuit is only darkened, since at its
                        supplied brightness it reads 2.1:1 here. */}
                    <img
                      src={slide.mark.src}
                      alt=""
                      aria-hidden="true"
                      width={slide.mark.w}
                      height={slide.mark.h}
                      loading="lazy"
                      decoding="async"
                      className={`relative object-contain transition-all duration-700 ease-out ${
                        isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                      } ${slide.mark.w > 1000 ? 'h-auto w-4/5' : 'h-3/5 w-3/5'}`}
                      style={slide.mark.filter ? { filter: slide.mark.filter } : undefined}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Pinned Core Timeline Track */}
          <div className="lg:col-span-6 flex justify-center items-center h-[35vh] lg:h-[60vh]">
            <div className="relative flex items-stretch h-full gap-8 md:gap-16">
              
              {/* Timeline Vertical Progress Wire */}
              <div className="relative w-[2px] bg-neutral-200/80 flex-shrink-0">
                <div
                  ref={lineProgressRef}
                  className="absolute top-0 left-0 w-full h-0 bg-brand-emerald shadow-[0_0_10px_rgba(0,109,91,0.5)] transition-all duration-300 ease-out"
                />
                <div
                  ref={dotRef}
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-brand-bronze border-2 border-off-white shadow-[0_0_12px_rgba(197,121,80,0.7)] transition-all duration-300 ease-out"
                />
              </div>

              {/* Stacked Word Options */}
              <div className="flex flex-col justify-between h-full py-2">
                <div
                  ref={w1}
                  className="text-3xl md:text-5xl font-display font-black tracking-widest text-neutral-300 transition-all duration-300 select-none opacity-50 origin-left"
                >
                  MONEY
                </div>
                <div
                  ref={w2}
                  className="text-3xl md:text-5xl font-display font-black tracking-widest text-neutral-300 transition-all duration-300 select-none opacity-50 origin-left"
                >
                  PAYMENTS
                </div>
                <div
                  ref={w3}
                  className="text-3xl md:text-5xl font-display font-black tracking-widest text-neutral-300 transition-all duration-300 select-none opacity-50 origin-left"
                >
                  BUSINESSES
                </div>
                <div
                  ref={w4}
                  className="text-3xl md:text-5xl font-display font-black tracking-widest text-neutral-300 transition-all duration-300 select-none opacity-50 origin-left"
                >
                  PEOPLE
                </div>
                <div
                  ref={w5}
                  className="text-3xl md:text-5xl font-display font-black tracking-widest text-neutral-300 transition-all duration-300 select-none opacity-50 origin-left"
                >
                  AFRICA
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
