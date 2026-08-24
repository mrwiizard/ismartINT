import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, ArrowRight, CreditCard, QrCode, Smartphone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function PaymentShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // Desktop: pin viewport and scrub step based on vertical scroll
      const trigger = ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        pin: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const step = Math.min(3, Math.floor(progress * 4));
          setActiveStep(step);
        }
      });
      return () => trigger.kill();
    });

    mm.add("(max-width: 1023px)", () => {
      // Mobile: auto-loop steps
      const interval = setInterval(() => {
        setActiveStep(prev => (prev + 1) % 4);
      }, 3000);
      return () => clearInterval(interval);
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {/* Pinned height trigger on desktop, normal stacked section on mobile */}
      <div ref={triggerRef} className="h-auto lg:h-screen py-16 lg:py-0 bg-off-white flex items-center relative overflow-hidden">
        {/* Subtle glow grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,109,91,0.02),transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">

          {/* Left: Product Story Descriptions */}
          <div className="lg:col-span-5 flex flex-col gap-6 z-10 text-text-dark">
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-brand-emerald font-semibold">
              // iSmartPay — our PSP
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-gradient-silver leading-tight">
              Payments should feel invisible.
            </h2>
            <p className="text-sm md:text-base text-text-muted leading-relaxed">
              Accepting money should be as simple as making a call. iSmartPay, the payment service provider built on iSmart infrastructure, links mobile wallets, cards, and bank networks into one unified gateway — handling routing and security details automatically.
            </p>

            {/* Stepper Details */}
            <div className="flex flex-col gap-4 mt-4 lg:mt-6">
              {[
                { label: 'Mobile Money', desc: 'Accept wallets seamlessly (MTN, Telecel, AirtelTigo)' },
                { label: 'Card Processing', desc: 'Sleek localized Visa, Mastercard, and Verve clearing' },
                { label: 'USSD Dial Integration', desc: 'Interactive prompt authorization without data connection' },
                { label: 'Scan to Pay (QR)', desc: 'Instant QR generation for banking and mobile scans' }
              ].map((step, idx) => {
                const isActive = idx === activeStep;
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-4 pl-4 border-l-2 transition-all duration-300 ${isActive ? 'border-brand-emerald pl-5 lg:pl-6 opacity-100' : 'border-neutral-200 opacity-40'
                      }`}
                  >
                    <div className="flex-grow">
                      <h4 className={`text-sm lg:text-base font-bold transition-colors ${isActive ? 'text-brand-emerald' : 'text-text-dark'}`}>
                        {step.label}
                      </h4>
                      <p className="text-xs lg:text-sm text-text-muted mt-1">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Floating Smartphone Viewport */}
          <div className="lg:col-span-7 flex justify-center items-center relative">

            {/* Background metallic decorative ring */}
            <div className="absolute w-[320px] md:w-[450px] h-[320px] md:h-[450px] rounded-full border border-neutral-200 opacity-60 pointer-events-none" />
            <div className="absolute w-[320px] md:w-[450px] h-[320px] md:h-[450px] rounded-full border border-brand-emerald/10 scale-95 animate-pulse-slow pointer-events-none" />

            {/* Phone Container - Refined Silver-Metallic frame */}
            <div className="relative w-[280px] md:w-[300px] h-[540px] md:h-[580px] rounded-[48px] border-4 border-neutral-300 bg-neutral-200 p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden">
              {/* Phone Speaker/Camera Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-neutral-300 rounded-b-2xl z-20 flex items-center justify-center">
                <div className="w-12 h-1 bg-neutral-400/80 rounded-full" />
              </div>

              {/* Glowing internal backdrop */}
              <div className="absolute inset-0 bg-graphite-dark z-0" />
              <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-emerald/10 blur-3xl pointer-events-none" />

              {/* Screen Container - Polished Graphite screen for contrast */}
              <div className="w-full h-full rounded-[36px] bg-graphite-dark p-5 md:p-6 relative flex flex-col justify-between overflow-hidden z-10 text-silver-bright">
                {/* Status Bar */}
                <div className="flex justify-between items-center text-[10px] text-silver-muted font-mono mb-4 mt-2">
                  <span>9:41 AM</span>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-brand-emerald" />
                    <span className="text-[9px]">Secure API</span>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow flex flex-col justify-center relative">

                  {/* STEP 1: MOBILE MONEY SCREEN */}
                  <div className={`absolute inset-0 flex flex-col justify-between transition-all duration-500 transform ${activeStep === 0 ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-95 pointer-events-none'
                    }`}>
                    <div className="flex flex-col gap-4">
                      <div className="text-xs uppercase tracking-wider text-brand-emerald font-mono">Mobile Money</div>
                      <div className="text-2xl md:text-3xl font-display font-bold text-white">GHS 250.00</div>
                      <div className="text-[10px] text-silver-muted font-mono">Invoice: #ISM-9823</div>

                      {/* Providers grid */}
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {['MTN MoMo', 'Telecel Cash', 'AT Money'].map((provider, i) => (
                          <div key={i} className="bg-graphite-light p-2 rounded-xl border border-graphite-border/60 text-center flex flex-col items-center gap-1">
                            <div className="w-6 h-6 rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center font-mono text-[9px] font-bold">
                              M
                            </div>
                            <span className="text-[8px] font-mono text-silver-muted truncate w-full">{provider}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="w-full py-3 bg-brand-emerald text-white rounded-full font-display font-semibold text-xs tracking-wide shadow-[0_0_15px_rgba(0,109,91,0.3)] cursor-pointer">
                      Authorize MoMo Request
                    </button>
                  </div>

                  {/* STEP 2: CARD SCREEN */}
                  <div className={`absolute inset-0 flex flex-col justify-between transition-all duration-500 transform ${activeStep === 1 ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-95 pointer-events-none'
                    }`}>
                    <div className="flex flex-col gap-4">
                      <div className="text-xs uppercase tracking-wider text-silver-muted font-mono">Card Payment</div>

                      {/* Glassmorphic Credit Card */}
                      <div className="w-full h-28 md:h-32 rounded-2xl bg-gradient-to-br from-brand-emerald/30 to-graphite-light border border-white/10 p-4 flex flex-col justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] mt-2">
                        <div className="flex justify-between items-start">
                          <CreditCard className="h-5 w-5 text-white" />
                          <span className="text-[9px] font-mono text-white/50">iSmart Gold</span>
                        </div>
                        <div>
                          <div className="text-xs md:text-sm font-mono text-white tracking-widest">••••  ••••  8829</div>
                          <div className="flex justify-between items-end mt-1.5">
                            <span className="text-[8px] font-mono text-white/50">IZZY COOPER</span>
                            <span className="text-[8px] font-mono text-white/50">12/29</span>
                          </div>
                        </div>
                      </div>

                      {/* Input fields mock */}
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="bg-graphite-light p-2.5 rounded-xl border border-graphite-border/60 text-xs text-silver-muted font-mono">
                          CVV: •••
                        </div>
                      </div>
                    </div>

                    <button className="w-full py-3 bg-white text-graphite-dark rounded-full font-display font-semibold text-xs tracking-wide shadow-[0_0_15px_rgba(255,255,255,0.3)] cursor-pointer">
                      Pay GHS 250.00
                    </button>
                  </div>

                  {/* STEP 3: USSD SCREEN */}
                  <div className={`absolute inset-0 flex flex-col justify-between transition-all duration-500 transform ${activeStep === 2 ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-95 pointer-events-none'
                    }`}>
                    <div className="flex flex-col gap-4">
                      <div className="text-xs uppercase tracking-wider text-brand-bronze font-mono">USSD Dial Gateway</div>
                      <div className="bg-graphite-light p-2.5 rounded-xl border border-graphite-border/60 text-center font-mono text-xs text-brand-bronze mt-2">
                        *110# Dialed...
                      </div>

                      {/* Mock prompt dialog box */}
                      <div className="bg-graphite-light border border-graphite-border rounded-2xl p-3.5 shadow-xl mt-3 flex flex-col gap-2">
                        <h5 className="text-[9px] uppercase font-mono text-silver-muted">Prompt Message</h5>
                        <p className="text-[11px] text-white leading-relaxed font-mono">
                          Authorize debit of GHS 250.00. Enter PIN:
                        </p>
                        <div className="w-full h-8 bg-black/40 rounded border border-graphite-border flex items-center px-3 text-xs text-white font-mono">
                          ••••
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="w-1/2 py-2.5 bg-graphite-light text-silver-muted border border-graphite-border rounded-full font-mono text-[9px] cursor-pointer">
                        Cancel
                      </button>
                      <button className="w-1/2 py-2.5 bg-brand-bronze text-white rounded-full font-mono text-[9px] font-bold cursor-pointer">
                        Confirm
                      </button>
                    </div>
                  </div>

                  {/* STEP 4: SCAN TO PAY */}
                  <div className={`absolute inset-0 flex flex-col justify-between transition-all duration-500 transform ${activeStep === 3 ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-95 pointer-events-none'
                    }`}>
                    <div className="flex flex-col gap-4 items-center">
                      <div className="text-xs uppercase tracking-wider text-brand-emerald font-mono text-center">Scan QR Code</div>

                      <div className="relative w-36 h-36 border border-brand-emerald/30 bg-graphite-light rounded-2xl flex items-center justify-center p-4 mt-2 overflow-hidden">
                        <QrCode className="h-24 w-24 text-white" />

                        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-brand-emerald shadow-[0_0_10px_#006D5B] animate-bounce" style={{ animationDuration: '3s' }} />
                      </div>

                      <span className="text-[9px] text-silver-muted font-mono text-center mt-2">
                        Position code within grid lines
                      </span>
                    </div>

                    <button className="w-full py-3 bg-brand-emerald text-white rounded-full font-display font-semibold text-xs tracking-wide shadow-[0_0_15px_rgba(0,109,91,0.3)] cursor-pointer">
                      Download Merchant QR
                    </button>
                  </div>

                </div>

                {/* Home Indicator line */}
                <div className="w-20 h-1 bg-graphite-border rounded-full mx-auto mt-2" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
