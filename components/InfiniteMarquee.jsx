'use client';

import { motion } from 'framer-motion';

export default function InfiniteMarquee({ items }) {
  // Duplicate items to ensure smooth infinite looping
  const marqueeItems = [...items, ...items, ...items];

  return (
    <div style={{
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      position: 'relative',
      width: '100%',
      padding: '24px 0',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.02), transparent)',
      borderTop: '1px solid rgba(255,255,255,0.03)',
      borderBottom: '1px solid rgba(255,255,255,0.03)',
      maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
    }}>
      <motion.div
        animate={{ x: ['0%', '-33.3333%'] }}
        transition={{ ease: 'linear', duration: 25, repeat: Infinity }}
        style={{ display: 'inline-flex', gap: 60, paddingLeft: 60 }}
      >
        {marqueeItems.map((item, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12,
            opacity: 0.5,
            fontSize: '0.9rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            {item.icon && <span style={{ color: '#ff4655' }}>{item.icon}</span>}
            <span>{item.text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
