'use client';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, UserCheck, Mail, AlertTriangle, FileText } from 'lucide-react';

const sections = [
  {
    Icon: Eye,
    title: 'Information We Collect',
    content: [
      'When you use RovexEdits, we may collect the following types of information:',
      '• Account information (name, email) when you sign in via our authentication provider.',
      '• Usage data such as pages visited, edits viewed, and downloads made.',
      '• Device and browser information for analytics and site optimization.',
      '• Any information you voluntarily provide through reviews or contact forms.',
    ],
  },
  {
    Icon: Database,
    title: 'How We Use Your Information',
    content: [
      'We use collected information to:',
      '• Provide and improve our services and user experience.',
      '• Process and fulfill custom edit orders.',
      '• Communicate with you regarding orders, updates, and support.',
      '• Analyze site usage to enhance performance and features.',
      '• Prevent fraud and ensure platform security.',
    ],
  },
  {
    Icon: Lock,
    title: 'Data Protection',
    content: [
      'We take your data security seriously:',
      '• All data transmissions are encrypted using SSL/TLS protocols.',
      '• Passwords are hashed using industry-standard bcrypt encryption.',
      '• Access to personal data is restricted to authorized personnel only.',
      '• We regularly review and update our security practices.',
    ],
  },
  {
    Icon: UserCheck,
    title: 'Third-Party Services',
    content: [
      'We use trusted third-party services to operate our platform:',
      '• Firebase (Google) — Database and backend services.',
      '• Cloudinary & ImageKit — Image hosting and CDN delivery.',
      '• Clerk — Authentication and user management.',
      '• Vercel — Website hosting and deployment.',
      'These services have their own privacy policies and handle data per their terms.',
    ],
  },
  {
    Icon: FileText,
    title: 'Cookies & Tracking',
    content: [
      '• We use essential cookies to maintain your session and preferences.',
      '• Analytics cookies help us understand how visitors interact with the site.',
      '• You can disable cookies in your browser settings at any time.',
      '• We do not sell or share cookie data with advertisers.',
    ],
  },
  {
    Icon: AlertTriangle,
    title: 'Your Rights',
    content: [
      'You have the right to:',
      '• Access the personal data we hold about you.',
      '• Request correction or deletion of your personal data.',
      '• Opt out of marketing communications at any time.',
      '• Request a copy of your data in a portable format.',
      'To exercise these rights, contact us via WhatsApp or Discord.',
    ],
  },
  {
    Icon: Mail,
    title: 'Contact Us',
    content: [
      'If you have any questions or concerns about this Privacy Policy, please reach out:',
      '• WhatsApp: +91 9769606096',
      '• Discord: discord.gg/RcanGzdcn',
      '• Instagram: @vai_bhav.03',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80, position: 'relative' }}>
      {/* Ambient */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(88,101,242,0.07) 0%, transparent 65%)', filter: 'blur(80px)', top: '10%', right: '20%' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,70,85,0.05) 0%, transparent 70%)', filter: 'blur(60px)', bottom: '30%', left: '15%' }} />
      </div>

      {/* Header */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 20px 36px', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(88,101,242,0.08)', color: '#5865f2', borderRadius: 9999, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', border: '1px solid rgba(88,101,242,0.15)', marginBottom: 14 }}>
              <Shield size={12} /> Legal
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 10 }}>
            Privacy <span style={{ color: '#5865f2' }}>Policy</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.4)', maxWidth: 480, margin: '0 auto 8px' }}>
            Your privacy matters to us. Here is how we handle your data.
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' }}>
            Last updated: May 2026
          </motion.p>
        </div>
      </section>

      {/* Sections */}
      <section style={{ position: 'relative', zIndex: 1, padding: '20px 20px 0', maxWidth: 740, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sections.map((section, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}
              style={{ padding: 'clamp(20px, 4vw, 28px)', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', transition: 'border-color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(88,101,242,0.2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(88,101,242,0.1)', border: '1px solid rgba(88,101,242,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5865f2', flexShrink: 0 }}>
                  <section.Icon size={16} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'white' }}>{section.title}</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 48 }}>
                {section.content.map((line, j) => (
                  <p key={j} style={{ fontSize: '0.84rem', color: line.startsWith('•') ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.5)', lineHeight: 1.7, paddingLeft: line.startsWith('•') ? 4 : 0 }}>{line}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          style={{ marginTop: 40, padding: 24, borderRadius: 14, background: 'rgba(88,101,242,0.04)', border: '1px solid rgba(88,101,242,0.1)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
            By using RovexEdits, you agree to this Privacy Policy. We may update this policy periodically — check back for the latest version.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
