'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  { name: 'KayoMain', handle: '@kayo_frags', text: 'Absolutely insane quality. The editor perfectly matched the pacing of my clips. Worth every penny!', rating: 5 },
  { name: 'JettDash', handle: '@jettx', text: 'Fast delivery and the 3D effects were unreal. Best Valorant edit I have ever purchased.', rating: 5 },
  { name: 'OmenShadow', handle: '@omen_tp', text: 'The color grading makes my clips look cinematic. Highly recommend RovexEdits to anyone.', rating: 5 },
  { name: 'ViperToxic', handle: '@viper_main', text: 'Clean transitions, great communication from the editor. Will definitely buy again.', rating: 5 },
];

export default function TestimonialSlider() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);

  return (
    <div ref={containerRef} style={{ padding: '60px 0', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 10 }}>
          Client <span style={{ color: '#ff4655' }}>Reviews</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>What the community says about our editors.</p>
      </div>

      <motion.div style={{ x, display: 'flex', gap: 24, padding: '0 40px', width: '200%' }}>
        {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
          <div key={i} style={{
            flex: '0 0 auto',
            width: 'clamp(300px, 80vw, 400px)',
            padding: 30,
            borderRadius: 20,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            position: 'relative'
          }}>
            <Quote size={40} color="rgba(255,70,85,0.1)" style={{ position: 'absolute', top: 20, right: 20 }} />
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} fill="#ff4655" color="#ff4655" />)}
            </div>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: 24 }}>"{t.text}"</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(255,70,85,0.2), rgba(88,101,242,0.2))', border: '1px solid rgba(255,255,255,0.1)' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{t.handle}</div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
