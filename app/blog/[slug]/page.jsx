import { blogPosts } from '@/lib/blogData';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { BannerAd } from '@/components/Ads/AdUnit';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return { title: 'Not Found' };
  
  return {
    title: `${post.title} | RovexEdits Blog`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  
  if (!post) {
    notFound();
  }

  // Basic markdown-like parsing for the simple content format used in blogData.js
  const renderContent = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.trim().startsWith('## ')) {
        return <h2 key={i} style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'white', marginTop: '2rem', marginBottom: '1rem' }}>{line.replace('## ', '')}</h2>;
      }
      if (line.trim().startsWith('- **')) {
        const parts = line.replace('- **', '').split('**');
        return <li key={i} style={{ marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}><strong style={{ color: 'white' }}>{parts[0]}</strong>{parts[1]}</li>;
      }
      if (line.trim().startsWith('- ')) {
         return <li key={i} style={{ marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>{line.replace('- ', '')}</li>;
      }
      if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
         return <strong key={i} style={{ display: 'block', marginBottom: '1rem', color: 'white', fontSize: '1.1rem' }}>{line.replace(/\*\*/g, '')}</strong>;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} style={{ marginBottom: '1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, fontSize: '1rem' }}>{line}</p>;
    });
  };

  return (
    <article style={{ minHeight: '100vh', paddingBottom: 80, position: 'relative' }}>
      {/* Header Image Area */}
      <div style={{ position: 'relative', width: '100%', height: '40vh', minHeight: 300, overflow: 'hidden' }}>
        <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a0a0e 0%, rgba(10,10,14,0.4) 100%)' }} />
      </div>

      <div style={{ maxWidth: 800, margin: '-100px auto 0', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginBottom: 24, fontSize: '0.85rem', transition: 'color 0.3s' }} className="hover-text-primary">
          <ArrowLeft size={14} /> Back to Blog
        </Link>
        
        <div style={{ padding: 'clamp(24px, 5vw, 40px)', background: '#0f0f13', borderRadius: 24, border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(255,70,85,0.1)', color: '#ff4655', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 16 }}>
            {post.category}
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 20, lineHeight: 1.2 }}>
            {post.title}
          </h1>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 32, color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><User size={14} /> {post.author}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={14} /> {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={14} /> {post.readTime}</div>
          </div>
          
          <div className="blog-content">
            {renderContent(post.content)}
          </div>
        </div>

        {/* Ad: Bottom of blog post */}
        <div style={{ marginTop: 40 }}>
          <BannerAd slot="SLOT_BLOG_ARTICLE_BOT" />
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hover-text-primary:hover { color: #ff4655 !important; }
      `}} />
    </article>
  );
}
