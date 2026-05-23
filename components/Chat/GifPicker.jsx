'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';

export default function GifPicker({ onSelect, onClose }) {
  const [query, setQuery] = useState('');
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef(null);
  const TENOR_KEY = process.env.NEXT_PUBLIC_TENOR_API_KEY;

  const fetchGifs = useCallback(async (searchQuery) => {
    if (!TENOR_KEY) {
      console.warn('Tenor API key not configured');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const endpoint = searchQuery
        ? `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(searchQuery)}&key=${TENOR_KEY}&limit=20&media_filter=tinygif,gif`
        : `https://tenor.googleapis.com/v2/featured?key=${TENOR_KEY}&limit=20&media_filter=tinygif,gif`;

      const res = await fetch(endpoint);
      const data = await res.json();

      const results = (data.results || []).map(item => ({
        id: item.id,
        preview: item.media_formats?.tinygif?.url || item.media_formats?.gif?.url || '',
        full: item.media_formats?.gif?.url || item.media_formats?.tinygif?.url || '',
        title: item.title || '',
      }));

      setGifs(results);
    } catch (err) {
      console.error('Error fetching GIFs:', err);
    } finally {
      setLoading(false);
    }
  }, [TENOR_KEY]);

  // Load trending on mount
  useEffect(() => {
    fetchGifs('');
  }, [fetchGifs]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchGifs(query);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, fetchGifs]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      style={{
        background: 'rgba(14, 14, 22, 0.98)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: 'none',
        borderRadius: '16px 16px 0 0',
        overflow: 'hidden',
        maxHeight: 360,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 10,
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}>
          <Search size={14} color="rgba(255, 255, 255, 0.3)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search GIFs..."
            autoFocus
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '0.82rem',
              fontFamily: "'Inter', sans-serif",
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                background: 'none', border: 'none',
                color: 'rgba(255, 255, 255, 0.3)',
                cursor: 'pointer', padding: 2,
                display: 'flex',
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>
        <span style={{
          fontSize: '0.6rem',
          color: 'rgba(255, 255, 255, 0.2)',
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.05em',
        }}>
          TENOR
        </span>
      </div>

      {/* GIF Grid */}
      <div style={{
        overflowY: 'auto',
        flex: 1,
        padding: 8,
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255,255,255,0.1) transparent',
      }}>
        {loading ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 40,
          }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <Loader2 size={24} color="rgba(255, 70, 85, 0.5)" />
            </motion.div>
          </div>
        ) : gifs.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '32px 16px',
            color: 'rgba(255, 255, 255, 0.3)', fontSize: '0.82rem',
          }}>
            {TENOR_KEY ? 'No GIFs found. Try a different search!' : 'Tenor API key not configured'}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 6,
          }}>
            {gifs.map((gif) => (
              <motion.button
                key={gif.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(gif.full, gif.preview)}
                style={{
                  border: 'none',
                  borderRadius: 8,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  aspectRatio: '1/1',
                  padding: 0,
                  background: 'rgba(255, 255, 255, 0.03)',
                }}
              >
                <img
                  src={gif.preview}
                  alt={gif.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
