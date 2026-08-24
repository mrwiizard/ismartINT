import { ISMARTPAY_URL } from '../config/site';
import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';

export default function NavigationOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen for toggle events from Astro header
    const handleToggle = () => setIsOpen(prev => !prev);
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    window.addEventListener('open-solutions-menu', handleOpen);
    window.addEventListener('close-solutions-menu', handleClose);
    window.addEventListener('toggle-solutions-menu', handleToggle);

    return () => {
      window.removeEventListener('open-solutions-menu', handleOpen);
      window.removeEventListener('close-solutions-menu', handleClose);
      window.removeEventListener('toggle-solutions-menu', handleToggle);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when open
      document.body.style.overflow = 'hidden';
      
      // GSAP Animations when opening
      if (overlayRef.current && contentRef.current) {
        gsap.killTweensOf([overlayRef.current, contentRef.current]);
        
        // Show overlay backdrop
        gsap.to(overlayRef.current, {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
          pointerEvents: 'auto'
        });

        // Slide in columns
        gsap.fromTo(contentRef.current.children, 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
        );

      }
    } else {
      document.body.style.overflow = '';
      
      // GSAP Animations when closing
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          pointerEvents: 'none'
        });
      }
    }
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-dark-bg/98 opacity-0 pointer-events-none transition-opacity duration-300 overflow-y-auto"
      style={{ display: 'block' }}
    >
      {/* Background Subtle Emerald Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,109,91,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(197,121,80,0.03),transparent_50%)] pointer-events-none" />

      {/* Grid Border Top glow */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-emerald/20 to-transparent" />

      {/* Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 min-h-screen flex flex-col justify-between relative">
        {/* Navigation Top Control */}
        <div className="flex justify-between items-center w-full mb-16">
          <div className="text-xs uppercase tracking-[0.3em] text-silver-muted font-mono font-medium">
            iSmart // Menu
          </div>
          <button 
            onClick={closeMenu}
            className="p-3 rounded-full border border-graphite-border text-silver-bright hover:text-white hover:border-brand-emerald transition-all duration-300 bg-graphite-dark hover:shadow-[0_0_15px_rgba(0,109,91,0.2)]"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu — only destinations that actually exist. This is also the
            phone navigation, since the audience switch is desktop-only. */}
        <div
          ref={contentRef}
          className="flex flex-grow flex-col justify-center gap-2 py-8"
        >
          {[
            { label: 'Personal',  href: '/personal/',  desc: 'Send, receive and manage money.' },
            { label: 'Business',  href: '/business/',  desc: 'Accept payments and scale across Africa.' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="group flex items-baseline justify-between gap-6 border-b border-graphite-border/60 py-6 transition-colors duration-300 hover:border-brand-emerald/50"
            >
              <span className="font-display text-3xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-brand-emerald md:text-5xl">
                {item.label}
              </span>
              <span className="hidden max-w-xs text-right text-sm text-silver-muted md:block">
                {item.desc}
              </span>
            </a>
          ))}

          <a
            href={ISMARTPAY_URL}
            onClick={closeMenu}
            className="group mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-brand-emerald px-8 py-4 font-display text-sm font-semibold text-white transition-all duration-300 hover:bg-emerald-600"
          >
            Go to iSmartPay
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </a>
        </div>

        {/* Footer info in overlay */}
        <div className="mt-12 border-t border-graphite-border pt-12">
          <p className="font-mono text-xs text-silver-muted/60">
            &copy; {new Date().getFullYear()} iSmart International. Designed for scale.
          </p>
        </div>
      </div>
    </div>
  );
}
