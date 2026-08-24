import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/**
 * SECTION — ABOUT iSMART INTERNATIONAL
 *
 * Three panels read as one horizontal move: the film states the vision, a
 * brushed-titanium plate states the mission, then the track slides to who we
 * are. Scrolling down drives the move while the section is pinned; once About
 * lands, the page releases and carries on down.
 *
 * The titanium panel is deliberately light — it breaks up an otherwise
 * unbroken run of dark surfaces without leaving the brand system.
 *
 * Desktop only, and only when motion is welcome — below 1024px and under
 * prefers-reduced-motion the same three panels simply stack vertically, so the
 * content is never dependent on the effect.
 */

const PANELS = [
  { id: 'film',    label: 'The vision'  },
  { id: 'mission', label: 'The mission' },
  { id: 'about',   label: 'Who we are'  },
];

export default function EcosystemPanels() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // The film only runs while it is actually on screen, and never against a
  // reduced-motion preference. The source is already trimmed to its 0:04 mark,
  // so the first painted frame is the intended one — no seeking, no black flash.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const stillness = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (stillness.matches) return; // poster frame stands in

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Autoplay can still be refused; the poster remains, so ignore it.
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );

    io.observe(video);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      () => {
        const track = trackRef.current;
        const container = containerRef.current;
        if (!track || !container) return;

        // Recomputed on refresh so resizes and font swaps stay accurate.
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            // Written straight to the DOM — a React state update per scroll
            // frame would re-render the whole section for no reason.
            onUpdate: (self) => {
              const p = self.progress;
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${p})`;
              }
              if (counterRef.current) {
                const i = Math.min(PANELS.length - 1, Math.round(p * (PANELS.length - 1)));
                const next = String(i + 1).padStart(2, '0');
                if (counterRef.current.textContent !== next) {
                  counterRef.current.textContent = next;
                }
              }
            },
          },
        });

        tl.to(track, { x: () => -distance(), ease: 'none' });
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-graphite-950">
      {/* Track: horizontal on desktop, stacked everywhere else. */}
      <div
        ref={trackRef}
        className="flex w-full flex-col items-stretch lg:h-screen lg:w-max lg:flex-row"
      >
        {/* ── Panel 1: The film — where the horizontal move begins ────────── */}
        <section className="ecosystem-panel relative flex min-h-[72vh] w-full shrink-0 items-end overflow-hidden bg-graphite-950 lg:h-full lg:min-h-0 lg:w-screen">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            poster="/video/moneywave-poster.webp"
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            aria-label="iSmart money-wave film"
          >
            {/* Full-weight file only where the viewport can use it. */}
            <source src="/video/moneywave-720.mp4" type="video/mp4" media="(min-width: 768px)" />
            <source src="/video/moneywave-540.mp4" type="video/mp4" />
          </video>

          {/* Scrim: bottom-weighted so the type stays readable over any frame. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite-950 via-graphite-950/45 to-graphite-950/15" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-graphite-950 to-transparent" />

          <div className="relative z-10 w-full px-6 pb-16 md:px-12 md:pb-20 lg:px-24 lg:pb-24">
            <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-5">
              <span className="eyebrow text-emerald-400">Our Vision</span>
              <h2 className="max-w-2xl font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-white md:text-5xl lg:text-6xl">
                The layer every African business builds on.
              </h2>
            </div>
          </div>
        </section>

        {/* ── Panel 2: The mission — bento cluster on brushed titanium ─────── */}
        <section className="ecosystem-panel surface-titanium relative flex w-full shrink-0 items-center overflow-hidden px-6 py-24 md:px-12 md:py-28 lg:h-full lg:w-screen lg:px-20 lg:py-0">
          {/* Leading edge carries the film's shadow onto the plate. */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-[16vw] bg-gradient-to-r from-graphite-950/75 to-transparent lg:block" />

          <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            {/* ── The statement ── */}
            <div className="flex flex-col items-start gap-5 text-left lg:col-span-5">
              <span className="eyebrow text-bronze-900">Our Mission</span>

              <h2 className="font-display text-3xl font-extrabold leading-[1.06] tracking-[-0.03em] text-graphite-950 md:text-5xl lg:text-[3.25rem]">
                One integration.<br />Every African market.
              </h2>

              <span className="block h-px w-28 bg-gradient-to-r from-bronze-600 to-emerald-700" />

              <p className="max-w-md text-base leading-relaxed text-graphite-700">
                Reliable, scalable payment and connectivity built so businesses can
                operate across African markets through a single, unified integration.
              </p>

              <a
                href="/solutions/ismartpay/"
                className="group mt-1 inline-flex items-center gap-2.5 rounded-full bg-graphite-950 px-7 py-3.5 font-display text-sm font-semibold text-white transition-all duration-300 hover:bg-graphite-800"
              >
                See how it works
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </a>
            </div>

            {/* ── Bento cluster. Frosted panels over metal, so the plate still
                   reads through them rather than being covered up. ── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">

              {/* Lead tile — the titanium card, with the rails it accepts */}
              <article className="bento group relative overflow-hidden sm:col-span-2">
                <h3 className="bento-title">Accept every rail through one integration</h3>

                <div className="relative mt-4 flex items-center gap-5">
                  {/* Emerald wash so the metal has something to catch */}
                  <div className="pointer-events-none absolute -left-8 -top-6 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
                  <div className="pointer-events-none absolute bottom-0 right-4 h-28 w-28 rounded-full bg-bronze-500/20 blur-3xl" />

                  <img
                    src="/silver-titanium-card.png"
                    alt=""
                    aria-hidden="true"
                    width="591"
                    height="379"
                    loading="lazy"
                    decoding="async"
                    className="relative w-[46%] max-w-[210px] rotate-[-7deg] rounded-xl shadow-[0_22px_44px_-16px_rgba(28,32,38,0.65)] transition-transform duration-700 ease-out group-hover:rotate-[-4deg] group-hover:scale-[1.03]"
                  />

                  <ul className="relative flex flex-1 flex-col gap-2">
                    {['Mobile Money', 'Cards', 'Bank transfer', 'QR payments'].map((rail) => (
                      <li
                        key={rail}
                        className="flex items-center gap-2.5 rounded-full bg-white/70 px-3.5 py-2 text-[0.8125rem] font-medium text-graphite-800 ring-1 ring-graphite-950/5"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                        {rail}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>

              {/* Settlement */}
              <article className="bento">
                <h3 className="bento-title">Settlement you can plan around</h3>
                <div className="mt-4 flex h-20 items-end gap-1.5" aria-hidden="true">
                  {[38, 52, 45, 64, 58, 76, 69, 88].map((h, i) => (
                    <span
                      key={i}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-emerald-700/35 to-emerald-600"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <p className="mt-3 text-xs text-graphite-700">
                  <span className="font-semibold text-graphite-950">T+1</span> across
                  every supported market
                </p>
              </article>

              {/* Time to live */}
              <article className="bento">
                <h3 className="bento-title">Go live in days, not quarters</h3>
                <div className="mt-4 rounded-lg bg-graphite-950 p-3 font-mono text-[0.6875rem] leading-relaxed text-silver-300">
                  <div><span className="text-emerald-400">POST</span> /v1/payments</div>
                  <div className="mt-1 flex items-center gap-1.5 text-silver-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    200 · settled
                  </div>
                </div>
                <p className="mt-3 text-xs text-graphite-700">
                  Sandbox keys the moment you sign up
                </p>
              </article>

            </div>
          </div>
        </section>


        {/* ── Panel 3: About iSmart International ──────────────────────────── */}
        <section className="ecosystem-panel relative flex w-full shrink-0 items-center overflow-hidden border-t border-white/5 px-6 py-24 md:px-12 md:py-32 lg:h-full lg:w-screen lg:border-t-0 lg:px-24 lg:py-0">
          <img
            src="/bronze-texture-bg-landscape.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-black/55" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,121,80,0.07),transparent_70%)]" />

          <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-8 text-center">
            <span className="eyebrow text-bronze-500">About iSmart International</span>

            <h2 className="max-w-3xl font-display text-4xl font-black leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
              Building Africa's Digital{' '}
              <span className="text-bronze-500">Financial</span> Infrastructure
            </h2>

            <p className="max-w-2xl text-base font-light leading-relaxed text-white/65 md:text-lg">
              iSmart International is a financial technology company engineering the
              core infrastructure that powers payments, connectivity, and digital
              commerce across Africa. We bridge fragmented markets with unified,
              high-throughput systems designed for the continent's unique economic
              landscape.
            </p>

            <a
              href="/company/about/"
              className="group mt-2 inline-flex items-center gap-3 rounded-full border border-bronze-600/30 bg-bronze-600/15 px-8 py-3.5 font-display text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-bronze-600/50 hover:bg-bronze-600/25"
            >
              Read More About Us
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </a>
          </div>
        </section>

      </div>

      {/* ── Progress rail: only meaningful while the track is moving ──────── */}
      <div className="pointer-events-none absolute bottom-10 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-4 lg:flex">
        <span className="font-mono text-[0.625rem] tracking-[0.3em] text-silver-500">
          <span ref={counterRef}>01</span>
          <span className="text-silver-600"> / 0{PANELS.length}</span>
        </span>

        <span className="relative block h-px w-28 overflow-hidden bg-white/12">
          <span
            ref={progressRef}
            className="absolute inset-0 origin-left bg-bronze-500"
            style={{ transform: 'scaleX(0)' }}
          />
        </span>

        <span className="font-mono text-[0.625rem] tracking-[0.25em] text-silver-600 uppercase">
          Scroll
        </span>
      </div>
    </div>
  );
}
