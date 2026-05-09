'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, Gamepad2, AtSign, Mail, Zap, ArrowUpRight } from 'lucide-react';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/services', label: 'Services' },
  { href: '/reviews', label: 'Reviews' },
];

const companyLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/privacy', label: 'Privacy Policy' },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/admin') return null;

  return (
    <footer style={{ position: 'relative', marginTop: 80, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, marginBottom: 40 }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, textDecoration: 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,70,85,0.4)', background: 'linear-gradient(135deg, rgba(255,70,85,0.2), transparent)' }}>
                <img src="/logo.png" alt="RovexEdits" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.06em' }}>
                <span style={{ color: 'white' }}>ROVEX</span><span style={{ color: '#ff4655' }}>EDITS</span>
              </span>
            </Link>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', lineHeight: 1.6, maxWidth: 260 }}>
              The most trusted marketplace for premium Valorant inventory designs.
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginBottom: 14, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {footerLinks.map((link) => (
                <Link key={link.href} href={link.href} style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', textDecoration: 'none', transition: 'color 0.3s', display: 'flex', alignItems: 'center', gap: 4 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ff4655'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
                >{link.label}</Link>
              ))}
            </div>
          </div>

          {/* Company — About & Contact */}
          <div>
            <h4 style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginBottom: 14, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {companyLinks.map((link) => (
                <Link key={link.href} href={link.href} style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', textDecoration: 'none', transition: 'color 0.3s', display: 'flex', alignItems: 'center', gap: 5 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ff4655'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
                ><ArrowUpRight size={13} />{link.label}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginBottom: 14, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}><Zap size={13} /> Available 24/7</span>
              <a href="https://wa.me/9769606096" target="_blank" rel="noopener noreferrer" style={{ color: '#25d366', fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}><MessageCircle size={13} /> WhatsApp</a>
              <a href="https://discord.gg/RcanGzdcn" target="_blank" rel="noopener noreferrer" style={{ color: '#5865f2', fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}><Gamepad2 size={13} /> Discord</a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginBottom: 14, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Follow Us</h4>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { Icon: MessageCircle, color: '#25d366', href: 'https://wa.me/9769606096' },
                { Icon: Gamepad2, color: '#5865f2', href: 'https://discord.gg/RcanGzdcn' },
                { Icon: AtSign, color: '#E1306C', href: 'https://www.instagram.com/vai_bhav.03?igsh=aDA3Y201ejlwb3Fz' },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${s.color}15`, border: `1px solid ${s.color}30`, textDecoration: 'none', transition: 'all 0.3s', color: s.color }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = s.color; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = `${s.color}15`; e.currentTarget.style.color = s.color; e.currentTarget.style.transform = 'scale(1)'; }}
                ><s.Icon size={16} /></a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>&copy; {new Date().getFullYear()} RovexEdits. All Rights Reserved.</p>
          <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textDecoration: 'none', transition: 'color 0.3s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ff4655'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
          >Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
