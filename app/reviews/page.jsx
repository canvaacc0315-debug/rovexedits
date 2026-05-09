'use client';
import { useState, useEffect } from 'react';
import { getApprovedReviews, addReview } from '@/lib/db';
import { motion } from 'framer-motion';
import { Star, Send, MessageSquare, User, Quote } from 'lucide-react';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', rating: 5, text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function load() {
      try { setReviews(await getApprovedReviews()); }
      catch (err) { console.error('Failed to load reviews', err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;
    setSubmitting(true);
    try {
      await addReview({ name: form.name, rating: form.rating, text: form.text });
      setSubmitted(true);
      setForm({ name: '', rating: 5, text: '' });
    } catch (err) { console.error('Failed to submit review', err); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      {/* Hero */}
      <section style={{ padding: '60px 20px 36px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(255,70,85,0.06)', color: '#ff4655', borderRadius: 9999, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', border: '1px solid rgba(255,70,85,0.1)', marginBottom: 14 }}>
            <MessageSquare size={12} /> Testimonials
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 10 }}>Client <span style={{ color: '#ff4655' }}>Reviews</span></h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: 460, margin: '0 auto' }}>See what our satisfied clients have to say about our work.</p>
        </div>
      </section>

      {/* Submit Review — always at the top, full-width card */}
      <section style={{ padding: '0 20px 32px', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ padding: 28, borderRadius: 18, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 6 }}>Leave a Review</h3>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', marginBottom: 20 }}>Your review will be visible after admin approval.</p>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <Star size={32} style={{ color: '#fbbf24', margin: '0 auto 10px', display: 'block' }} />
              <h4 style={{ fontWeight: 600, marginBottom: 6 }}>Thank you!</h4>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>Your review has been submitted and is pending approval.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input className="input" placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginRight: 4 }}>Rating:</span>
                {[1, 2, 3, 4, 5].map(n => (
                  <button type="button" key={n} onClick={() => setForm({ ...form, rating: n })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                    <Star size={20} fill={n <= form.rating ? '#fbbf24' : 'transparent'} style={{ color: n <= form.rating ? '#fbbf24' : 'rgba(255,255,255,0.15)', transition: 'color 0.2s' }} />
                  </button>
                ))}
              </div>
              <textarea className="input" placeholder="Write your review..." rows={3} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} required style={{ resize: 'vertical' }} />
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: submitting ? 0.6 : 1 }}>
                <Send size={14} /> {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 200, margin: '0 auto 32px', height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,70,85,0.3), transparent)' }} />

      {/* Reviews Grid — full width on PC, 4 per row */}
      <section style={{ padding: '0 20px', maxWidth: '100%', margin: '0 auto' }}>
        <style>{`
          .reviews-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
          }
          @media (max-width: 1024px) {
            .reviews-grid { grid-template-columns: repeat(3, 1fr); }
          }
          @media (max-width: 768px) {
            .reviews-grid { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 480px) {
            .reviews-grid { grid-template-columns: 1fr; }
          }
        `}</style>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div style={{ width: 36, height: 36, border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #ff4655', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <MessageSquare size={36} style={{ color: 'rgba(255,255,255,0.1)', margin: '0 auto 12px', display: 'block' }} />
            <p style={{ color: 'rgba(255,255,255,0.3)' }}>No reviews yet. Be the first to leave one!</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review, i) => (
              <motion.div key={review.id || i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.06, 0.3) }}
                style={{ padding: 22, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
                <Quote size={20} style={{ position: 'absolute', top: 14, right: 14, color: 'rgba(255,70,85,0.1)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, rgba(255,70,85,0.15), rgba(88,101,242,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4655', fontWeight: 700, fontSize: '0.85rem' }}>
                    {review.name?.[0]?.toUpperCase() || <User size={16} />}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '0.88rem' }}>{review.name}</h4>
                    <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <Star key={n} size={12} fill={n <= review.rating ? '#fbbf24' : 'transparent'} style={{ color: n <= review.rating ? '#fbbf24' : 'rgba(255,255,255,0.1)' }} />
                      ))}
                    </div>
                  </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', lineHeight: 1.6 }}>{review.text}</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
