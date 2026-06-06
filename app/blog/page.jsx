'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/lib/blogData';
import { BannerAd } from '@/components/Ads/AdUnit';

export default function BlogPage() {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80, position: 'relative' }}>
      {/* Ambient */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,70,85,0.06) 0%, transparent 65%)', filter: 'blur(80px)', top: '10%', left: '15%' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(88,101,242,0.05) 0%, transparent 70%)', filter: 'blur(60px)', bottom: '20%', right: '10%' }} />
      </div>

      {/* Header */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 20px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(255,70,85,0.06)', color: '#ff4655', borderRadius: 9999, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', border: '1px solid rgba(255,70,85,0.1)', marginBottom: 14 }}>
              <BookOpen size={12} /> Our Blog
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 12 }}>
            Latest <span className="text-gradient-shimmer">Articles</span> & News
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.4)', maxWidth: 520, margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Insights, guides, and news about Valorant design, editing, and the gaming community.
          </motion.p>
        </div>
      </section>

      {/* Ad placement */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px 40px', position: 'relative', zIndex: 1 }}>
        <BannerAd slot="SLOT_BLOG_TOP" />
      </div>

      {/* Blog Grid */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 20px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {blogPosts.map((post, i) => (
            <motion.div key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={\`/blog/\${post.slug}\`} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 20,
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,70,85,0.3)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ width: '100%', height: 200, position: 'relative', overflow: 'hidden' }}>
                    <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="blog-img" />
                    <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '4px 12px', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.7rem', fontWeight: 600, color: 'white', textTransform: 'uppercase' }}>
                      {post.category}
                    </div>
                  </div>
                  <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: 12 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {post.readTime}</span>
                    </div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'white', marginBottom: 12, lineHeight: 1.4 }}>
                      {post.title}
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 20, flex: 1 }}>
                      {post.excerpt}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', color: '#ff4655', fontSize: '0.85rem', fontWeight: 600, gap: 6 }}>
                      Read Article <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      
      <style dangerouslySetInnerHTML={{__html: \`
        .blog-img:hover {
          transform: scale(1.05);
        }
      \`}} />
    </div>
  );
}
