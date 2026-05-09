'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Crown, Shield, Award, Star, Store, MessageCircle, Phone, BadgeCheck } from 'lucide-react';
import { getAllEditors } from '@/lib/db';
import Link from 'next/link';
import RatingModal from '@/components/RatingModal';

export default function EditorsPage() {
  const [editors, setEditors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingEditor, setRatingEditor] = useState(null);
  const [adminStats, setAdminStats] = useState({ sum: 0, count: 0 });

  const handleRateSubmit = async (rating) => {
    if (!ratingEditor) return;
    try {
      const { rateEditor } = await import('@/lib/db');
      await rateEditor(ratingEditor.id, rating);
      // Update local state
      setEditors(prev => prev.map(e => {
        if (e.id === ratingEditor.id) {
          return { ...e, ratingSum: (e.ratingSum || 0) + rating, ratingCount: (e.ratingCount || 0) + 1 };
        }
        return e;
      }));
      setRatingEditor(null);
    } catch (err) {
      alert('Failed to submit rating');
    }
  };

  useEffect(() => {
    async function loadEditors() {
      try {
        const data = await getAllEditors();
        const { getAllReviews, syncEditorUsedCount } = await import('@/lib/db');
        const allReviews = await getAllReviews();
        const approvedReviews = allReviews.filter(r => r.approved);
        let sum = 0;
        approvedReviews.forEach(r => sum += (r.rating || 5));
        setAdminStats({ sum, count: approvedReviews.length });

        // Sync each editor's usedCount with the actual number of edits
        const synced = await Promise.all(data.map(async (editor) => {
          const actualCount = await syncEditorUsedCount(editor.id);
          return { ...editor, usedCount: actualCount };
        }));

        // Ensure Vaibhav is at the top
        const sorted = synced.sort((a, b) => {
          const isAVaibhav = a.isAdmin || a.email === 'vaibhavpatilpro@gmail.com' || a.name.toLowerCase() === 'vaibhav' || a.name.toLowerCase() === 'va1bhav';
          const isBVaibhav = b.isAdmin || b.email === 'vaibhavpatilpro@gmail.com' || b.name.toLowerCase() === 'vaibhav' || b.name.toLowerCase() === 'va1bhav';
          if (isAVaibhav && !isBVaibhav) return -1;
          if (isBVaibhav && !isAVaibhav) return 1;
          return b.usedCount - a.usedCount; // Sort others by edits created (usedCount)
        });

        setEditors(sorted.filter(e => !e.revoked));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadEditors();
  }, []);

  return (
    <div style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 80 }}>
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(255,70,85,0.08)', color: '#ff4655', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', border: '1px solid rgba(255,70,85,0.15)', marginBottom: 20 }}>
            <Users size={14} /> Verified Creators
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 20, lineHeight: 1.1 }}>
            Our Official <span style={{ color: '#ff4655' }}>Editors</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 600, margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Meet the talented designers who create the premium content available on our platform. All editors listed here are officially verified.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-dim)' }}>Loading editors...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {editors.map((editor, i) => {
              const isVaibhav = editor.isAdmin || editor.email === 'vaibhavpatilpro@gmail.com' || editor.name.toLowerCase() === 'vaibhav' || editor.name.toLowerCase() === 'va1bhav';

              return (
                <motion.div
                  key={editor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  style={{
                    position: 'relative',
                    padding: 32,
                    borderRadius: 20,
                    background: isVaibhav ? 'linear-gradient(135deg, rgba(255,70,85,0.1) 0%, rgba(255,70,85,0.02) 100%)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isVaibhav ? 'rgba(255,70,85,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    overflow: 'hidden',
                    height: '100%'
                  }}
                >
                  {isVaibhav && (
                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                      <span style={{ padding: '4px 10px', background: 'rgba(255,70,85,0.15)', color: '#ff4655', fontSize: '0.65rem', fontWeight: 700, borderRadius: 9999, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Shield size={10} /> Admin
                      </span>
                    </div>
                  )}

                  <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: isVaibhav ? 'rgba(255,70,85,0.15)' : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${isVaibhav ? '#ff4655' : 'rgba(255,255,255,0.1)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {editor.avatar ? (
                      <img src={editor.avatar} alt={editor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      isVaibhav ? <Crown size={32} color="#fbbf24" style={{ marginBottom: 4 }} /> : <Users size={32} color="var(--text-dim)" />
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {editor.name}
                    {isVaibhav && <Award size={16} color="#fbbf24" />}
                    {editor.verified && <BadgeCheck size={18} color="#00ffd4" />}
                  </h3>

                  <div style={{ display: 'flex', gap: 2, alignItems: 'center', marginBottom: 20 }}>
                    {[1, 2, 3, 4, 5].map(star => {
                      const currentRatingSum = isVaibhav ? adminStats.sum : (editor.ratingSum || 0);
                      const currentRatingCount = isVaibhav ? adminStats.count : (editor.ratingCount || 0);
                      const avgRating = currentRatingCount ? currentRatingSum / currentRatingCount : 0;
                      return (
                        <Star key={star} size={12} fill={star <= Math.round(avgRating) ? "#fbbf24" : "transparent"} color={star <= Math.round(avgRating) ? "#fbbf24" : "rgba(255,255,255,0.2)"} />
                      );
                    })}
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginLeft: 4 }}>
                      {(() => {
                        const currentRatingSum = isVaibhav ? adminStats.sum : (editor.ratingSum || 0);
                        const currentRatingCount = isVaibhav ? adminStats.count : (editor.ratingCount || 0);
                        return currentRatingCount ? (currentRatingSum / currentRatingCount).toFixed(1) : '0.0';
                      })()}
                    </span>
                  </div>

                  <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 2 }}>{editor.usedCount}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Active Listings</div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, width: '100%', marginTop: 'auto' }}>
                    <Link href={`/${editor.slug}`} style={{ aspectRatio: '1/1', background: 'rgba(255,255,255,0.03)', borderRadius: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)', color: 'inherit', textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                      <Store size={20} color="var(--text-dim)" />
                    </Link>
                    <a href={`https://wa.me/${editor.socialLinks?.whatsapp || '9769606096'}?text=${encodeURIComponent('I need an edit for my account')}`} target="_blank" rel="noopener noreferrer" style={{ aspectRatio: '1/1', background: 'rgba(255,255,255,0.03)', borderRadius: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)', color: 'inherit', textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                      <MessageCircle size={20} color="var(--text-dim)" />
                    </a>

                    {!isVaibhav ? (
                      <button style={{ aspectRatio: '1/1', background: 'rgba(255,255,255,0.03)', borderRadius: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)', color: 'inherit', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onClick={() => setRatingEditor(editor)}>
                        <Star size={20} color="var(--text-dim)" />
                      </button>
                    ) : (
                      <Link href="/reviews" style={{ aspectRatio: '1/1', background: 'rgba(255,255,255,0.03)', borderRadius: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)', color: 'inherit', textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                        <Star size={20} color="var(--text-dim)" />
                      </Link>
                    )}

                    <a href={`https://wa.me/${editor.socialLinks?.whatsapp || '9769606096'}?text=${encodeURIComponent('I need an edit for my account')}`} target="_blank" rel="noopener noreferrer" style={{ aspectRatio: '1/1', background: 'rgba(255,255,255,0.03)', borderRadius: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)', color: 'inherit', textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                      <Phone size={20} color="var(--text-dim)" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {ratingEditor && (
        <RatingModal
          editorName={ratingEditor.name}
          onClose={() => setRatingEditor(null)}
          onSubmit={handleRateSubmit}
        />
      )}
    </div>
  );
}
