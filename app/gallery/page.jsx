'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getAllEdits, incrementDownloads } from '@/lib/db';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, X, ArrowDownAZ, ArrowUpZA, Shuffle, SlidersHorizontal, LayoutGrid, Paintbrush, Layers } from 'lucide-react';

const sortOptions = ['Random', 'Newest', 'A-Z', 'Z-A'];
const styleOptions = ['All', 'Regular', 'PHP'];
const tierOptions = ['All', 'Low', 'Mid', 'High'];

export default function GalleryPage() {
  const [edits, setEdits] = useState([]);
  const [filteredEdits, setFilteredEdits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState('Random');
  const [styleFilter, setStyleFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try { const fetched = await getAllEdits(); setEdits(fetched); setFilteredEdits(fetched); }
      catch (err) { console.error('Failed to load edits', err); }
      finally { setLoading(false); }
    }
    loadData();
  }, []);

  useEffect(() => {
    let result = [...edits];
    if (searchQuery) result = result.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.editorName.toLowerCase().includes(searchQuery.toLowerCase()));
    if (styleFilter !== 'All') result = result.filter(e => e.style?.toLowerCase() === styleFilter.toLowerCase());
    if (tierFilter !== 'All') result = result.filter(e => e.tier?.toLowerCase().includes(tierFilter.toLowerCase()));
    switch (sortMode) {
      case 'Newest': result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); break;
      case 'A-Z': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'Z-A': result.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'Random': result.sort(() => Math.random() - 0.5); break;
      default: break;
    }
    setFilteredEdits(result);
  }, [sortMode, styleFilter, tierFilter, searchQuery, edits]);

  const handleDownload = async (edit) => {
    try { await incrementDownloads(edit.id); window.open(edit.imageUrl, '_blank'); }
    catch (err) { console.error('Download failed', err); }
  };

  const FilterBtn = ({ label, active, onClick, accent }) => (
    <motion.button onClick={onClick} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
      style={{
        padding: '6px 14px', borderRadius: 9999, fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.3s', border: 'none',
        display: 'flex', alignItems: 'center', gap: 4,
        ...(active
          ? { background: accent || '#ff4655', color: 'white', boxShadow: `0 4px 14px ${accent ? accent + '55' : 'rgba(255,70,85,0.35)'}` }
          : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.06)' }),
      }}>
      {label}
    </motion.button>
  );

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <section style={{ position: 'relative', padding: '60px 20px 36px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(255,70,85,0.06)', color: '#ff4655', borderRadius: 9999, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', border: '1px solid rgba(255,70,85,0.1)', marginBottom: 14 }}>
            <SlidersHorizontal size={12} /> Collection
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 10 }}>Edit <span style={{ color: '#ff4655' }}>Gallery</span></h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: 460, margin: '0 auto 28px', fontSize: '0.95rem' }}>Browse our complete collection of premium Valorant inventory designs.</p>

          <div style={{ maxWidth: 380, margin: '0 auto 20px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
              <input type="text" placeholder="Search edits..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="input" style={{ paddingLeft: 40, width: '100%' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, maxWidth: 600, margin: '0 auto' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }}><SlidersHorizontal size={14} /></div>
              <select className="input" value={sortMode} onChange={e => setSortMode(e.target.value)} style={{ width: '100%', paddingLeft: 38, appearance: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
                <optgroup label="Sort By">
                  {sortOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </optgroup>
              </select>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }}><Paintbrush size={14} /></div>
              <select className="input" value={styleFilter} onChange={e => setStyleFilter(e.target.value)} style={{ width: '100%', paddingLeft: 38, appearance: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
                <optgroup label="Style">
                  {styleOptions.map(opt => <option key={opt} value={opt}>{opt === 'All' ? 'All Styles' : opt}</option>)}
                </optgroup>
              </select>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }}><Layers size={14} /></div>
              <select className="input" value={tierFilter} onChange={e => setTierFilter(e.target.value)} style={{ width: '100%', paddingLeft: 38, appearance: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
                <optgroup label="Tier">
                  {tierOptions.map(opt => <option key={opt} value={opt}>{opt === 'All' ? 'All Tiers' : opt}</option>)}
                </optgroup>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 20px', maxWidth: 1200, margin: '0 auto' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <div style={{ width: 36, height: 36, border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #ff4655', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : filteredEdits.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.95rem' }}>No edits found matching your criteria.</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {filteredEdits.map((edit, i) => (
              <motion.div key={edit.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
                className="edit-card" onClick={() => setLightbox(edit)}>
                <div className="card-img-wrap" style={{ aspectRatio: '16/10' }}>
                  <img className="card-img" src={edit.thumbUrl || edit.imageUrl} alt={edit.name} loading="lazy" />
                  <div className="card-badges">
                    <span className={`badge badge-${edit.tier === 'high-prem' ? 'high' : edit.tier === 'mid-prem' ? 'mid' : 'low'}`} style={{ borderRadius: 8, padding: '3px 9px' }}>
                      {edit.tier.replace('-', ' ')}
                    </span>
                  </div>
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
      </section>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {lightbox && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
              onClick={() => setLightbox(null)}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                style={{ position: 'relative', width: '90vw', maxWidth: 1400, height: '90vh', display: 'flex', flexDirection: 'column', background: '#0a0a0e', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}
                onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, width: 36, height: 36, background: 'rgba(255,255,255,0.08)', borderRadius: '50%', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
                <div style={{ flex: 1, minHeight: 0, position: 'relative', background: 'black', overflow: 'hidden' }}>
                  <img src={lightbox.imageUrl} alt={lightbox.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                </div>
                <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap', gap: 10, flexShrink: 0 }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 2 }}>{lightbox.name}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>by {lightbox.editorName} &middot; {lightbox.downloads} downloads</p>
                  </div>
                  <button className="btn btn-primary" onClick={() => handleDownload(lightbox)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Download size={14} /> Download</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
