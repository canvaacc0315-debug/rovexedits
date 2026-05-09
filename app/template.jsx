'use client';

import { motion } from 'framer-motion';

export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.98, filter: 'blur(12px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // More dramatic cubic-bezier
        scale: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
      }}
      className="page-transition-wrapper"
    >
      {children}
    </motion.div>
  );
}
