'use client';

import { useEffect, useRef } from 'react';

/**
 * Google AdSense Ad Unit Component
 * 
 * Usage:
 *   <AdUnit slot="1234567890" format="auto" />          — Responsive auto-sized
 *   <AdUnit slot="1234567890" format="rectangle" />     — 300x250 rectangle
 *   <AdUnit slot="1234567890" format="horizontal" />    — Leaderboard/banner
 *   <AdUnit slot="1234567890" format="vertical" />      — Skyscraper
 *   <AdUnit slot="1234567890" format="fluid" layout="in-article" /> — In-article native
 * 
 * Props:
 *   slot       — Your AdSense ad unit slot ID (from AdSense dashboard)
 *   format     — 'auto' | 'rectangle' | 'horizontal' | 'vertical' | 'fluid'
 *   layout     — For fluid format: 'in-article' | 'in-feed'
 *   className  — Additional CSS class
 *   style      — Additional inline styles
 */

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-9545152753392718';

export default function AdUnit({
  slot,
  format = 'auto',
  layout,
  className = '',
  style = {},
}) {
  const adRef = useRef(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Don't load ads in development
    if (process.env.NODE_ENV === 'development') return;
    // Don't double-load
    if (isLoaded.current) return;

    try {
      if (adRef.current && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isLoaded.current = true;
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  // In development, show a placeholder
  if (process.env.NODE_ENV === 'development') {
    return (
      <div
        className={`ad-unit ad-placeholder ${className}`}
        style={{
          background: 'rgba(255,70,85,0.04)',
          border: '1px dashed rgba(255,70,85,0.2)',
          borderRadius: 12,
          padding: '20px 16px',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.25)',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          minHeight: format === 'rectangle' ? 250 : format === 'horizontal' ? 90 : 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
      >
        AD SPACE — {format.toUpperCase()} ({slot || 'no slot'})
      </div>
    );
  }

  return (
    <div className={`ad-unit ${className}`} style={{ overflow: 'hidden', ...style }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          ...(format === 'rectangle' ? { width: 300, height: 250 } : {}),
        }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format === 'rectangle' ? undefined : format}
        data-full-width-responsive={format === 'auto' ? 'true' : undefined}
        data-ad-layout={layout}
      />
    </div>
  );
}

/**
 * Horizontal banner ad — best for between sections
 */
export function BannerAd({ slot, className = '', style = {} }) {
  return (
    <div
      className={`ad-banner-wrapper ${className}`}
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '16px 20px',
        ...style,
      }}
    >
      <AdUnit slot={slot} format="auto" />
    </div>
  );
}

/**
 * In-feed ad — blends into content grids
 */
export function InFeedAd({ slot, className = '', style = {} }) {
  return (
    <div
      className={`ad-infeed-wrapper ${className}`}
      style={{
        borderRadius: 14,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.01)',
        border: '1px solid rgba(255,255,255,0.04)',
        ...style,
      }}
    >
      <AdUnit slot={slot} format="fluid" layout="in-feed" />
    </div>
  );
}

/**
 * In-article ad — best between paragraphs of content
 */
export function InArticleAd({ slot, className = '', style = {} }) {
  return (
    <div
      className={`ad-inarticle-wrapper ${className}`}
      style={{
        margin: '24px 0',
        ...style,
      }}
    >
      <AdUnit slot={slot} format="fluid" layout="in-article" />
    </div>
  );
}

/**
 * Sticky bottom ad — fixed to bottom of screen on mobile
 */
export function StickyBottomAd({ slot, className = '' }) {
  return (
    <div
      className={`ad-sticky-bottom ${className}`}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'var(--color-bg)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '4px 0',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <AdUnit slot={slot} format="horizontal" />
    </div>
  );
}
