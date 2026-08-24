import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, Shield, Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function DeveloperConsole() {
  const containerRef = useRef<HTMLDivElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0); // 0: initial, 1: typing req, 2: pulsing, 3: showing response

  const requestJson = `{
  "amount": 250.00,
  "currency": "GHS",
  "method": "mobile_money",
  "provider": "mtn"
}`;

  const responseJson = `{
  "status": "200_OK",
  "transaction_id": "ISM_88301_GHS",
  "state": "completed",
  "settlement": "instant"
}`;

  const [typedRequest, setTypedRequest] = useState('');

  useEffect(() => {
    // Setup scroll trigger to start typing animation
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 70%',
      onEnter: () => {
        if (step === 0) {
          startSequence();
        }
      }
    });

    return () => {
      trigger.kill();
    };
  }, [step]);

  const startSequence = () => {
    setStep(1);
    
    // Type request JSON
    let currentText = '';
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex < requestJson.length) {
        currentText += requestJson[charIndex];
        setTypedRequest(currentText);
        charIndex++;
      } else {
        clearInterval(typingInterval);
        
        // Trigger pulse/processing delay
        setTimeout(() => {
          setStep(2);
          
          // Animate bronze glow on console border
          if (consoleRef.current) {
            gsap.fromTo(consoleRef.current,
              { boxShadow: '0 0 0px rgba(197, 121, 80, 0)' },
              { 
                boxShadow: '0 0 35px rgba(197, 121, 80, 0.25)', 
                borderColor: '#C09078',
                duration: 0.6, 
                yoyo: true, 
                repeat: 1,
                onComplete: () => {
                  setStep(3);
                }
              }
            );
          }
        }, 600);
      }
    }, 15);
  };

  return (
    <div ref={containerRef} className="w-full py-20 bg-dark-bg relative overflow-hidden">
      {/* Background radial accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-emerald/3 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left column: Context & Pitch */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-brand-emerald">
            // Developer Platform
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white leading-tight">
            Build on iSmart.
          </h2>
          <p className="text-base text-silver-muted leading-relaxed">
            Direct integration routes for modern engineers. Access payment gateways, cellular profiles, and ledger settlement layers through clean REST endpoints.
          </p>

          <div className="flex flex-col gap-4 mt-4 text-xs font-mono text-silver-muted">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-brand-emerald" />
              <span>TLS 1.3 / AES-256 Encryption Standards</span>
            </div>
            <div className="flex items-center gap-3">
              <Terminal className="h-4 w-4 text-brand-bronze" />
              <span>120ms average transaction response</span>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Console */}
        <div className="lg:col-span-7 w-full flex justify-center">
          
          <div 
            ref={consoleRef}
            className="w-full max-w-xl rounded-2xl border border-graphite-border bg-graphite-dark shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300"
          >
            {/* Header controls bar */}
            <div className="flex justify-between items-center px-6 py-4 bg-black/40 border-b border-graphite-border/60">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/40" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/40" />
                <span className="w-3 h-3 rounded-full bg-green-500/40" />
              </div>
              <span className="text-xs font-mono text-silver-muted">POST // payments_gateway_v1</span>
              <button 
                onClick={startSequence}
                disabled={step > 0 && step < 3}
                className="p-1 px-3 text-[10px] font-mono rounded bg-brand-emerald/10 text-brand-emerald hover:bg-brand-emerald/20 transition-all border border-brand-emerald/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>Run</span>
              </button>
            </div>

            {/* Console workspace */}
            <div className="p-6 font-mono text-xs leading-relaxed text-silver-bright flex flex-col gap-6 min-h-[340px]">
              
              {/* Request Block */}
              <div>
                <div className="flex items-center gap-3 text-silver-muted mb-2">
                  <span className="text-[10px] uppercase font-bold text-brand-emerald">Request</span>
                  <span className="text-[10px]">POST /v1/payments</span>
                </div>
                {step === 0 ? (
                  <span className="text-silver-muted/30">Click 'Run' or scroll down to execute request...</span>
                ) : (
                  <pre className="text-brand-emerald bg-black/20 p-4 rounded-xl border border-graphite-border/30 overflow-x-auto whitespace-pre-wrap">
                    <code>{typedRequest}</code>
                  </pre>
                )}
              </div>

              {/* Processing Overlay state */}
              {step === 2 && (
                <div className="flex items-center justify-center gap-3 text-brand-bronze text-[11px] font-bold animate-pulse">
                  <span>Routing payment logic through cellular gateways...</span>
                </div>
              )}

              {/* Response Block */}
              {step === 3 && (
                <div className="border-t border-graphite-border/40 pt-4 animate-fade-in">
                  <div className="flex items-center justify-between text-silver-muted mb-2">
                    <span className="text-[10px] uppercase font-bold text-brand-bronze">Response</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-brand-emerald/20 text-brand-emerald font-bold font-mono">
                      200 SUCCESS
                    </span>
                  </div>
                  <pre className="text-silver-bright bg-black/20 p-4 rounded-xl border border-graphite-border/30 overflow-x-auto whitespace-pre-wrap">
                    <code>{responseJson}</code>
                  </pre>
                  <div className="mt-3 flex items-center justify-end">
                    <span className="text-[10px] text-brand-emerald font-bold tracking-wider uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-ping" />
                      Payment Processed Successfully
                    </span>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
