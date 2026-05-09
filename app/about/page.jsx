'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { HelpCircle, Plus, Minus, MessageCircle, Gamepad2, ShieldCheck, Palette, Users, Headphones, Info, Sparkles, Zap, Heart, Target, Eye, Award, ArrowRight, ChevronDown } from 'lucide-react';

/* ── FAQ Data ── */
const faqCategories = [
  { category: 'General', Icon: HelpCircle, questions: [
    { q: 'What is RovexEdits?', a: 'RovexEdits is a premium marketplace for Valorant inventory designs. We connect talented editors with clients looking for high-quality inventory showcases, banners, and social media content.' },
    { q: 'How do I download an edit?', a: 'Simply browse our gallery, click on any edit to view it in full size, then click the download button. All downloads are completely free and instant.' },
    { q: 'Are these edits safe to use?', a: 'Absolutely! These are just image templates for showcasing your Valorant inventory. They do not interact with the game in any way and are 100% safe.' },
  ]},
  { category: 'Services', Icon: Palette, questions: [
    { q: 'How do custom edits work?', a: 'Select a service package, make the payment, and share your inventory details with us. Our editors will create a custom design based on your preferences.' },
    { q: 'How long does delivery take?', a: 'Standard orders are delivered within 24 hours. Premium packages may take up to 48 hours depending on complexity.' },
    { q: 'What if I am not satisfied?', a: 'We offer revisions based on your package. If you are still unsatisfied, contact our support for assistance.' },
  ]},
  { category: 'Editors', Icon: Users, questions: [
    { q: 'How can I become an editor?', a: 'Contact the admin via WhatsApp or Discord with your portfolio. We review quality, creativity, and consistency before approval.' },
    { q: 'What are the benefits?', a: 'Editors get access to our platform to showcase their work, receive custom orders, build their reputation, and earn from their designs.' },
  ]},
  { category: 'Support', Icon: Headphones, questions: [
    { q: 'How do I contact support?', a: 'Reach us via WhatsApp for instant support, or join our Discord community. Our support team is available 7 days a week.' },
    { q: 'What payment methods are accepted?', a: 'We accept UPI, PayTM, Google Pay, and bank transfers for Indian customers. International customers can use PayPal.' },
  ]},
];

/* ── Animated Section Wrapper ── */
function RevealSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >{children}</motion.div>
  );
}

/* ── Floating Particle ── */
function Particle({ size, left, top, delay, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 0.6, 0], scale: [0, 1, 0], y: [0, -60, -120] }}
      transition={{ duration: 4, delay, repeat: Infinity, ease: 'easeOut' }}
      style={{ position: 'absolute', width: size, height: size, borderRadius: '50%', background: color, left, top, filter: 'blur(1px)', pointerEvents: 'none' }}
    />
  );
}

/* ── Main Page ── */
export default function AboutPage() {
  const [openItems, setOpenItems] = useState({});
  const [activeCategory, setActiveCategory] = useState('General');
  const [activeSection, setActiveSection] = useState('about');
  const toggleItem = (key) => setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  const activeFaqs = faqCategories.find(c => c.category === activeCategory)?.questions || [];

  const timelineSteps = [
    { year: '2023', title: 'The Beginning', desc: 'RovexEdits was founded with a vision to create the best Valorant design marketplace.', Icon: Sparkles, color: '#ff4655' },
    { year: '2024', title: 'Growing Community', desc: 'Expanded our editor team and served hundreds of satisfied clients across the globe.', Icon: Users, color: '#5865f2' },
    { year: '2025', title: 'Premium Evolution', desc: 'Launched advanced CDN infrastructure, custom editor dashboards, and premium tiers.', Icon: Award, color: '#00ffd4' },
    { year: 'Now', title: 'Industry Leader', desc: 'The most trusted platform for Valorant inventory designs with 1000+ edits delivered.', Icon: Target, color: '#a855f7' },
  ];

  const values = [
    { Icon: Heart, title: 'Passion-Driven', desc: 'Every design is crafted with genuine love for the game and its community.', gradient: 'linear-gradient(135deg, rgba(255,70,85,0.15), rgba(255,70,85,0.03))' },
    { Icon: Eye, title: 'Quality First', desc: 'We never compromise on quality. Every edit goes through a rigorous review process.', gradient: 'linear-gradient(135deg, rgba(0,255,212,0.12), rgba(0,255,212,0.02))' },
    { Icon: Zap, title: 'Lightning Fast', desc: 'Quick turnarounds without sacrificing design excellence. Most orders in 24h.', gradient: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(251,191,36,0.02))' },
    { Icon: ShieldCheck, title: 'Trust & Safety', desc: 'Secure transactions, verified editors, and transparent processes every step.', gradient: 'linear-gradient(135deg, rgba(88,101,242,0.12), rgba(88,101,242,0.02))' },
  ];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
      {/* Ambient Background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,70,85,0.08) 0%, transparent 65%)', filter: 'blur(80px)', top: '10%', left: '60%' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(88,101,242,0.06) 0%, transparent 70%)', filter: 'blur(60px)', bottom: '20%', left: '10%' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)', filter: 'blur(50px)', top: '50%', right: '5%' }} />
        <Particle size={4} left="15%" top="25%" delay={0} color="rgba(255,70,85,0.5)" />
        <Particle size={3} left="75%" top="35%" delay={1.2} color="rgba(0,255,212,0.4)" />
        <Particle size={5} left="45%" top="60%" delay={2} color="rgba(168,85,247,0.4)" />
        <Particle size={3} left="85%" top="70%" delay={0.8} color="rgba(251,191,36,0.4)" />
        <Particle size={4} left="25%" top="80%" delay={1.6} color="rgba(88,101,242,0.4)" />
      </div>

      {/* Hero Header */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 20px 36px', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(255,70,85,0.06)', color: '#ff4655', borderRadius: 9999, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', border: '1px solid rgba(255,70,85,0.1)', marginBottom: 14 }}>
              <Info size={12} /> About Us
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 10 }}>
            About <span className="text-gradient-shimmer">RovexEdits</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.4)', maxWidth: 520, margin: '0 auto 28px' }}>
            Learn about our story, values, and find answers to common questions.
          </motion.p>

          {/* Section Toggle */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'inline-flex', gap: 4, padding: 4, borderRadius: 9999, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {[{ key: 'about', label: 'Our Story', Icon: Sparkles }, { key: 'faq', label: 'FAQ', Icon: HelpCircle }].map(s => (
              <motion.button key={s.key} onClick={() => setActiveSection(s.key)}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{
                  padding: '9px 22px', borderRadius: 9999, fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', border: 'none',
                  display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.3s',
                  ...(activeSection === s.key
                    ? { background: '#ff4655', color: 'white', boxShadow: '0 4px 14px rgba(255,70,85,0.35)' }
                    : { background: 'transparent', color: 'rgba(255,255,255,0.45)' }),
                }}>
                <s.Icon size={14} /> {s.label}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ ABOUT SECTION ══════════ */}
      <AnimatePresence mode="wait">
        {activeSection === 'about' && (
          <motion.div key="about" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
            style={{ position: 'relative', zIndex: 1 }}>

            {/* Mission Statement */}
            <section style={{ padding: '40px 20px 50px', maxWidth: 800, margin: '0 auto' }}>
              <RevealSection>
                <div style={{ position: 'relative', padding: 'clamp(28px, 5vw, 44px)', borderRadius: 20, background: 'linear-gradient(135deg, rgba(255,70,85,0.06) 0%, rgba(88,101,242,0.04) 100%)', border: '1px solid rgba(255,70,85,0.12)', overflow: 'hidden', textAlign: 'center' }}>
                  <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,70,85,0.4), transparent)' }} />
                  <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', border: '1px solid rgba(255,70,85,0.08)', pointerEvents: 'none' }} />
                  <h2 style={{ fontSize: 'clamp(1.3rem, 3.5vw, 2rem)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 14, color: 'white' }}>
                    Our <span style={{ color: '#ff4655' }}>Mission</span>
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontSize: 'clamp(0.88rem, 2vw, 1rem)', maxWidth: 600, margin: '0 auto' }}>
                    To be the most trusted and creative platform for Valorant inventory designs. We empower talented editors to showcase their artistry while delivering stunning, premium-quality visuals to the gaming community worldwide.
                  </p>
                </div>
              </RevealSection>
            </section>

            {/* Core Values */}
            <section style={{ padding: '0 20px 50px', maxWidth: 900, margin: '0 auto' }}>
              <RevealSection>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
                    What We <span style={{ color: '#ff4655' }}>Stand For</span>
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.35)', maxWidth: 440, margin: '0 auto' }}>The principles that drive every pixel we create.</p>
                </div>
              </RevealSection>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {values.map((v, i) => (
                  <RevealSection key={i} delay={i * 0.08}>
                    <motion.div whileHover={{ scale: 1.03, y: -4 }} transition={{ type: 'spring', stiffness: 300 }}
                      style={{ padding: 24, borderRadius: 16, background: v.gradient, border: '1px solid rgba(255,255,255,0.06)', cursor: 'default', height: '100%' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, color: '#ff4655' }}>
                        <v.Icon size={18} />
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, marginBottom: 6, color: 'white' }}>{v.title}</h3>
                      <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{v.desc}</p>
                    </motion.div>
                  </RevealSection>
                ))}
              </div>
            </section>

            {/* Timeline */}
            <section style={{ padding: '0 20px 50px', maxWidth: 700, margin: '0 auto' }}>
              <RevealSection>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
                    Our <span className="text-gradient-shimmer">Journey</span>
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.35)', maxWidth: 400, margin: '0 auto' }}>From a small idea to a thriving creative platform.</p>
                </div>
              </RevealSection>
              <div style={{ position: 'relative', paddingLeft: 32 }}>
                {/* Vertical line */}
                <div style={{ position: 'absolute', left: 11, top: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg, rgba(255,70,85,0.4), rgba(168,85,247,0.3), rgba(0,255,212,0.2))', borderRadius: 2 }} />
                {timelineSteps.map((step, i) => (
                  <RevealSection key={i} delay={i * 0.12}>
                    <div style={{ position: 'relative', marginBottom: i < timelineSteps.length - 1 ? 28 : 0, paddingLeft: 24 }}>
                      {/* Dot */}
                      <motion.div animate={{ boxShadow: [`0 0 0 0 ${step.color}40`, `0 0 0 8px ${step.color}00`] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ position: 'absolute', left: -26, top: 18, width: 12, height: 12, borderRadius: '50%', background: step.color, border: '2px solid var(--color-bg)' }} />
                      <motion.div whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}
                        style={{ padding: 20, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'default' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: '0.68rem', fontWeight: 700, fontFamily: 'var(--font-mono)', background: `${step.color}18`, color: step.color, border: `1px solid ${step.color}30` }}>{step.year}</span>
                          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, color: 'white' }}>{step.title}</h3>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{step.desc}</p>
                      </motion.div>
                    </div>
                  </RevealSection>
                ))}
              </div>
            </section>

            {/* CTA to FAQ */}
            <section style={{ padding: '0 20px 20px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
              <RevealSection>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveSection('faq')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 9999, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.3s' }}>
                  <HelpCircle size={16} /> Have questions? Check our FAQ <ArrowRight size={14} />
                </motion.button>
              </RevealSection>
            </section>
          </motion.div>
        )}

        {/* ══════════ FAQ SECTION ══════════ */}
        {activeSection === 'faq' && (
          <motion.div key="faq" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
            style={{ position: 'relative', zIndex: 1 }}>
            <section style={{ padding: '20px 20px 0', maxWidth: 680, margin: '0 auto' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginBottom: 28 }}>
                {faqCategories.map(cat => (
                  <motion.button key={cat.category} onClick={() => setActiveCategory(cat.category)}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '7px 16px', borderRadius: 9999, fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.3s', border: 'none',
                      display: 'flex', alignItems: 'center', gap: 6,
                      ...(activeCategory === cat.category
                        ? { background: '#ff4655', color: 'white', boxShadow: '0 4px 14px rgba(255,70,85,0.35)' }
                        : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.06)' }),
                    }}>
                    <cat.Icon size={13} /> {cat.category}
                  </motion.button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activeFaqs.map((faq, i) => {
                  const key = `${activeCategory}-${i}`;
                  const isOpen = openItems[key];
                  return (
                    <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      style={{ borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: `1px solid ${isOpen ? 'rgba(255,70,85,0.12)' : 'rgba(255,255,255,0.06)'}`, overflow: 'hidden', transition: 'border-color 0.3s' }}>
                      <button onClick={() => toggleItem(key)} style={{
                        width: '100%', padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left',
                        background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500, gap: 12,
                      }}>
                        <span>{faq.q}</span>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,70,85,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4655', flexShrink: 0 }}>
                          {isOpen ? <Minus size={12} /> : <Plus size={12} />}
                        </div>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                            <div style={{ padding: '0 18px 16px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, fontSize: '0.82rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 12 }}>{faq.a}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              <div style={{ marginTop: 44, padding: 28, borderRadius: 18, background: 'rgba(255,70,85,0.05)', border: '1px solid rgba(255,70,85,0.1)', textAlign: 'center' }}>
                <ShieldCheck size={28} style={{ color: '#ff4655', margin: '0 auto 12px', display: 'block' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 6 }}>Still have questions?</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 18, fontSize: '0.85rem' }}>Contact our support team directly.</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
                  <a href="https://wa.me/9769606096" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MessageCircle size={14} /> WhatsApp</a>
                  <a href="https://discord.gg/RcanGzdcn" target="_blank" rel="noopener noreferrer" className="btn btn-purple" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Gamepad2 size={14} /> Discord</a>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
