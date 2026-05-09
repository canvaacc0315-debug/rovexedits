'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard, LogIn } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/services', label: 'Services' },
  { href: '/editors', label: 'Editors' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/store', label: 'Store' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const [logoTaps, setLogoTaps] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogoTap = () => {
    const n = logoTaps + 1;
    setLogoTaps(n);
    if (n >= 5) { setLogoTaps(0); window.location.href = '/admin'; }
    setTimeout(() => setLogoTaps(0), 3000);
  };

  if (pathname === '/admin') return null;

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '0 16px' }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            marginTop: 10,
            borderRadius: 16,
            transition: 'all 0.5s ease',
            background: scrolled ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: `1px solid rgba(255,255,255,${scrolled ? 0.08 : 0.05})`,
            boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
              {/* Logo */}
              <Link href="/" onClick={handleLogoTap} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, overflow: 'hidden', border: '2px solid rgba(255,70,85,0.4)', background: 'linear-gradient(135deg, rgba(255,70,85,0.2), transparent)' }}>
                  <img src="/logo.png" alt="RovexEdits" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div><span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '0.06em', color: 'white' }}>ROVEX</span><span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '0.06em', color: '#ff4655' }}>EDITS</span></div>
              </Link>

              {/* Desktop Nav */}
              <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} style={{
                    padding: '7px 14px', fontSize: '0.82rem', fontWeight: 500, transition: 'all 0.3s', textDecoration: 'none', borderRadius: 8,
                    color: pathname === link.href ? '#ff4655' : 'rgba(255,255,255,0.5)',
                    background: pathname === link.href ? 'rgba(255,70,85,0.08)' : 'transparent',
                    border: pathname === link.href ? '1px solid rgba(255,70,85,0.15)' : '1px solid transparent',
                  }}>{link.label}</Link>
                ))}
              </div>

              {/* Right */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div className="desktop-nav">
                  {isSignedIn ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Link href="/editor-dashboard" className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'rgba(255,70,85,0.08)', color: '#ff4655', borderRadius: 9999, fontSize: '0.82rem', fontWeight: 500, border: '1px solid rgba(255,70,85,0.15)', textDecoration: 'none' }}>
                        <LayoutDashboard size={14} /> Dashboard
                      </Link>
                      <UserButton />
                    </div>
                  ) : (
                    <SignInButton mode="modal">
                      <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'linear-gradient(135deg, #ff4655, #ff6b7a)', color: 'white', borderRadius: 9999, fontSize: '0.82rem', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,70,85,0.4)' }}>
                        <LogIn size={14} /> Sign In
                      </button>
                    </SignInButton>
                  )}
                </div>

                {/* Mobile Hamburger */}
                <button className="mobile-only" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4, display: 'flex' }}>
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="mobile-only"
            style={{ position: 'fixed', top: 72, left: 16, right: 16, zIndex: 49, flexDirection: 'column', background: 'rgba(6,6,10,0.96)', backdropFilter: 'blur(24px)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', padding: '16px 0', boxShadow: '0 16px 48px rgba(0,0,0,0.6)' }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} style={{
                display: 'block', padding: '12px 24px', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', transition: 'background 0.2s',
                color: pathname === link.href ? '#ff4655' : 'rgba(255,255,255,0.6)',
                background: pathname === link.href ? 'rgba(255,70,85,0.06)' : 'transparent',
              }}>{link.label}</Link>
            ))}
            <div style={{ padding: '12px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 4 }}>
              {isSignedIn ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Link href="/editor-dashboard" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ff4655', fontSize: '0.85rem', textDecoration: 'none' }}>
                    <LayoutDashboard size={14} /> Dashboard
                  </Link>
                  <UserButton />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: '#ff4655', color: 'white', borderRadius: 9999, fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
                    <LogIn size={14} /> Sign In
                  </button>
                </SignInButton>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ height: 76 }} />
    </>
  );
}
