'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const variants = {
  primary: 'bg-gradient-to-r from-[#ff4655] to-[#ff6b7a] text-white border-transparent shadow-[0_4px_16px_rgba(255,70,85,0.3)]',
  secondary: 'bg-gradient-to-r from-[#5865f2] to-[#7b84f5] text-white border-transparent shadow-[0_4px_16px_rgba(88,101,242,0.3)]',
  outline: 'bg-transparent border-2 border-[#ff4655] text-[#ff4655] hover:bg-[#ff4655]/10',
  ghost: 'bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] hover:text-white',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 sm:px-8 py-3.5 text-sm sm:text-base',
};

export function GradientButton({
  children,
  href,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  external = false,
}) {
  const baseClasses = `
    relative inline-flex items-center justify-center gap-2
    font-semibold uppercase tracking-wider
    rounded-full overflow-hidden
    transition-all duration-300
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

  const MotionComponent = href ? motion(Link) : motion.button;

  return (
    <MotionComponent
      {...(href ? { href } : {})}
      {...(onClick ? { onClick } : {})}
      {...(external && href ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={baseClasses}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
        initial={{ x: '-200%' }}
        whileHover={{ x: '200%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
      <span className="relative z-10">{children}</span>
    </MotionComponent>
  );
}

export function MagneticButton({
  children,
  onClick,
  className = '',
}) {
  return (
    <motion.button
      onClick={onClick}
      className={className}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
}
