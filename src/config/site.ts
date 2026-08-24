/**
 * Single source of truth for anything environment- or deployment-specific.
 *
 * Nothing here should be repeated inline anywhere else in the site. If a URL
 * changes — a new domain, a staging origin, a moved product — it changes once,
 * in this file or in the environment, and every page follows.
 *
 * Override per environment without touching code:
 *
 *   SITE_URL=https://staging.ismartghana.com  npm run build
 *   ISMARTPAY_URL=https://sandbox.pay.ismartghana.com  npm run build
 */

const env = (key: string): string | undefined => {
  // import.meta.env covers the Vite/Astro build; process.env covers the config
  // file and any node-side tooling.
  const fromVite = (import.meta as any)?.env?.[key];
  const fromNode = typeof process !== 'undefined' ? process.env?.[key] : undefined;
  return fromVite || fromNode || undefined;
};

/** Canonical origin for this deployment. */
export const SITE_URL = env('SITE_URL') ?? 'https://ismartghana.com';

/** iSmartPay — the live PSP product, a separate application. */
export const ISMARTPAY_URL = env('ISMARTPAY_URL') ?? 'https://www.pay.ismartghana.com';
