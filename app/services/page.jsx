'use client';
import { motion } from 'framer-motion';
import { Palette, Sparkles, ArrowRight, MessageCircle, Gamepad2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const services = [
  { Icon: Palette, title: 'Custom Inventory Edit', description: 'Get a personalized Valorant inventory showcase designed exactly to your preferences.', features: ['1 Custom Design', '2 Revisions', '24h Delivery', 'High Resolution'], popular: false },
  { Icon: Sparkles, title: 'Premium Bundle Pack', description: 'Get a personalized Valorant bundle pack designed exactly to your preferences.', features: ['Unlimited Edits (Active Pack)', 'Unlimited Revisions', '12h Delivery', 'High Resolution'], popular: true },
];

const processSteps = [
  { step: '01', title: 'Place Order', description: 'Choose your package and contact us via WhatsApp or Discord.' },
  { step: '02', title: 'Share Details', description: 'Send us your inventory screenshots and design preferences.' },
  { step: '03', title: 'Design Phase', description: 'Our expert editors craft your design with attention to every detail.' },
  { step: '04', title: 'Delivery', description: 'Receive your final design files in high resolution.' },
];

export default function ServicesPage() {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <section style={{ padding: '60px 20px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(255,70,85,0.06)', color: '#ff4655', borderRadius: 9999, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', border: '1px solid rgba(255,70,85,0.1)', marginBottom: 14 }}>
            <Sparkles size={12} /> Professional Services
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 12 }}>Our <span style={{ color: '#ff4655' }}>Services</span></h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: 480, margin: '0 auto', fontSize: '0.95rem' }}>Elevate your Valorant presence with our professional design services.</p>
        </div>
      </section>

      {/* Service Cards */}
      <section style={{ padding: '0 20px 80px', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {services.map((service, i) => (
            <motion.div key={i} whileHover={{ y: -8 }} transition={{ duration: 0.3 }}
              style={{
                position: 'relative', padding: '32px 28px', borderRadius: 20,
                background: service.popular ? 'linear-gradient(180deg, rgba(255,70,85,0.1) 0%, rgba(255,70,85,0.02) 100%)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${service.popular ? 'rgba(255,70,85,0.2)' : 'rgba(255,255,255,0.06)'}`,
              }}>
              {service.popular && (
                <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)' }}>
                  <span style={{ padding: '5px 14px', background: 'linear-gradient(135deg, #ff4655, #ff6b7a)', color: 'white', fontSize: '0.62rem', fontWeight: 700, borderRadius: 9999, textTransform: 'uppercase', letterSpacing: '0.1em', boxShadow: '0 4px 16px rgba(255,70,85,0.4)' }}>Most Popular</span>
                </div>
              )}
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,70,85,0.08)', border: '1px solid rgba(255,70,85,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4655', marginBottom: 20 }}>
                <service.Icon size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 12, fontFamily: 'var(--font-display)' }}>{service.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 24 }}>{service.description}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0' }}>
                {service.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                    <CheckCircle size={14} style={{ color: '#ff4655', flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>
              <a href="https://wa.me/9769606096" target="_blank" rel="noopener noreferrer"
                className={`btn ${service.popular ? 'btn-primary' : 'btn-ghost'}`}
                style={{ width: '100%', justifyContent: 'center', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <MessageCircle size={14} /> Contact Us
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section style={{ padding: '60px 20px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 10 }}>How It <span style={{ color: '#ff4655' }}>Works</span></h2>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Simple 4-step process to get your custom design</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          {processSteps.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }} style={{ textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, margin: '0 auto 18px', borderRadius: 16, background: 'rgba(255,70,85,0.08)', border: '1px solid rgba(255,70,85,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ff4655', fontFamily: 'var(--font-display)' }}>{item.step}</span>
              </div>
              <h3 style={{ fontWeight: 600, marginBottom: 6, fontSize: '1rem' }}>{item.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', lineHeight: 1.6 }}>{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 20px 80px', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ position: 'relative', padding: 'clamp(36px, 5vw, 52px)', borderRadius: 20, textAlign: 'center', background: 'linear-gradient(135deg, rgba(255,70,85,0.1) 0%, rgba(255,70,85,0.04) 100%)', border: '1px solid rgba(255,70,85,0.18)' }}>
          <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 10 }}>Ready to Get Started?</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 24, maxWidth: 380, margin: '0 auto 24px' }}>Contact us now to place your order.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
            <a href="https://wa.me/9769606096" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MessageCircle size={14} /> WhatsApp</a>
            <a href="https://discord.gg/RcanGzdcn" target="_blank" rel="noopener noreferrer" className="btn btn-purple" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Gamepad2 size={14} /> Discord</a>
          </div>
        </div>
      </section>
    </div>
  );
}
