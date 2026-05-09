'use client';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { getAllEdits, getAllEditors, getCDNAccounts, addEdit, addEditor, getAllReviews, approveReview, deleteReview, deleteAllEdits, deleteAllReviews, getSiteSettings, updateSiteSettings, getAllStoreLinks, addStoreLink, updateStoreLink, deleteStoreLink } from '@/lib/db';
import { Image as ImageIcon, Users, Star, Database, Settings, Trash2, Upload, Plus, CheckCircle, XCircle, ArrowLeft, Lock, Zap, Pencil, LogOut, Store, MessageCircle } from 'lucide-react';

const TABS = [
  { key: 'edits', label: 'Edits', icon: <ImageIcon size={14} /> },
  { key: 'editors', label: 'Editors', icon: <Users size={14} /> },
  { key: 'reviews', label: 'Reviews', icon: <Star size={14} /> },
  { key: 'store', label: 'Store', icon: <Store size={14} /> },
  { key: 'cdn', label: 'CDN', icon: <Database size={14} /> },
  { key: 'settings', label: 'Settings', icon: <Settings size={14} /> },
];

function CDNBar({ label, used, total, color }) {
  const pct = Math.min((used / total) * 100, 100);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>{used.toFixed(1)} / {total}GB</span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, borderRadius: 4, background: color, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { isLoaded, user } = useUser();
  const [tab, setTab] = useState('edits');
  const [isAuthed, setIsAuthed] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [edits, setEdits] = useState([]);
  const [editors, setEditors] = useState([]);
  const [cdnAccounts, setCdnAccounts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [siteSettings, setSiteSettings] = useState({ maintenanceMode: false, heroText: '' });
  const [savingSettings, setSavingSettings] = useState(false);
  const [storeLinks, setStoreLinks] = useState([]);
  const [showAddLink, setShowAddLink] = useState(false);
  const [newLink, setNewLink] = useState({ name: '', url: '', description: '', image: '', color: '#ff4655', type: 'store', verified: true, order: 0 });
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [editLinkData, setEditLinkData] = useState({});
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingEditLogo, setUploadingEditLogo] = useState(false);
  const logoInputRef = useRef(null);
  const editLogoInputRef = useRef(null);

  const handleLogoUpload = async (file, mode) => {
    if (!file) return;
    const setUploading = mode === 'add' ? setUploadingLogo : setUploadingEditLogo;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Upload failed');
      const imageUrl = data.thumbUrl || data.imageUrl;
      if (mode === 'add') {
        setNewLink(prev => ({ ...prev, image: imageUrl }));
      } else {
        setEditLinkData(prev => ({ ...prev, image: imageUrl }));
      }
    } catch (err) {
      alert('Logo upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadName, setUploadName] = useState('');
  const [uploadTier, setUploadTier] = useState('mid-prem');
  const [uploadStyle, setUploadStyle] = useState('regular');
  const [uploadEditorId, setUploadEditorId] = useState('');
  const [uploadPinned, setUploadPinned] = useState(false);
  const fileInputRef = useRef(null);
  const [showAddEditor, setShowAddEditor] = useState(false);
  const [newEditorName, setNewEditorName] = useState('');
  const [newEditorSlug, setNewEditorSlug] = useState('');
  const [newEditorCode, setNewEditorCode] = useState('');
  const [newEditorSlots, setNewEditorSlots] = useState(50);
  const [newEditorDays, setNewEditorDays] = useState(30);
  const [editingEditorId, setEditingEditorId] = useState(null);
  const [editEditorData, setEditEditorData] = useState({ name: '', maxUploads: 50 });
  const [renewDays, setRenewDays] = useState({});

  // Check existing session on mount (cookie + localStorage fallback)
  useEffect(() => {
    if (isLoaded && user) {
      const email = user.emailAddresses?.[0]?.emailAddress;
      if (email === 'vaibhavpatilpro@gmail.com') {
        setIsAuthed(true);
        setCheckingSession(false);
        return;
      }
    }
    
    async function checkSession() {
      try {
        // First try server cookie
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated && data.role === 'admin') {
          setIsAuthed(true);
          return;
        }
      } catch {
        // Cookie check failed
      }
      // Fallback: check localStorage "Remember Me" token
      try {
        const saved = localStorage.getItem('rovex_admin_session');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.role === 'admin' && parsed.expiresAt > Date.now()) {
            setIsAuthed(true);
            return;
          } else {
            localStorage.removeItem('rovex_admin_session');
          }
        }
      } catch {
        // localStorage not available or corrupt
      }
      setCheckingSession(false);
    }
    checkSession().finally(() => setCheckingSession(false));
  }, [isLoaded, user]);

  useEffect(() => {
    if (!isAuthed) return;
    async function loadData() {
      try {
        setEdits(await getAllEdits());
        setEditors(await getAllEditors());
        setCdnAccounts(await getCDNAccounts());
        setReviews(await getAllReviews());
        setSiteSettings(await getSiteSettings());
        setStoreLinks(await getAllStoreLinks());
      } catch (err) { console.error("Admin load error:", err); }
      finally { setLoading(false); }
    }
    loadData();
  }, [isAuthed]);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await updateSiteSettings(siteSettings);
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadName || !uploadEditorId) return alert('Fill all required fields');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const cdnData = await res.json();
      if (!cdnData.success) throw new Error(cdnData.error || 'CDN upload failed');
      await addEdit({
        name: uploadName, imageUrl: cdnData.imageUrl, thumbUrl: cdnData.thumbUrl, provider: cdnData.provider,
        tier: uploadTier, style: uploadStyle, editorId: 'admin',
        editorName: uploadEditorId || 'Rovex',
        editorSlug: (uploadEditorId || 'Rovex').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        isPinned: uploadPinned, downloads: 0, views: 0
      });
      setShowUpload(false); setUploadFile(null); setUploadName('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setEdits(await getAllEdits());
      alert('Upload successful!');
    } catch (err) { alert(`Upload failed: ${err.message}`); }
    finally { setUploading(false); }
  };

  const handleAddEditor = async (e) => {
    e.preventDefault();
    if (!newEditorName || !newEditorSlug || !newEditorCode) return alert('Fill all fields');
    try {
      const expiresAt = Date.now() + newEditorDays * 24 * 60 * 60 * 1000;
      await addEditor({ name: newEditorName, slug: newEditorSlug.toLowerCase(), code: newEditorCode, maxUploads: newEditorSlots, bio: 'Valorant editor.', avatar: '', banner: '', socialLinks: {}, commissionStatus: 'closed', revoked: false, sessionDurationHours: 12, expiresAt });
      setShowAddEditor(false); setNewEditorName(''); setNewEditorSlug(''); setNewEditorCode(''); setNewEditorSlots(50); setNewEditorDays(30);
      setEditors(await getAllEditors());
    } catch (err) { alert('Failed: ' + err.message); }
  };

  const handleRenewEditor = async (editorId, currentExpiresAt, days) => {
    try {
      const { updateEditorProfile, getAllEditors } = await import('@/lib/db');
      const baseTime = (currentExpiresAt && currentExpiresAt > Date.now()) ? currentExpiresAt : Date.now();
      const newExpiresAt = baseTime + days * 24 * 60 * 60 * 1000;
      await updateEditorProfile(editorId, { expiresAt: newExpiresAt });
      setEditors(await getAllEditors());
      alert(`Renewed for ${days} days!`);
    } catch (err) { alert('Failed: ' + err.message); }
  };

  const handleToggleRevoke = async (editor) => {
    if (!confirm(`${editor.revoked ? 'Unrevoke' : 'Revoke'} ${editor.name}?`)) return;
    try { const { toggleRevokeEditor } = await import('@/lib/db'); await toggleRevokeEditor(editor.id, editor.revoked); setEditors(await getAllEditors()); }
    catch (err) { alert('Failed: ' + err.message); }
  };

  const handleDeleteEditor = async (editorId, editorName) => {
    if (!confirm(`DELETE ${editorName}? Cannot be undone.`)) return;
    try { const { deleteEditor, getAllEditors } = await import('@/lib/db'); await deleteEditor(editorId); setEditors(await getAllEditors()); }
    catch (err) { alert('Failed: ' + err.message); }
  };

  const handleSaveEditor = async (editorId) => {
    try {
      const { updateEditorProfile, getAllEditors } = await import('@/lib/db');
      await updateEditorProfile(editorId, { name: editEditorData.name, maxUploads: editEditorData.maxUploads });
      setEditors(await getAllEditors());
      setEditingEditorId(null);
    } catch (err) { alert('Failed: ' + err.message); }
  };

  const handleDeleteEdit = async (editId, editName) => {
    if (!confirm(`DELETE "${editName}"? Cannot be undone.`)) return;
    try { await deleteEdit(editId); setEdits(await getAllEdits()); }
    catch (err) { alert('Failed: ' + err.message); }
  };

  const handleDeleteAllEdits = async () => {
    if (!confirm('Are you ABSOLUTELY sure you want to delete ALL edits? This cannot be undone.')) return;
    try { const count = await deleteAllEdits(); setEdits([]); alert(`Deleted ${count} edits.`); }
    catch (err) { alert('Failed: ' + err.message); }
  };

  const handleDeleteAllReviews = async () => {
    if (!confirm('Are you ABSOLUTELY sure you want to delete ALL reviews? This cannot be undone.')) return;
    try { const count = await deleteAllReviews(); setReviews([]); alert(`Deleted ${count} reviews.`); }
    catch (err) { alert('Failed: ' + err.message); }
  };

  const handleLogin = async () => {
    setError('');
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password, rememberMe }) });
      const data = await res.json();
      if (data.success) {
        setIsAuthed(true);
        // Save to localStorage if "Remember Me" is checked
        if (rememberMe) {
          const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days
          localStorage.setItem('rovex_admin_session', JSON.stringify({ role: 'admin', expiresAt }));
        }
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch { setError('Connection error'); }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch { /* ignore */ }
    localStorage.removeItem('rovex_admin_session');
    setIsAuthed(false);
    setPassword('');
  };

  if (checkingSession || !isLoaded) {
    return (
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>Verifying session...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="glass" style={{ padding: 40, maxWidth: 420, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,70,85,0.1)', border: '1.5px solid rgba(255,70,85,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#ff4655' }}><Lock size={24} /></div>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)', fontSize: '1rem', letterSpacing: '0.1em', marginBottom: 6 }}>ADMIN ACCESS</h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: 24 }}>Enter admin password to continue</p>
          <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} style={{ marginBottom: 16 }} />
          {error && <p style={{ color: 'var(--color-primary)', fontSize: '0.8rem', marginBottom: 12 }}>{error}</p>}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, cursor: 'pointer', justifyContent: 'center' }}>
            <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} style={{ accentColor: '#ff4655', width: 16, height: 16, cursor: 'pointer' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>Remember me for 30 days</span>
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href="/" className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Cancel</a>
            <button className="btn btn-primary" onClick={handleLogin} style={{ flex: 1, justifyContent: 'center' }}>Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '24px 24px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 10 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 8 }}><Zap size={18} color="var(--color-primary)" /> Admin Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="/" className="btn btn-ghost" style={{ fontSize: '0.6rem', display: 'flex', alignItems: 'center', gap: 6 }}><ArrowLeft size={12} /> Gallery</a>
          <button className="btn btn-ghost" onClick={handleLogout} style={{ fontSize: '0.6rem', display: 'flex', alignItems: 'center', gap: 6, color: '#ff4655', borderColor: 'rgba(255,70,85,0.3)' }}><LogOut size={12} /> Logout</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', padding: 4, border: '1px solid rgba(255,255,255,0.04)', overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ flex: 1, padding: '10px 8px', borderRadius: 'var(--radius-sm)', border: tab === t.key ? '1px solid rgba(255,70,85,0.3)' : '1px solid transparent', background: tab === t.key ? 'rgba(255,70,85,0.12)' : 'transparent', color: tab === t.key ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'edits' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <button className="btn btn-primary" onClick={() => { setShowUpload(true); if (editors.length > 0) setUploadEditorId(editors[0].id); }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={14} /> Upload Edit</button>
            {edits.length > 0 && <button className="btn btn-ghost" onClick={handleDeleteAllEdits} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ff4655', borderColor: 'rgba(255,70,85,0.3)', fontSize: '0.75rem', padding: '6px 12px' }}><Trash2 size={12} /> Delete All</button>}
          </div>
          {showUpload && (
            <div className="glass" style={{ padding: 24, marginBottom: 24, border: '1px solid var(--color-primary)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Upload New Edit</h3>
              <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Image File</label><input type="file" accept="image/*" className="input" ref={fileInputRef} onChange={e => setUploadFile(e.target.files?.[0] || null)} required /></div>
                <div><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Edit Name</label><input type="text" className="input" placeholder="e.g., Reaver Vandal Red" value={uploadName} onChange={e => setUploadName(e.target.value)} required /></div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Editor</label><input type="text" className="input" placeholder="e.g., Rovex" value={uploadEditorId} onChange={e => setUploadEditorId(e.target.value)} required /></div>
                  <div style={{ flex: 1 }}><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Tier</label><select className="input" value={uploadTier} onChange={e => setUploadTier(e.target.value)}><option value="high-prem">High Prem</option><option value="mid-prem">Mid Prem</option><option value="low-prem">Low Prem</option></select></div>
                  <div style={{ flex: 1 }}><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Style</label><select className="input" value={uploadStyle} onChange={e => setUploadStyle(e.target.value)}><option value="regular">Regular</option><option value="php">PHP (Glow)</option></select></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" id="pinned" checked={uploadPinned} onChange={e => setUploadPinned(e.target.checked)} /><label htmlFor="pinned" style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Pin to top</label></div>
                <div style={{ display: 'flex', gap: 10 }}><button type="button" className="btn btn-ghost" onClick={() => setShowUpload(false)}>Cancel</button><button type="submit" className="btn btn-primary" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload & Save'}</button></div>
              </form>
            </div>
          )}
          <div className="glass" style={{ padding: 24 }}>
            {loading ? <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>Loading...</p> : edits.length === 0 ? <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>No edits found.</p> : (
              <div style={{ overflowX: 'auto', background: 'rgba(0,0,0,0.2)', borderRadius: 12 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  <thead><tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{['Name', 'Editor', 'Tier', 'DLs', 'Status', 'Actions'].map(h => <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.65rem' }}>{h}</th>)}</tr></thead>
                  <tbody>{edits.map(e => <tr key={e.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }} onMouseEnter={el => el.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={el => el.currentTarget.style.background = 'transparent'}><td style={{ padding: '14px 16px', fontWeight: 500 }}>{e.name}</td><td style={{ padding: '14px 16px', color: 'var(--color-accent)' }}>{e.editorName}</td><td style={{ padding: '14px 16px' }}><span style={{ padding: '3px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 6, fontSize: '0.7rem' }}>{e.tier.replace('-', ' ')}</span></td><td style={{ padding: '14px 16px' }}>{e.downloads}</td><td style={{ padding: '14px 16px' }}>{e.isPinned ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#fbbf24', fontSize: '0.7rem' }}><Star size={12} fill="#fbbf24" /> Pinned</span> : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#00ffd4', fontSize: '0.7rem' }}><CheckCircle size={12} /> Active</span>}</td><td style={{ padding: '14px 16px' }}><button className="btn btn-ghost" style={{ fontSize: '0.65rem', padding: '6px 12px', color: 'var(--color-primary)', borderColor: 'rgba(255,70,85,0.3)', display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={() => handleDeleteEdit(e.id, e.name)}><Trash2 size={12} /> Delete</button></td></tr>)}</tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'editors' && (
        <div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}><button className="btn btn-primary" onClick={() => setShowAddEditor(true)}>+ Create Editor</button></div>
          {showAddEditor && (
            <div className="glass" style={{ padding: 24, marginBottom: 24, border: '1px solid var(--color-purple)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Create Editor</h3>
              <form onSubmit={handleAddEditor} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Name</label><input type="text" className="input" placeholder="e.g., Vaibhav" value={newEditorName} onChange={e => { const name = e.target.value; setNewEditorName(name); setNewEditorSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-')); if (!newEditorCode && name.length > 0) { setNewEditorCode(`ROVEX-${name.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`); } else if (name.length === 0) { setNewEditorCode(''); } }} required /></div>
                  <div style={{ flex: 1 }}><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>URL Slug</label><input type="text" className="input" value={newEditorSlug} onChange={e => setNewEditorSlug(e.target.value)} required /></div>
                  <div style={{ flex: 1 }}><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Access Code</label><input type="text" className="input" value={newEditorCode} onChange={e => setNewEditorCode(e.target.value)} required /></div>
                  <div style={{ flex: 1 }}><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Slots</label><input type="number" className="input" min="1" max="1000" value={newEditorSlots} onChange={e => setNewEditorSlots(parseInt(e.target.value) || 0)} required /></div>
                  <div style={{ flex: 1 }}><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Expire Days</label><input type="number" className="input" min="1" value={newEditorDays} onChange={e => setNewEditorDays(parseInt(e.target.value) || 30)} required /></div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}><button type="button" className="btn btn-ghost" onClick={() => setShowAddEditor(false)}>Cancel</button><button type="submit" className="btn btn-purple">Save Editor</button></div>
              </form>
            </div>
          )}
          <div className="glass" style={{ padding: 24 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                <thead><tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{['Editor', 'Code', 'Slots', 'Used', 'Expires', 'Status', 'Actions'].map(h => <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.65rem' }}>{h}</th>)}</tr></thead>
                <tbody>{editors.length === 0 ? <tr><td colSpan={7} style={{ padding: 20, textAlign: 'center', color: 'var(--text-dim)' }}>No editors found.</td></tr> : editors.map(e => (
                  <tr key={e.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 500 }}>
                      {editingEditorId === e.id ? <input className="input" style={{ padding: '4px 8px', fontSize: '0.75rem', height: 'auto' }} value={editEditorData.name} onChange={(ev) => setEditEditorData({...editEditorData, name: ev.target.value})} /> : e.name}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-accent)' }}>{e.code}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {editingEditorId === e.id ? <input type="number" className="input" style={{ padding: '4px 8px', fontSize: '0.75rem', height: 'auto', width: 60 }} value={editEditorData.maxUploads} onChange={(ev) => setEditEditorData({...editEditorData, maxUploads: parseInt(ev.target.value) || 0})} /> : e.maxUploads}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {e.expiresAt ? (
                        <span style={{ color: e.expiresAt < Date.now() ? '#ff4655' : 'var(--text-dim)' }}>
                          {new Date(e.expiresAt).toLocaleDateString()}
                          {e.expiresAt < Date.now() && ' (Expired)'}
                        </span>
                      ) : <span style={{ color: 'var(--text-dim)' }}>Never</span>}
                    </td>
                    <td style={{ padding: '14px 16px' }}>{e.revoked ? <span style={{ color: '#ff4655', fontSize: '0.7rem' }}><XCircle size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />Revoked</span> : e.usedCount >= e.maxUploads ? <span style={{ color: '#fbbf24', fontSize: '0.7rem' }}>⚠️ Full</span> : <span style={{ color: '#00ffd4', fontSize: '0.7rem' }}><CheckCircle size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />Active</span>}</td>
                    <td style={{ padding: '14px 16px', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                      {editingEditorId === e.id ? (
                        <>
                          <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.65rem' }} onClick={() => handleSaveEditor(e.id)}>Save</button>
                          <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '0.65rem' }} onClick={() => setEditingEditorId(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '0.65rem', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => { setEditingEditorId(e.id); setEditEditorData({ name: e.name, maxUploads: e.maxUploads }); }}><Pencil size={12} /> Edit</button>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <input type="number" className="input" style={{ width: 50, padding: '4px', fontSize: '0.65rem', height: '24px', minHeight: '24px' }} value={renewDays[e.id] || 30} onChange={ev => setRenewDays({...renewDays, [e.id]: parseInt(ev.target.value) || 30})} />
                            <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '0.65rem', color: '#00ffd4', borderColor: 'rgba(0,255,212,0.3)' }} onClick={() => handleRenewEditor(e.id, e.expiresAt, renewDays[e.id] || 30)}>Renew</button>
                          </div>
                          <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '0.65rem' }} onClick={() => handleToggleRevoke(e)}>{e.revoked ? 'Unrevoke' : 'Revoke'}</button>
                          <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '0.65rem', color: 'var(--color-primary)', borderColor: 'rgba(255,70,85,0.3)' }} onClick={() => handleDeleteEditor(e.id, e.name)}><Trash2 size={12} /></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'cdn' && (
        <div className="glass" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', marginBottom: 20 }}>📊 Image CDN Status</h3>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-accent)', marginBottom: 16 }}>☁️ Cloudinary Pool</p>
          {cdnAccounts.filter(a => a.provider === 'cloudinary').length > 0 
            ? cdnAccounts.filter(a => a.provider === 'cloudinary').map((a, i) => <CDNBar key={a.id} label={`Cloudinary #${i + 1} (${a.accountId})`} used={a.storageUsedMB / 1024} total={a.storageLimitMB / 1024} color={i === 0 ? "var(--color-accent)" : "var(--color-secondary)"} />)
            : <CDNBar label="Cloudinary (Default Pool)" used={0} total={10} color="var(--color-accent)" />
          }
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-purple)', margin: '20px 0 12px' }}>📷 ImageKit Pool</p>
          {cdnAccounts.filter(a => a.provider === 'imagekit').length > 0
            ? cdnAccounts.filter(a => a.provider === 'imagekit').map((a, i) => <CDNBar key={a.id} label={`ImageKit #${i + 1} (${a.accountId})`} used={a.storageUsedMB / 1024} total={a.storageLimitMB / 1024} color="var(--color-purple)" />)
            : <CDNBar label="ImageKit (Default Pool)" used={0} total={10} color="var(--color-purple)" />
          }
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 16, textAlign: 'center' }}>Total edits: {edits.length}</p>
        </div>
      )}

      {tab === 'reviews' && (
        <div className="glass" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}><Star size={14} color="#fbbf24" /> Review Management</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)' }}>{reviews.filter(r => r.approved).length} approved / {reviews.length} total</span>
              {reviews.length > 0 && <button className="btn btn-ghost" onClick={handleDeleteAllReviews} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ff4655', borderColor: 'rgba(255,70,85,0.3)', fontSize: '0.75rem', padding: '4px 10px' }}><Trash2 size={12} /> Delete All</button>}
            </div>
          </div>
          {reviews.length === 0 ? <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: 40 }}>No reviews yet.</p> : (
            <div style={{ maxHeight: '60vh', overflowY: 'auto', borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 4 }}>
                {reviews.map(r => (
                  <div key={r.id} style={{ padding: 16, borderRadius: 12, background: r.approved ? 'rgba(0,255,212,0.03)' : 'rgba(255,70,85,0.03)', border: `1px solid ${r.approved ? 'rgba(0,255,212,0.15)' : 'rgba(255,70,85,0.15)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem' }}>{r.name}</span>
                        <span style={{ color: '#fbbf24', fontSize: '0.8rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                        <span style={{ padding: '2px 8px', borderRadius: 8, fontSize: '0.6rem', fontFamily: 'var(--font-mono)', background: r.approved ? 'rgba(0,255,212,0.1)' : 'rgba(255,70,85,0.1)', color: r.approved ? 'var(--color-accent)' : 'var(--color-primary)' }}>{r.approved ? '✓ Approved' : '⏳ Pending'}</span>
                      </div>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>&ldquo;{r.text}&rdquo;</p>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost" style={{ fontSize: '0.6rem', padding: '4px 10px' }} onClick={async () => { await approveReview(r.id, !r.approved); setReviews(prev => prev.map(rev => rev.id === r.id ? { ...rev, approved: !rev.approved } : rev)); }}>{r.approved ? 'Unapprove' : 'Approve'}</button>
                      <button className="btn btn-ghost" style={{ fontSize: '0.6rem', padding: '4px 10px', color: 'var(--color-primary)', borderColor: 'rgba(255,70,85,0.3)' }} onClick={async () => { if (!confirm('Delete?')) return; await deleteReview(r.id); setReviews(prev => prev.filter(rev => rev.id !== r.id)); }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'store' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}><Store size={16} color="var(--color-primary)" /> Store & WhatsApp Links</h3>
            <button className="btn btn-primary" onClick={() => { setShowAddLink(true); setNewLink({ name: '', url: '', description: '', image: '', color: '#ff4655', type: 'store', verified: true, order: storeLinks.length }); }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={14} /> Add Link</button>
          </div>

          {showAddLink && (
            <div className="glass" style={{ padding: 24, marginBottom: 24, border: '1px solid var(--color-primary)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Add New Link</h3>
              <form onSubmit={async (e) => { e.preventDefault(); if (!newLink.name || !newLink.url) return alert('Name and URL are required'); try { await addStoreLink(newLink); setShowAddLink(false); setStoreLinks(await getAllStoreLinks()); } catch (err) { alert('Failed: ' + err.message); } }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 2, minWidth: 200 }}><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Name *</label><input type="text" className="input" placeholder="e.g., Joyner Store" value={newLink.name} onChange={e => setNewLink({...newLink, name: e.target.value})} required /></div>
                  <div style={{ flex: 1, minWidth: 120 }}><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Type</label><select className="input" value={newLink.type} onChange={e => setNewLink({...newLink, type: e.target.value})}><option value="store">🛒 Store</option><option value="whatsapp">💬 WhatsApp Group</option></select></div>
                </div>
                <div><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>URL *</label><input type="url" className="input" placeholder={newLink.type === 'whatsapp' ? 'https://chat.whatsapp.com/...' : 'https://www.example.com'} value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})} required /></div>
                <div><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Description</label><input type="text" className="input" placeholder="Short description of this link" value={newLink.description} onChange={e => setNewLink({...newLink, description: e.target.value})} /></div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 2, minWidth: 200 }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Logo Image</label>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                      {newLink.image && <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}><img src={newLink.image} alt="Logo preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                      <input type="file" accept="image/*" ref={logoInputRef} onChange={e => handleLogoUpload(e.target.files?.[0], 'add')} style={{ display: 'none' }} />
                      <button type="button" className="btn btn-ghost" style={{ fontSize: '0.7rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => logoInputRef.current?.click()} disabled={uploadingLogo}>
                        <Upload size={12} /> {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                      </button>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>or</span>
                      <input type="text" className="input" placeholder="Paste image URL" value={newLink.image} onChange={e => setNewLink({...newLink, image: e.target.value})} style={{ flex: 1, minWidth: 140 }} />
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 100 }}><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Accent Color</label><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><input type="color" value={newLink.color} onChange={e => setNewLink({...newLink, color: e.target.value})} style={{ width: 40, height: 36, border: 'none', background: 'none', cursor: 'pointer' }} /><input type="text" className="input" value={newLink.color} onChange={e => setNewLink({...newLink, color: e.target.value})} style={{ flex: 1 }} /></div></div>
                  <div style={{ flex: 1, minWidth: 80 }}><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Order</label><input type="number" className="input" value={newLink.order} onChange={e => setNewLink({...newLink, order: parseInt(e.target.value) || 0})} /></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" id="verified" checked={newLink.verified} onChange={e => setNewLink({...newLink, verified: e.target.checked})} /><label htmlFor="verified" style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Verified badge</label></div>
                <div style={{ display: 'flex', gap: 10 }}><button type="button" className="btn btn-ghost" onClick={() => setShowAddLink(false)}>Cancel</button><button type="submit" className="btn btn-primary">Save Link</button></div>
              </form>
            </div>
          )}

          <div className="glass" style={{ padding: 24 }}>
            {storeLinks.length === 0 ? <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: 40 }}>No store links yet. Click "Add Link" to create one.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {storeLinks.map(link => (
                  <div key={link.id} style={{ padding: 16, borderRadius: 12, background: link.type === 'whatsapp' ? 'rgba(37,211,102,0.04)' : 'rgba(255,70,85,0.04)', border: `1px solid ${link.type === 'whatsapp' ? 'rgba(37,211,102,0.15)' : 'rgba(255,70,85,0.15)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    {editingLinkId === link.id ? (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 250 }}>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          <input className="input" placeholder="Name" value={editLinkData.name || ''} onChange={e => setEditLinkData({...editLinkData, name: e.target.value})} style={{ flex: 2, minWidth: 140 }} />
                          <select className="input" value={editLinkData.type || 'store'} onChange={e => setEditLinkData({...editLinkData, type: e.target.value})} style={{ flex: 1, minWidth: 120 }}><option value="store">🛒 Store</option><option value="whatsapp">💬 WhatsApp</option></select>
                        </div>
                        <input className="input" placeholder="URL" value={editLinkData.url || ''} onChange={e => setEditLinkData({...editLinkData, url: e.target.value})} />
                        <input className="input" placeholder="Description" value={editLinkData.description || ''} onChange={e => setEditLinkData({...editLinkData, description: e.target.value})} />
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                          {editLinkData.image && <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}><img src={editLinkData.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                          <input type="file" accept="image/*" ref={editLogoInputRef} onChange={e => handleLogoUpload(e.target.files?.[0], 'edit')} style={{ display: 'none' }} />
                          <button type="button" className="btn btn-ghost" style={{ fontSize: '0.6rem', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => editLogoInputRef.current?.click()} disabled={uploadingEditLogo}><Upload size={10} /> {uploadingEditLogo ? '...' : 'Upload'}</button>
                          <input className="input" placeholder="Image URL" value={editLinkData.image || ''} onChange={e => setEditLinkData({...editLinkData, image: e.target.value})} style={{ flex: 2, minWidth: 100 }} />
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><input type="color" value={editLinkData.color || '#ff4655'} onChange={e => setEditLinkData({...editLinkData, color: e.target.value})} style={{ width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer' }} /></div>
                          <input type="number" className="input" placeholder="Order" value={editLinkData.order ?? 0} onChange={e => setEditLinkData({...editLinkData, order: parseInt(e.target.value) || 0})} style={{ width: 60 }} />
                          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--text-dim)' }}><input type="checkbox" checked={editLinkData.verified ?? true} onChange={e => setEditLinkData({...editLinkData, verified: e.target.checked})} />Verified</label>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '0.7rem' }} onClick={async () => { try { await updateStoreLink(link.id, editLinkData); setEditingLinkId(null); setStoreLinks(await getAllStoreLinks()); } catch (err) { alert('Failed: ' + err.message); } }}>Save</button>
                          <button className="btn btn-ghost" style={{ padding: '4px 12px', fontSize: '0.7rem' }} onClick={() => setEditingLinkId(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 200 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: `1px solid ${link.color}33`, flexShrink: 0 }}>
                            {link.image ? <img src={link.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : link.type === 'whatsapp' ? <MessageCircle size={18} color="#25d366" /> : <Store size={18} color={link.color} />}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem' }}>{link.name}</span>
                              <span style={{ padding: '2px 8px', borderRadius: 8, fontSize: '0.6rem', fontFamily: 'var(--font-mono)', background: link.type === 'whatsapp' ? 'rgba(37,211,102,0.12)' : 'rgba(255,70,85,0.12)', color: link.type === 'whatsapp' ? '#25d366' : '#ff4655' }}>{link.type === 'whatsapp' ? '💬 WhatsApp' : '🛒 Store'}</span>
                              {link.verified && <span style={{ padding: '2px 8px', borderRadius: 8, fontSize: '0.55rem', fontFamily: 'var(--font-mono)', background: 'rgba(0,255,212,0.1)', color: '#00ffd4' }}>✓ Verified</span>}
                            </div>
                            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 2 }}>{link.url}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)', padding: '2px 6px', background: 'rgba(255,255,255,0.03)', borderRadius: 4 }}>#{link.order}</span>
                          <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '0.65rem' }} onClick={() => { setEditingLinkId(link.id); setEditLinkData({ name: link.name, url: link.url, description: link.description, image: link.image, color: link.color, type: link.type, verified: link.verified, order: link.order }); }}><Pencil size={12} /> Edit</button>
                          <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '0.65rem', color: 'var(--color-primary)', borderColor: 'rgba(255,70,85,0.3)' }} onClick={async () => { if (!confirm(`Delete "${link.name}"?`)) return; try { await deleteStoreLink(link.id); setStoreLinks(await getAllStoreLinks()); } catch (err) { alert('Failed: ' + err.message); } }}><Trash2 size={12} /></button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="glass" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem' }}>⚙️ Site Settings</h3>
            <button className="btn btn-primary" onClick={handleSaveSettings} disabled={savingSettings}>{savingSettings ? 'Saving...' : 'Save Settings'}</button>
          </div>
          <div style={{ marginBottom: 16 }}><label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>MAINTENANCE MODE</label><button className={`btn ${siteSettings.maintenanceMode ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setSiteSettings({...siteSettings, maintenanceMode: !siteSettings.maintenanceMode})}>{siteSettings.maintenanceMode ? 'ON — Click to disable' : 'OFF — Click to enable'}</button></div>
          <div><label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>HERO TEXT</label><input className="input" placeholder="Valorant Image Design Studio" value={siteSettings.heroText} onChange={e => setSiteSettings({...siteSettings, heroText: e.target.value})} /></div>
        </div>
      )}
    </div>
  );
}
