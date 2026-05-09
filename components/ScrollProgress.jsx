'use client';

import { motion, useScroll } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #ff4655, #ff8a94)',
        boxShadow: '0 0 10px rgba(255,70,85,0.5)',
        transformOrigin: '0%',
        scaleX: scrollYProgress,
        zIndex: 9999
      }}
    />
  );
}
