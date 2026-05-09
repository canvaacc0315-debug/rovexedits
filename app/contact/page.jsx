'use client';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Twitter, Instagram, ArrowRight, Star, Shield, Zap, CheckCircle, Palette, Lock, Users, Image as ImageIcon, Gamepad2, BookOpen, GraduationCap, PlayCircle, Pencil, RefreshCw } from 'lucide-react';
import CountUp from '@/components/CountUp';
import TiltCard from '@/components/TiltCard';

const contactMethods = [
  { Icon: MessageCircle, title: 'WhatsApp', description: 'Fastest response time. Message us directly for instant support.', link: 'https://wa.me/9769606096', color: '#25d366', buttonText: 'Chat on WhatsApp' },
  { Icon: Gamepad2, title: 'Discord', description: 'Join our community server or DM the admin: vaibhavpatilpro', link: 'https://discord.gg/RcanGzdcn', color: '#5865f2', buttonText: 'Join Discord' },
  { Icon: Mail, title: 'Email', description: 'For business inquiries and partnerships. We reply within 24h.', link: 'mailto:vaibhavpatil0315@gmail.com', color: '#ff4655', buttonText: 'Send Email' },
];

const benefits = [
  { Icon: Zap, title: '24h Delivery', desc: 'Most orders completed within 24 hours' },
  { Icon: RefreshCw, title: 'Free Revisions', desc: 'Get revisions until you are satisfied' },
  { Icon: Lock, title: 'Secure Payment', desc: 'Protected transactions every time' },
  { Icon: Star, title: 'Premium Quality', desc: 'High-resolution professional designs' },
];

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <section style={{ padding: '60px 20px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(255,70,85,0.06)', color: '#ff4655', borderRadius: 9999, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', border: '1px solid rgba(255,70,85,0.1)', marginBottom: 14 }}>
            <MessageCircle size={12} /> Get In Touch
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 10 }}>Contact <span style={{ color: '#ff4655' }}>Us</span></h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: 460, margin: '0 auto' }}>Ready to elevate your Valorant presence? Reach out through any of these channels.</p>
        </div>
      </section>

      <section style={{ padding: '0 20px 60px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
          {contactMethods.map((m, i) => (
            <motion.div key={i} whileHover={{ y: -6 }} transition={{ duration: 0.3 }}
              style={{ padding: 28, borderRadius: 18, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, margin: '0 auto 18px', borderRadius: 14, background: `${m.color}12`, border: `1px solid ${m.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color }}>
                <m.Icon size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-display)' }}>{m.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: 22 }}>{m.description}</p>
              <a href={m.link} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '11px 22px', borderRadius: 9999, fontWeight: 500, fontSize: '0.82rem', textDecoration: 'none', transition: 'all 0.3s', background: `${m.color}12`, color: m.color, border: `1px solid ${m.color}25`, gap: 6 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = m.color; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = `${m.color}12`; e.currentTarget.style.color = m.color; }}>
                <m.Icon size={14} /> {m.buttonText}
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ padding: '0 20px 60px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ marginBottom: 30 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(255,70,85,0.06)', color: '#ff4655', borderRadius: 9999, fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', border: '1px solid rgba(255,70,85,0.1)', marginBottom: 14 }}>
            <Star size={10} /> Why Choose Us
          </span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 10 }}>The <span style={{ color: '#ff4655' }}>Best</span> in the Game</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem' }}>Elite editors delivering exceptional designs consistently.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side: Features list */}
          <div className="flex-1 flex flex-col gap-3">
            {[
              { Icon: Lock, title: 'Secure Transactions', desc: 'Protected payments and verified process' },
              { Icon: Zap, title: 'Fast Delivery', desc: '24-hour turnaround on most orders' },
              { Icon: CheckCircle, title: 'Verified Editors', desc: 'Rigorous quality checks for all designers' },
              { Icon: Pencil, title: 'Custom Designs', desc: 'Tailored to your exact preferences' },
            ].map((b, i) => (
              <TiltCard key={i} style={{ flex: 1, display: 'flex' }}>
                <div style={{ flex: 1, padding: 18, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(255,70,85,0.08)', border: '1px solid rgba(255,70,85,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4655', flexShrink: 0 }}>
                    <b.Icon size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>{b.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{b.desc}</p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>

          {/* Right Side: Stats grid */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Top Row */}
            <div style={{ display: 'flex', gap: 12, flex: 1 }}>
              {[
                { Icon: Users, value: 5, label: 'Expert Editors', suffix: '+' },
                { Icon: Star, value: 500, label: 'Happy Clients', suffix: '+' },
              ].map((s, i) => (
                <motion.div key={i} whileHover={{ y: -4 }} style={{ flex: 1, padding: 24, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                    <s.Icon size={18} color="#ff4655" />
                  </div>
                  <div style={{ height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 700, color: '#ff4655', fontFamily: 'var(--font-display)', marginBottom: 2 }}>
                    <CountUp to={s.value} suffix={s.suffix} />
                  </div>
                  <div style={{ height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Bottom Row */}
            <div style={{ display: 'flex', gap: 12, flex: 1 }}>
              {[
                { Icon: ImageIcon, value: 1000, label: 'Edits Created', suffix: '+' },
                { Icon: Star, value: 4.9, label: 'Avg Rating', suffix: '' },
              ].map((s, i) => (
                <motion.div key={i} whileHover={{ y: -4 }} style={{ flex: 1, padding: 24, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                    <s.Icon size={18} color="#ff4655" />
                  </div>
                  <div style={{ height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 700, color: '#ff4655', fontFamily: 'var(--font-display)', marginBottom: 2 }}>
                    <CountUp to={s.value} suffix={s.suffix} />
                  </div>
                  <div style={{ height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 20px', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ position: 'relative', padding: 'clamp(28px, 5vw, 44px)', borderRadius: 20, overflow: 'hidden', background: 'linear-gradient(135deg, rgba(255,70,85,0.1) 0%, rgba(255,70,85,0.04) 100%)', border: '1px solid rgba(255,70,85,0.18)' }}>
          <div className="flex flex-col md:grid md:grid-cols-[1.2fr_1fr] gap-7 md:items-center">
            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'rgba(255,70,85,0.12)', color: '#ff4655', borderRadius: 9999, fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                <Users size={10} /> Join Our Team
              </span>
              <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 10 }}>Become an Editor</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 18, lineHeight: 1.6, fontSize: '0.88rem' }}>Are you a talented designer? Join our elite roster and start earning.</p>
              <a href="https://wa.me/9769606096" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><ArrowRight size={14} /> Apply Now</a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[{ Icon: Users, v: '5+', l: 'Expert Editors' }, { Icon: ImageIcon, v: '500+', l: 'Happy Clients' }, { Icon: Star, v: '4.9', l: 'Avg. Rating' }, { Icon: Zap, v: '24h', l: 'Avg. Delivery' }].map((s, i) => (
                <div key={i} style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                  <div style={{ color: '#ff4655', marginBottom: 4, display: 'flex', justifyContent: 'center' }}><s.Icon size={14} /></div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ff4655', fontFamily: 'var(--font-display)' }}>{s.v}</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Want to Learn Editing */}
      <section style={{ padding: '40px 20px 0', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ position: 'relative', padding: 'clamp(28px, 5vw, 44px)', borderRadius: 20, overflow: 'hidden', background: 'linear-gradient(135deg, rgba(88,101,242,0.1) 0%, rgba(168,85,247,0.06) 100%)', border: '1px solid rgba(88,101,242,0.18)' }}>
          <div className="flex flex-col md:grid md:grid-cols-[1.2fr_1fr] gap-7 md:items-center">
            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'rgba(88,101,242,0.12)', color: '#5865f2', borderRadius: 9999, fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                <GraduationCap size={10} /> Learn &amp; Grow
              </span>
              <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 10 }}>Want to Learn Editing?</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 18, lineHeight: 1.6, fontSize: '0.88rem' }}>New to design? We offer mentorship and resources to help you master Valorant inventory editing from scratch.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <a href="https://wa.me/9769606096?text=Hi%2C%20I%20want%20to%20learn%20editing!" target="_blank" rel="noopener noreferrer" className="btn btn-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><MessageCircle size={14} /> Start Learning</a>
                <a href="https://discord.gg/RcanGzdcn" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderColor: 'rgba(88,101,242,0.25)', color: '#5865f2' }}><Gamepad2 size={14} /> Join Community</a>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { Icon: BookOpen, v: 'Pro', l: 'Guides' },
                { Icon: PlayCircle, v: '1-on-1', l: 'Mentorship' },
                { Icon: Pencil, v: 'Hands-On', l: 'Projects' },
                { Icon: GraduationCap, v: 'Certified', l: 'Portfolio' },
              ].map((s, i) => (
                <div key={i} style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                  <div style={{ color: '#5865f2', marginBottom: 4, display: 'flex', justifyContent: 'center' }}><s.Icon size={14} /></div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#5865f2', fontFamily: 'var(--font-display)' }}>{s.v}</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
