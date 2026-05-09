'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllEdits, incrementDownloads, getApprovedReviews } from '@/lib/db';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, ArrowRight, Shield, Zap, CheckCircle, Sparkles, Download, X, Clock, Users, Star, Image as ImageIcon, Heart, Trophy, Crosshair, Quote, MessageSquare } from 'lucide-react';
import CountUp from '@/components/CountUp';
import TiltCard from '@/components/TiltCard';
import InfiniteMarquee from '@/components/InfiniteMarquee';
export default function HomePage() {
  const [featuredEdits, setFeaturedEdits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const [vaibhavEdits, setVaibhavEdits] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [displayedReviews, setDisplayedReviews] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const fetched = await getAllEdits();
        const vEdits = fetched.filter(e => {
          const name = e.editorName?.toLowerCase() || '';
          return name.includes('vaibhav') || name.includes('va1bhav');
        });
        setVaibhavEdits(vEdits);
        if (vEdits.length > 0) {
          const shuffled = [...vEdits].sort(() => 0.5 - Math.random());
          setFeaturedEdits(shuffled.slice(0, 3));
        }
        // Fetch approved reviews
        const reviews = await getApprovedReviews();
        setAllReviews(reviews);
        if (reviews.length > 0) {
          const shuffled = [...reviews].sort(() => 0.5 - Math.random());
          setDisplayedReviews(shuffled.slice(0, Math.min(2, shuffled.length)));
        }
      } catch (err) { console.error('Failed to load data', err); }
      finally { setLoading(false); }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (vaibhavEdits.length <= 3) return;
    const interval = setInterval(() => {
      setFeaturedEdits(() => {
        const shuffled = [...vaibhavEdits].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [vaibhavEdits]);

  useEffect(() => {
    if (allReviews.length <= 2) return;
    const interval = setInterval(() => {
      setDisplayedReviews(() => {
        const shuffled = [...allReviews].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 2);
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [allReviews]);


  const handleDownload = async (edit) => {
    try { await incrementDownloads(edit.id); window.open(edit.imageUrl, '_blank'); }
    catch (err) { console.error('Download failed', err); }
  };

  return (
    <>      <div style={{ minHeight: '100vh' }}>
      {/* Ambient Glow */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,70,85,0.1) 0%, transparent 65%)', filter: 'blur(80px)', top: '5%', left: '50%', transform: 'translateX(-50%)' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(88,101,242,0.06) 0%, transparent 70%)', filter: 'blur(60px)', bottom: '20%', left: '15%' }} />
      </div>

      {/* Hero */}
      <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px 60px', zIndex: 1 }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 9999, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 28 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff4655', boxShadow: '0 0 10px rgba(255,70,85,0.6)' }} />
              <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Trusted by multiple sellers and communities</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: 'clamp(2.2rem, 8vw, 4.5rem)', fontWeight: 800, marginBottom: 18, lineHeight: 1.1, fontFamily: 'var(--font-display)' }}>
            Premium <span className="text-gradient-shimmer">Valorant</span> Edits
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)', color: 'rgba(255,255,255,0.4)', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
            The most trusted marketplace for high-quality Valorant inventory designs. Crafted by top-tier editors, loved by the community.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
            <Link href="/gallery" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Palette size={16} /> Browse Gallery
            </Link>
            <Link href="/services" className="btn btn-ghost" style={{ padding: '12px 28px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              Our Services <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 56, maxWidth: 560, margin: '56px auto 0' }}>
            {[
              { icon: <Clock size={16} />, value: 2, label: 'Years Experience', suffix: '+' },
              { icon: <ImageIcon size={16} />, value: 1000, label: 'Edits Created', suffix: '+' },
              { icon: <Zap size={16} />, value: 24, label: 'Fast Delivery', suffix: 'h' },
            ].map((stat, i) => (
              <motion.div key={i} whileHover={{ scale: 1.04, borderColor: 'rgba(255,70,85,0.2)' }}
                style={{ textAlign: 'center', padding: '18px 12px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.3s' }}>
                <div style={{ color: '#ff4655', marginBottom: 6, display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                <div style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)', fontWeight: 700, color: '#ff4655', fontFamily: 'var(--font-display)' }}>
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Marquee Section */}
      <InfiniteMarquee items={[
        { text: 'TRUSTED BY TOP SELLERS', icon: <Heart size={16} /> },
        { text: 'PREMIUM QUALITY', icon: <Trophy size={16} /> },
        { text: 'FAST DELIVERY', icon: <Zap size={16} /> },
        { text: 'VERIFIED EDITORS', icon: <CheckCircle size={16} /> },
        { text: 'SECURE TRANSACTIONS', icon: <Shield size={16} /> },
        { text: 'CUSTOM DESIGNS', icon: <Crosshair size={16} /> }
      ]} />

      {/* Featured */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(255,70,85,0.06)', color: '#ff4655', borderRadius: 9999, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', border: '1px solid rgba(255,70,85,0.1)', marginBottom: 14 }}>
              <Sparkles size={12} /> Featured Work
            </span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 10 }}>
              Editor <span style={{ color: '#ff4655' }}>Picks</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: 460, margin: '0 auto', fontSize: '0.95rem' }}>Featured edits.</p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
              <div style={{ width: 36, height: 36, border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #ff4655', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : featuredEdits.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <p style={{ color: 'rgba(255,255,255,0.3)' }}>No edits yet. Upload your first edit!</p>
            </div>
          ) : (
            <div className="gallery-grid">
              <AnimatePresence mode="popLayout">
                {featuredEdits.map((edit, i) => (
                  <motion.div key={edit.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    layout
                  >
                    <TiltCard className="edit-card">
                      <div onClick={() => setLightbox(edit)}>
                        <div className="card-img-wrap" style={{ aspectRatio: '16/10' }}>
                          <img className="card-img" src={edit.thumbUrl || edit.imageUrl} alt={edit.name} loading="lazy" />
                        </div>
                        <div style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <div>
                              <div className="card-title" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                                {edit.name} {edit.tier === 'high-prem' ? '💗' : edit.tier === 'mid-prem' ? '🔥' : ''}
                              </div>
                              <div className="card-meta" style={{ marginTop: 4, textTransform: 'capitalize' }}>
                                {edit.tier.replace('-', ' ')} • {edit.style} Style
                              </div>
                            </div>
                            <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: 9999, fontFamily: 'var(--font-mono)', border: '1px solid rgba(255,255,255,0.06)' }}>
                              {edit.downloads} DLs
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
                            <span style={{ color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.9rem' }}>{edit.editorName}</span>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                              {edit.editorWhatsapp && (
                                <a href={`https://wa.me/${edit.editorWhatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn btn-wa" onClick={(e) => e.stopPropagation()}>WHATSAPP</a>
                              )}
                              {edit.editorAvatar && (
                                <img src={edit.editorAvatar} alt={edit.editorName} style={{ width: 32, height: 32, borderRadius: '50%', border: `2px solid ${edit.tier === 'high-prem' ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)'}`, objectFit: 'cover' }} />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 40 }}><Link href="/gallery" className="btn btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>View All Edits <ArrowRight size={14} /></Link></div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 30 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(255,70,85,0.06)', color: '#ff4655', borderRadius: 9999, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', border: '1px solid rgba(255,70,85,0.1)', marginBottom: 14 }}>
              <Star size={12} /> Why Choose Us
            </span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 14 }}>The <span className="text-gradient-shimmer">Best</span> in the Game</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 28 }}>Elite editors delivering exceptional designs consistently.</p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {/* Left Side: Features */}
            <div style={{ flex: '1 1 340px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { Icon: Shield, title: 'Secure Transactions', desc: 'Protected payments and verified process' },
                { Icon: Zap, title: 'Fast Delivery', desc: '24-hour turnaround on most orders' },
                { Icon: CheckCircle, title: 'Verified Editors', desc: 'Rigorous quality checks for all designers' },
                { Icon: Palette, title: 'Custom Designs', desc: 'Tailored to your exact preferences' },
              ].map((f, i) => (
                <TiltCard key={i} style={{ flex: 1, display: 'flex' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', gap: 14, padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'default' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,70,85,0.08)', border: '1px solid rgba(255,70,85,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#ff4655' }}><f.Icon size={16} /></div>
                    <div>
                      <h4 style={{ fontWeight: 600, color: 'white', fontSize: '0.9rem', marginBottom: 2 }}>{f.title}</h4>
                      <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>{f.desc}</p>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>

            {/* Right Side: Stats */}
            <div style={{ flex: '1 1 340px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12, flex: 1 }}>
                {[
                  { Icon: Users, value: 5, label: 'Expert Editors', suffix: '+' },
                  { Icon: Star, value: 500, label: 'Happy Clients', suffix: '+' },
                ].map((stat, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.04 }} style={{ flex: 1, padding: 22, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div style={{ height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}><stat.Icon size={18} color="#ff4655" /></div>
                    <div style={{ height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 700, color: '#ff4655', fontFamily: 'var(--font-display)', marginBottom: 2 }}>
                      <CountUp to={stat.value} suffix={stat.suffix} />
                    </div>
                    <div style={{ height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>{stat.label}</div>
                  </motion.div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, flex: 1 }}>
                {[
                  { Icon: ImageIcon, value: 1000, label: 'Edits Created', suffix: '+' },
                  { Icon: Star, value: 4.9, label: 'Avg Rating', suffix: '' },
                ].map((stat, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.04 }} style={{ flex: 1, padding: 22, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div style={{ height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}><stat.Icon size={18} color="#ff4655" /></div>
                    <div style={{ height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 700, color: '#ff4655', fontFamily: 'var(--font-display)', marginBottom: 2 }}>
                      <CountUp to={stat.value} suffix={stat.suffix} />
                    </div>
                    <div style={{ height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Reviews */}
      {displayedReviews.length > 0 && (
        <section style={{ position: 'relative', zIndex: 1, padding: '60px 20px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(255,70,85,0.06)', color: '#ff4655', borderRadius: 9999, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', border: '1px solid rgba(255,70,85,0.1)', marginBottom: 14 }}>
                <MessageSquare size={12} /> Client Reviews
              </span>
              <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 10 }}>
                What Our <span className="text-gradient-shimmer">Clients</span> Say
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: 460, margin: '0 auto', fontSize: '0.95rem' }}>Real feedback from our satisfied customers.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: 24, marginBottom: 10 }}>
              <AnimatePresence mode="popLayout">
                {displayedReviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    layout
                  >
                    <div style={{
                      padding: 'clamp(24px, 4vw, 32px)',
                      borderRadius: 20,
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      position: 'relative',
                      overflow: 'hidden',
                      minHeight: 180,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}>
                      {/* Decorative gradient */}
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(255,70,85,0.4), transparent)' }} />
                      <Quote size={36} color="rgba(255,70,85,0.08)" style={{ position: 'absolute', top: 20, right: 20 }} />

                      {/* Stars */}
                      <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={15} fill={j < review.rating ? '#ff4655' : 'transparent'} color={j < review.rating ? '#ff4655' : 'rgba(255,255,255,0.15)'} />
                        ))}
                      </div>

                      {/* Review text */}
                      <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: 24, flex: 1 }}>
                        &ldquo;{review.text}&rdquo;
                      </p>

                      {/* Author */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: '50%',
                          background: 'linear-gradient(135deg, rgba(255,70,85,0.25), rgba(88,101,242,0.25))',
                          border: '1.5px solid rgba(255,70,85,0.3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, color: '#ff4655',
                        }}>
                          {review.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', fontFamily: 'var(--font-display)' }}>{review.name}</div>
                          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Verified Client</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>


            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link href="/reviews" className="btn btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                View All Reviews <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 20px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ position: 'relative', padding: 'clamp(36px, 6vw, 56px)', borderRadius: 20, textAlign: 'center', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(255,70,85,0.1) 0%, rgba(255,70,85,0.04) 50%, rgba(88,101,242,0.06) 100%)', border: '1px solid rgba(255,70,85,0.18)' }}>
            <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,70,85,0.5), transparent)' }} />
            <h2 style={{ fontSize: 'clamp(1.3rem, 4vw, 2.2rem)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 14, color: 'white' }}>Ready to Elevate Your Game?</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 28, maxWidth: 460, margin: '0 auto 28px', lineHeight: 1.6 }}>Join thousands of satisfied clients. Get your custom Valorant edit today.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
              <Link href="/services" className="btn btn-primary" style={{ padding: '12px 24px' }}>Get Started</Link>
              <Link href="/contact" className="btn btn-ghost" style={{ padding: '12px 24px' }}>Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setLightbox(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              style={{ position: 'relative', width: '90vw', maxWidth: 1400, height: '90vh', display: 'flex', flexDirection: 'column', background: '#0a0a0e', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, width: 36, height: 36, background: 'rgba(255,255,255,0.08)', borderRadius: '50%', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
              <div style={{ flex: 1, minHeight: 0, position: 'relative', background: 'black', overflow: 'hidden' }}>
                <img src={lightbox.imageUrl} alt={lightbox.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
              </div>
              <div style={{ padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap', gap: 10, flexShrink: 0 }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 3 }}>{lightbox.name}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>by {lightbox.editorName}</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleDownload(lightbox)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Download size={14} /> Download</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
