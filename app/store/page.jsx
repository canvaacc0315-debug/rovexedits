'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Store, ShieldCheck, ExternalLink, MessageCircle, Users, Loader2 } from 'lucide-react';
import { getAllStoreLinks } from '@/lib/db';

export default function StorePage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllStoreLinks();
        setLinks(data);
      } catch (err) {
        console.error('Failed to load store links:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stores = links.filter(l => l.type === 'store');
  const whatsappGroups = links.filter(l => l.type === 'whatsapp');

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
        >
          <Loader2 size={32} color="#ff4655" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>Loading store links...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 80 }}>
      {/* ── Trusted Account Stores ── */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(255,70,85,0.08)', color: '#ff4655', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', border: '1px solid rgba(255,70,85,0.15)', marginBottom: 20 }}>
            <Store size={14} /> Account Marketplace
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 20, lineHeight: 1.1 }}>
            Trusted Account <span style={{ color: '#ff4655' }}>Stores</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 600, margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Want to buy, sell, or trade your account? Visit these verified and trusted websites for the best deals and secure transactions.
          </p>
        </div>

        {stores.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
            <Store size={40} color="rgba(255,255,255,0.15)" style={{ marginBottom: 16 }} />
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.95rem' }}>No stores listed yet. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 30 }}>
            {stores.map((store, i) => (
              <motion.a 
                href={store.url}
                target="_blank"
                rel="noopener noreferrer"
                key={store.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
                style={{ 
                  textDecoration: 'none',
                  display: 'block',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 24,
                  padding: 30,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  height: 4, 
                  background: `linear-gradient(90deg, transparent, ${store.color}, transparent)` 
                }} />
                
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: 16, 
                    background: 'rgba(255,255,255,0.05)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: `1px solid ${store.color}33`,
                    overflow: 'hidden'
                  }}>
                    {store.image ? (
                      <img src={store.image} alt={`${store.name} logo`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Store size={28} color={store.color} />
                    )}
                  </div>
                  {store.verified && (
                    <span style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 4, 
                      background: 'rgba(0,255,212,0.1)', 
                      color: '#00ffd4', 
                      padding: '4px 10px', 
                      borderRadius: 9999, 
                      fontSize: '0.7rem', 
                      fontWeight: 600 
                    }}>
                      <ShieldCheck size={12} /> Verified
                    </span>
                  )}
                </div>
                
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'white', marginBottom: 12 }}>
                  {store.name}
                </h2>
                
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 24, minHeight: 70 }}>
                  {store.description}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  color: store.color, 
                  fontWeight: 600, 
                  fontSize: '0.9rem' 
                }}>
                  Visit Store <ExternalLink size={16} />
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </section>

      {/* ── WhatsApp Community Groups ── */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px', marginTop: 100 }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(37,211,102,0.08)', color: '#25d366', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', border: '1px solid rgba(37,211,102,0.15)', marginBottom: 20 }}>
            <MessageCircle size={14} /> Community
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 20, lineHeight: 1.1 }}>
            WhatsApp <span style={{ color: '#25d366' }}>Groups</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 600, margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Join our WhatsApp community groups to connect with other editors, get updates, and find exclusive deals.
          </p>
        </div>

        {whatsappGroups.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(37,211,102,0.02)', borderRadius: 24, border: '1px solid rgba(37,211,102,0.08)' }}>
            <MessageCircle size={40} color="rgba(255,255,255,0.15)" style={{ marginBottom: 16 }} />
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.95rem' }}>No WhatsApp groups listed yet. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {whatsappGroups.map((group, i) => (
              <motion.a
                href={group.url}
                target="_blank"
                rel="noopener noreferrer"
                key={group.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.02 }}
                style={{
                  textDecoration: 'none',
                  display: 'block',
                  background: 'rgba(37,211,102,0.03)',
                  border: '1px solid rgba(37,211,102,0.1)',
                  borderRadius: 20,
                  padding: 24,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'border-color 0.3s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(37,211,102,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(37,211,102,0.1)'}
              >
                {/* Green glow line at top */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: 'linear-gradient(90deg, transparent, #25d366, transparent)',
                  opacity: 0.6
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: 'rgba(37,211,102,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(37,211,102,0.2)',
                    flexShrink: 0,
                    overflow: 'hidden'
                  }}>
                    {group.image ? (
                      <img src={group.image} alt={group.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="#25d366">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'white', marginBottom: 4 }}>
                      {group.name}
                    </h3>
                    {group.verified && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                        background: 'rgba(0,255,212,0.1)',
                        color: '#00ffd4',
                        padding: '2px 8px',
                        borderRadius: 9999,
                        fontSize: '0.65rem',
                        fontWeight: 600
                      }}>
                        <ShieldCheck size={10} /> Verified
                      </span>
                    )}
                  </div>
                </div>

                {group.description && (
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: 16 }}>
                    {group.description}
                  </p>
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#25d366',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}>
                  <Users size={15} />
                  Join Group
                  <ExternalLink size={14} style={{ marginLeft: 'auto' }} />
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
