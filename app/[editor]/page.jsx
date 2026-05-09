'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getEditorBySlug, getEditsByEditor, incrementDownloads } from '@/lib/db';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, AtSign, Gamepad2, Play, Download, X, Image as ImageIcon, Users, CircleDot, Star, BadgeCheck } from 'lucide-react';
import RatingModal from '@/components/RatingModal';

export default function EditorProfilePage() {
  const params = useParams();
  const slug = params.editor;
  const [editor, setEditor] = useState(null);
  const [edits, setEdits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [adminStats, setAdminStats] = useState({ sum: 0, count: 0 });

  const handleRateSubmit = async (rating) => {
    try {
      const { rateEditor } = await import('@/lib/db');
      await rateEditor(editor.id, rating);
      setEditor(prev => ({
        ...prev,
        ratingSum: (prev.ratingSum || 0) + rating,
        ratingCount: (prev.ratingCount || 0) + 1
      }));
      setShowRatingModal(false);
    } catch (err) {
      alert('Failed to submit rating');
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const fetchedEditor = await getEditorBySlug(slug);
        if (fetchedEditor) {
          setEditor(fetchedEditor);
          const fetchedEdits = await getEditsByEditor(fetchedEditor.id);
          setEdits(fetchedEdits);
          
          const isVaibhav = fetchedEditor.isAdmin || fetchedEditor.email === 'vaibhavpatilpro@gmail.com' || fetchedEditor.name.toLowerCase() === 'vaibhav' || fetchedEditor.name.toLowerCase() === 'va1bhav';
          if (isVaibhav) {
            const { getAllReviews } = await import('@/lib/db');
            const allReviews = await getAllReviews();
            const approvedReviews = allReviews.filter(r => r.approved);
            let sum = 0;
            approvedReviews.forEach(r => sum += (r.rating || 5));
            setAdminStats({ sum, count: approvedReviews.length });
          }
        }
      } catch (err) { console.error('Failed to load editor data', err); }
      finally { setLoading(false); }
    }
    loadData();
  }, [slug]);

  const handleDownload = async (edit) => {
    try { await incrementDownloads(edit.id); window.open(edit.imageUrl, '_blank'); }
    catch (err) { console.error('Download failed', err); }
  };

  const totalDownloads = edits.reduce((sum, e) => sum + (e.downloads || 0), 0);

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #ff4655', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 14px' }} />
        <p style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Loading Profile...</p>
      </div>
    </div>
  );

  if (!editor) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: 20 }}>
        <div style={{ fontSize: '4rem', fontWeight: 800, color: 'rgba(255,255,255,0.06)', marginBottom: 14 }}>404</div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ff4655', marginBottom: 10, fontFamily: 'var(--font-display)' }}>Editor Not Found</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>No editor with slug &ldquo;{slug}&rdquo; exists.</p>
        <Link href="/" className="btn btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><ArrowLeft size={14} /> Back to Home</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      {/* Banner */}
      <div style={{
        height: 'clamp(160px, 25vw, 240px)', width: '100%', position: 'relative', overflow: 'hidden',
        background: editor.banner ? `url(${editor.banner}) center/cover` : 'linear-gradient(135deg, rgba(255,70,85,0.15) 0%, rgba(88,101,242,0.1) 40%, rgba(168,85,247,0.12) 100%)',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, var(--color-bg) 100%)' }} />
      </div>

      {/* Profile */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px', marginTop: -56, position: 'relative', zIndex: 10 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          {/* Avatar */}
          <div style={{
            width: 'clamp(90px, 15vw, 120px)', height: 'clamp(90px, 15vw, 120px)', borderRadius: 20, overflow: 'hidden',
            border: '4px solid var(--color-bg)', background: 'linear-gradient(135deg, #ff4655, #5865f2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', marginBottom: 18,
          }}>
            {editor.avatar
              ? <img src={editor.avatar} alt={editor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'white' }}>{editor.name[0]?.toUpperCase()}</span>}
          </div>

          {/* Name */}
          <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.5rem)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span style={{ color: '#ff4655' }}>{editor.name}</span>
            {editor.verified && <BadgeCheck size={28} color="#00ffd4" style={{ flexShrink: 0 }} />}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', gap: 2, alignItems: 'center', marginBottom: 12 }}>
            {[1, 2, 3, 4, 5].map(star => {
              const isVaibhav = editor.isAdmin || editor.email === 'vaibhavpatilpro@gmail.com' || editor.name.toLowerCase() === 'vaibhav' || editor.name.toLowerCase() === 'va1bhav';
              const currentRatingSum = isVaibhav ? adminStats.sum : (editor.ratingSum || 0);
              const currentRatingCount = isVaibhav ? adminStats.count : (editor.ratingCount || 0);
              const avgRating = currentRatingCount ? currentRatingSum / currentRatingCount : 0;
              return (
                <Star key={star} size={14} fill={star <= Math.round(avgRating) ? "#fbbf24" : "transparent"} color={star <= Math.round(avgRating) ? "#fbbf24" : "rgba(255,255,255,0.2)"} />
              );
            })}
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginLeft: 6, fontWeight: 600 }}>
              {(() => {
                const isVaibhav = editor.isAdmin || editor.email === 'vaibhavpatilpro@gmail.com' || editor.name.toLowerCase() === 'vaibhav' || editor.name.toLowerCase() === 'va1bhav';
                const currentRatingSum = isVaibhav ? adminStats.sum : (editor.ratingSum || 0);
                const currentRatingCount = isVaibhav ? adminStats.count : (editor.ratingCount || 0);
                return currentRatingCount ? (currentRatingSum / currentRatingCount).toFixed(1) : '0.0';
              })()}
            </span>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: 420, marginBottom: 18, fontSize: '0.9rem', lineHeight: 1.6 }}>{editor.bio || 'Professional Valorant editor'}</p>

          {(() => {
            const isVaibhav = editor.isAdmin || editor.email === 'vaibhavpatilpro@gmail.com' || editor.name.toLowerCase() === 'vaibhav' || editor.name.toLowerCase() === 'va1bhav';
            return !isVaibhav ? (
              <button className="btn btn-ghost" style={{ marginBottom: 18, fontSize: '0.8rem', padding: '6px 16px' }} onClick={() => setShowRatingModal(true)}>
                <Star size={14} /> Leave Review
              </button>
            ) : (
              <Link href="/reviews" className="btn btn-ghost" style={{ marginBottom: 18, fontSize: '0.8rem', padding: '6px 16px', display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
                <Star size={14} /> Global Reviews
              </Link>
            );
          })()}

          {/* Commission Badge */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 18px', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
            background: editor.commissionStatus === 'open' ? 'rgba(37,211,102,0.08)' : 'rgba(255,70,85,0.08)',
            color: editor.commissionStatus === 'open' ? '#25d366' : '#ff4655',
            border: `1px solid ${editor.commissionStatus === 'open' ? 'rgba(37,211,102,0.2)' : 'rgba(255,70,85,0.2)'}`,
          }}>
            <CircleDot size={12} /> Commissions {editor.commissionStatus === 'open' ? 'Open' : 'Closed'}
          </span>

          {/* Social Links */}
          <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
            {editor.socialLinks?.whatsapp && (
              <a href={`https://wa.me/${editor.socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost"
                style={{ borderColor: 'rgba(37,211,102,0.25)', color: '#25d366', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
                <MessageCircle size={14} /> WhatsApp
              </a>
            )}
            {editor.socialLinks?.instagram && (
              <a href={`https://instagram.com/${editor.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost"
                style={{ borderColor: 'rgba(168,85,247,0.25)', color: '#a855f7', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
                <AtSign size={14} /> Instagram
              </a>
            )}
            {editor.socialLinks?.discord && (
              <span className="btn btn-ghost" style={{ borderColor: 'rgba(88,101,242,0.25)', color: '#5865f2', cursor: 'default', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
                <Gamepad2 size={14} /> {editor.socialLinks.discord}
              </span>
            )}
            {editor.socialLinks?.youtube && (
              <a href={`https://youtube.com/@${editor.socialLinks.youtube}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost"
                style={{ borderColor: 'rgba(255,0,0,0.25)', color: '#ff4444', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
                <Play size={14} /> YouTube
              </a>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { Icon: ImageIcon, value: edits.length, label: 'EDITS UPLOADED' },
              { Icon: Download, value: totalDownloads, label: 'DOWNLOADS' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <s.Icon size={13} style={{ color: '#ff4655' }} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ff4655' }}>{s.value}</span>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Gallery */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px 0' }}>
        <h2 style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 24 }}>{editor.name}&apos;s Edits</h2>
        {edits.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}><p style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>No edits uploaded yet.</p></div>
        ) : (
          <div className="gallery-grid">
            {edits.map((edit, i) => (
              <motion.div key={edit.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.3) }} className="edit-card" onClick={() => setSelectedEdit(edit)}>
                <div className="card-img-wrap" style={{ aspectRatio: '16/10' }}>
                  {edit.thumbUrl || edit.imageUrl
                    ? <img className="card-img" src={edit.thumbUrl || edit.imageUrl} alt={edit.name} loading="lazy" />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.15)' }}><ImageIcon size={32} /></div>
                  }
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
              </motion.div>
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <Link href="/" className="btn btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><ArrowLeft size={14} /> Back to Home</Link>
        </div>
      </div>

      {/* Lightbox — rendered via portal to escape template.jsx transform wrapper */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedEdit && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
              onClick={() => setSelectedEdit(null)}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                style={{ position: 'relative', width: '90vw', maxWidth: 1400, height: '90vh', display: 'flex', flexDirection: 'column', background: '#0a0a0e', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}
                onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setSelectedEdit(null)} style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, width: 36, height: 36, background: 'rgba(255,255,255,0.08)', borderRadius: '50%', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
                <div style={{ flex: 1, minHeight: 0, position: 'relative', background: 'black', overflow: 'hidden' }}>
                  <img src={selectedEdit.imageUrl} alt={selectedEdit.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                </div>
                <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap', gap: 10, flexShrink: 0 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>{selectedEdit.name}</h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a href={selectedEdit.imageUrl} download target="_blank" rel="noopener noreferrer" className="btn btn-primary"
                      style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Download size={14} /> Download</a>
                    <button className="btn btn-ghost" onClick={() => setSelectedEdit(null)}>Close</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
      {showRatingModal && (
        <RatingModal
          editorName={editor.name}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleRateSubmit}
        />
      )}
    </div>
  );
}
