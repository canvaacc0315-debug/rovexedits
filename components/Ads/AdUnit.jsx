'use client';
import { useState, useEffect } from 'react';

export default function AdUnit({
  slot,
  format = 'auto',
  layout,
  className = '',
  style = {},
}) {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    // Default to 300x250 Medium Rectangle
    let adKey = '9bce10cc97782e7bf168a0bb5e478cdb'; 
    let width = 300;
    let height = 250;

    if (format === 'horizontal' || format === 'auto' || format === 'fluid') {
      if (window.innerWidth < 480) {
        adKey = 'd8d803ce1af8b8022e734c0e41e962eb'; // 320x50
        width = 320;
        height = 50;
      } else if (window.innerWidth < 768) {
        adKey = '32b919ff9c982a4ce364fd921c55cbbc'; // 468x60
        width = 468;
        height = 60;
      } else {
        adKey = '83bb8f0327c2a6f018d1214d9562e710'; // 728x90
        width = 728;
        height = 90;
      }
    } else if (format === 'vertical') {
      adKey = 'e412f9d9493da3bea697dbfbd7550dbf'; // 160x600
      width = 160;
      height = 600;
    }

    setConfig({ adKey, width, height });
  }, [format]);

  // Show nothing during SSR or if no config
  if (!config) return <div style={{ minHeight: 90 }} />; 

  // Safely render the ad using an isolated iframe so it doesn't break React hydration
  const htmlContent = `
    <html>
      <head>
        <style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }</style>
      </head>
      <body>
        <script>
          atOptions = {
            'key' : '${config.adKey}',
            'format' : 'iframe',
            'height' : ${config.height},
            'width' : ${config.width},
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/${config.adKey}/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className={`ad-unit ${className}`} style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center', width: '100%', ...style }}>
      <iframe
        srcDoc={htmlContent}
        width={config.width}
        height={config.height}
        frameBorder="0"
        scrolling="no"
        style={{ border: 'none', overflow: 'hidden', background: 'transparent', maxWidth: '100%' }}
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
