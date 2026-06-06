'use client';
import { motion } from 'framer-motion';
import { FileText, Shield, CheckCircle } from 'lucide-react';
import { BannerAd } from '@/components/Ads/AdUnit';

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80, position: 'relative' }}>
      {/* Ambient */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,70,85,0.05) 0%, transparent 65%)', filter: 'blur(80px)', top: '10%', right: '20%' }} />
      </div>

      {/* Header */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 20px 36px', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(255,70,85,0.08)', color: '#ff4655', borderRadius: 9999, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', border: '1px solid rgba(255,70,85,0.15)', marginBottom: 14 }}>
              <FileText size={12} /> Legal
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 10 }}>
            Terms of <span style={{ color: '#ff4655' }}>Service</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.4)', maxWidth: 480, margin: '0 auto 8px' }}>
            Please read these terms carefully before using RovexEdits.
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' }}>
            Last updated: May 2026
          </motion.p>
        </div>
      </section>

      {/* Ad: Middle of Terms Page */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px 20px', position: 'relative', zIndex: 1 }}>
        <BannerAd slot="SLOT_TERMS_MID" />
      </div>

      {/* Content */}
      <section style={{ position: 'relative', zIndex: 1, padding: '20px 20px 0', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 'clamp(24px, 5vw, 40px)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, fontSize: '0.95rem' }}>
          
          <h2 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 600, marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>1. Acceptance of Terms</h2>
          <p style={{ marginBottom: '2rem' }}>By accessing and using RovexEdits ("the Site", "we", "us", or "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. RovexEdits is an independent platform and is not affiliated with, endorsed by, or sponsored by Riot Games or Valorant.</p>

          <h2 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 600, marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>2. Description of Service</h2>
          <p style={{ marginBottom: '2rem' }}>RovexEdits is a digital marketplace and gallery that connects digital artists and editors with clients seeking custom inventory showcases, banners, and digital graphics. We facilitate the display, ordering, and delivery of digital image files based on video game aesthetics.</p>

          <h2 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 600, marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>3. User Accounts</h2>
          <p style={{ marginBottom: '2rem' }}>To access certain features, you may be required to register for an account using third-party authentication (e.g., Google or Discord). You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>

          <h2 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 600, marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>4. Intellectual Property & Copyright</h2>
          <p style={{ marginBottom: '1rem' }}><strong>Riot Games IP:</strong> All in-game assets, character names, weapon designs, and related intellectual property belong exclusively to Riot Games. The edits provided by our creators are derivative works intended for personal, non-commercial use (such as social media banners or profile pictures) under fair use guidelines.</p>
          <p style={{ marginBottom: '2rem' }}><strong>Editor IP:</strong> The specific design composition, layout, and effects applied to the edits remain the intellectual property of the respective editor. By purchasing an edit, you are granted a non-exclusive license to use the final image, but you may not resell or claim the artwork as your own creation.</p>

          <h2 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 600, marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>5. Payments, Refunds, and Revisions</h2>
          <p style={{ marginBottom: '2rem' }}>All transactions for custom services are final once the final high-resolution file is delivered. We offer revision cycles as stated in our service packages to ensure your satisfaction. If you cancel an order before the editor has commenced work, a full refund may be issued at our discretion. We are not responsible for transactions processed outside of our recommended payment channels.</p>

          <h2 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 600, marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>6. Prohibited Conduct</h2>
          <p style={{ marginBottom: '2rem' }}>Users agree not to use the platform to harass, abuse, or harm others; upload malicious code or viruses; impersonate any person or entity; or attempt to bypass any security measures of the Site.</p>

          <h2 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 600, marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>7. Limitation of Liability</h2>
          <p style={{ marginBottom: '2rem' }}>In no event shall RovexEdits, its administrators, or its affiliated editors be liable for any indirect, incidental, special, or consequential damages arising out of your use or inability to use the site or services. The services are provided "as is" without warranties of any kind.</p>

          <h2 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 600, marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>8. Third-Party Advertisements</h2>
          <p style={{ marginBottom: '2rem' }}>This site uses Google AdSense and other third-party advertising partners to display ads. These partners may use cookies and web beacons to collect information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.</p>

          <h2 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 600, marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>9. Changes to Terms</h2>
          <p style={{ marginBottom: '1rem' }}>We reserve the right to modify these Terms of Service at any time. We will notify users of any significant changes by updating the "Last updated" date at the top of this page. Your continued use of the site following such changes constitutes your acceptance of the new Terms.</p>

        </div>
      </section>
    </div>
  );
}
