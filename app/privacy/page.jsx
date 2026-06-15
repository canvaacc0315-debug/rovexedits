'use client';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, UserCheck, Mail, AlertTriangle, FileText } from 'lucide-react';
import { BannerAd } from '@/components/Ads/AdUnit';

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80, position: 'relative' }}>
      {/* Ambient */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(88,101,242,0.07) 0%, transparent 65%)', filter: 'blur(80px)', top: '10%', right: '20%' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,70,85,0.05) 0%, transparent 70%)', filter: 'blur(60px)', bottom: '30%', left: '15%' }} />
      </div>

      {/* Header */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 20px 36px', textAlign: 'center' }}>
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
            We respect your privacy and are committed to protecting your personal data.
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' }}>
            Last updated: May 2026
          </motion.p>
        </div>
      </section>

      {/* Ad: Middle of Privacy Page */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px 20px', position: 'relative', zIndex: 1 }}>
        <BannerAd slot="SLOT_PRIVACY_MID" />
      </div>

      {/* Content */}
      <section style={{ position: 'relative', zIndex: 1, padding: '20px 20px 0', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 'clamp(24px, 5vw, 40px)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, fontSize: '0.95rem' }}>
          
          <h2 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 600, marginBottom: '1rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '10px' }}><Eye size={20} color="#5865f2"/> 1. Information We Collect</h2>
          <p style={{ marginBottom: '2rem' }}>When you interact with RovexEdits, we collect certain personal information to provide and improve our services. This includes account information such as your name and email address when you register using our authentication providers (e.g., Clerk). We also collect usage data, which encompasses the pages you visit, the edits you view or download, and diagnostic information about your device, browser type, and operating system. Furthermore, any information you voluntarily provide through contact forms, reviews, or customer service interactions is securely stored to assist you better.</p>

          <h2 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 600, marginBottom: '1rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '10px' }}><Database size={20} color="#5865f2"/> 2. How We Use Your Information</h2>
          <p style={{ marginBottom: '2rem' }}>The data we collect serves multiple operational purposes. Primarily, it enables us to process and fulfill custom edit orders effectively, connecting you with the right editors and facilitating secure communication. We use your contact information to send you updates regarding your orders, respond to inquiries, and notify you about changes to our platform. Additionally, usage data is analyzed to monitor site performance, understand user behavior, and implement improvements to our user interface and feature set. We also utilize this data to detect and prevent fraudulent activities, ensuring a secure environment for all users.</p>

          <h2 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 600, marginBottom: '1rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '10px' }}><FileText size={20} color="#5865f2"/> 3. Cookies and Advertising (Google AdSense)</h2>
          <p style={{ marginBottom: '1rem' }}>RovexEdits uses cookies—small text files stored on your device—to enhance your browsing experience, maintain your session, and analyze site traffic. Essential cookies are necessary for the website to function correctly, while analytics cookies help us measure performance.</p>
          <p style={{ marginBottom: '2rem' }}>Importantly, we partner with third-party advertising networks, specifically <strong>Google AdSense</strong>. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your internet browsing history. You can opt out of personalized advertising by visiting the <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#5865f2', textDecoration: 'underline' }}>Google Ads Settings page</a>.</p>

          <h2 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 600, marginBottom: '1rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '10px' }}><UserCheck size={20} color="#5865f2"/> 4. Third-Party Service Providers</h2>
          <p style={{ marginBottom: '2rem' }}>To operate RovexEdits efficiently, we share specific data with trusted third-party service providers. This includes Firebase for our core database and backend infrastructure, Cloudinary and ImageKit for hosting and delivering high-resolution images, Clerk for managing user authentication and security, and Vercel for website hosting. These providers are bound by strict data processing agreements and are only permitted to handle your data in ways that are necessary to provide their respective services to us.</p>

          <h2 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 600, marginBottom: '1rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '10px' }}><Lock size={20} color="#5865f2"/> 5. Data Security and Protection</h2>
          <p style={{ marginBottom: '2rem' }}>We implement robust, industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. All data transmitted between your browser and our servers is encrypted using SSL/TLS protocols. Passwords and sensitive authentication tokens are hashed using bcrypt or managed securely by our authentication providers. While we strive to use commercially acceptable means to protect your data, please be aware that no method of transmission over the Internet or electronic storage is 100% secure.</p>

          <h2 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 600, marginBottom: '1rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '10px' }}><AlertTriangle size={20} color="#5865f2"/> 6. Your Data Rights</h2>
          <p style={{ marginBottom: '2rem' }}>Depending on your location, you may have specific rights regarding your personal data under laws such as the GDPR or CCPA. You have the right to request access to the personal data we hold about you, request corrections to any inaccurate data, or request the deletion of your account and associated personal information. You may also opt out of marketing communications at any time. To exercise any of these rights, please contact our support team using the details provided below.</p>

          <h2 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 600, marginBottom: '1rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '10px' }}><Mail size={20} color="#5865f2"/> 7. Contact Us</h2>
          <p style={{ marginBottom: '0.5rem' }}>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please reach out to us through our official channels:</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'rgba(255,255,255,0.8)' }}>
            <li>• Email: <a href="mailto:vaibhavpatil0315@gmail.com" style={{ color: '#5865f2', textDecoration: 'underline' }}>vaibhavpatil0315@gmail.com</a></li>
            <li>• WhatsApp: +91 9769606096</li>
            <li>• Discord: discord.gg/RcanGzdcn</li>
            <li>• Instagram: @vai_bhav.03</li>
          </ul>

        </div>

        {/* Footer Note */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          style={{ marginTop: 40, padding: 24, borderRadius: 14, background: 'rgba(88,101,242,0.04)', border: '1px solid rgba(88,101,242,0.1)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
            By using RovexEdits, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
