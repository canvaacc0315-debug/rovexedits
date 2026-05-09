'use client';

import { motion } from 'framer-motion';

export function FloatingCard({ 
  children, 
  className = '', 
  delay = 0,
  duration = 4,
  floatRange = 10
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      <motion.div
        animate={{
          y: [0, -floatRange, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function HoverCard({ 
  children, 
  className = '',
  scale = 1.02,
  rotate = 2
}) {
  return (
    <motion.div
      whileHover={{ 
        scale, 
        rotate: rotate,
        transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function TiltCard({ children, className = '' }) {
  return (
    <motion.div
      whileHover={{ 
        rotateX: 5,
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
      style={{ perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
