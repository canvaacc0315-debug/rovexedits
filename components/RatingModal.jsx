import { useState } from 'react';
import { Star } from 'lucide-react';

export default function RatingModal({ editorName, onClose, onSubmit }) {
  const [hoverRating, setHoverRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return;
    setSubmitting(true);
    await onSubmit(rating);
    setSubmitting(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ background: '#111', padding: '30px 40px', borderRadius: 20, textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', maxWidth: 400, width: '100%' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: 10, fontFamily: 'var(--font-display)', color: 'white', fontSize: '1.4rem' }}>Rate {editorName}</h3>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: 24 }}>Select a star rating to submit your review.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 30 }}>
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              size={42}
              fill={star <= (hoverRating || rating) ? "#fbbf24" : "transparent"}
              color={star <= (hoverRating || rating) ? "#fbbf24" : "rgba(255,255,255,0.15)"}
              style={{ cursor: 'pointer', transition: 'all 0.2s', transform: star <= (hoverRating || rating) ? 'scale(1.1)' : 'scale(1)' }}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-ghost" onClick={onClose} disabled={submitting}>Cancel</button>
          <button className="btn btn-primary" disabled={!rating || submitting} onClick={handleSubmit}>{submitting ? 'Submitting...' : 'Submit Rating'}</button>
        </div>
      </div>
    </div>
  );
}
