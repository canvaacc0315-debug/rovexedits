'use client';
import { useState, useEffect, useRef } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { getEditsByEditor, addEdit, getEditorByClerkId, linkClerkToEditor } from '@/lib/db';
import Link from 'next/link';

export default function EditorDashboard() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [session, setSession] = useState(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [linking, setLinking] = useState(false);
  const [checkingLink, setCheckingLink] = useState(true);
  const [tab, setTab] = useState('edits');
  const [edits, setEdits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadName, setUploadName] = useState('');
  const [uploadTier, setUploadTier] = useState('mid-prem');
  const [uploadStyle, setUploadStyle] = useState('regular');
  const fileInputRef = useRef(null);
  const [profileData, setProfileData] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const [editingEdit, setEditingEdit] = useState(null);
  const [editName, setEditName] = useState('');
  const [editTier, setEditTier] = useState('mid-prem');
  const [editStyle, setEditStyle] = useState('regular');

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) { setCheckingLink(false); return; }
    if (!session) setCheckingLink(true);
    const userEmail = user.emailAddresses?.[0]?.emailAddress;
    getEditorByClerkId(user.id).then(async editor => {
      if (editor) {
        if (userEmail === 'vaibhavpatilpro@gmail.com' && (!editor.isAdmin || !editor.email)) {
          const { updateEditorProfile } = await import('@/lib/db');
          await updateEditorProfile(editor.id, { isAdmin: true, email: userEmail });
          editor.isAdmin = true;
          editor.email = userEmail;
        }
        // Sync usedCount with actual edits to prevent drift
        const { syncEditorUsedCount, getEditorById } = await import('@/lib/db');
        const actualUsed = await syncEditorUsedCount(editor.id);
        // Re-fetch editor to get the freshest maxUploads (may have been updated by admin)
        const freshEditor = await getEditorById(editor.id);
        const maxUploads = freshEditor?.maxUploads || editor.maxUploads || 0;
        setSession({ name: freshEditor?.name || editor.name, slug: freshEditor?.slug || editor.slug, editorId: editor.id, maxUploads, quotaRemaining: maxUploads - actualUsed, expiresAt: freshEditor?.expiresAt || editor.expiresAt });
      }
      setCheckingLink(false);
    }).catch(() => setCheckingLink(false));
  }, [isLoaded, isSignedIn, user?.id, session?.editorId]);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    getEditsByEditor(session.editorId).then(setEdits).finally(() => setLoading(false));
    import('@/lib/db').then(({ getEditorById }) => {
      getEditorById(session.editorId).then(res => {
        if (res) setProfileData({ name: res.name || '', bio: res.bio || '', avatar: res.avatar || '', banner: res.banner || '', commissionStatus: res.commissionStatus || 'closed', socialLinks: res.socialLinks || { instagram: '', discord: '', youtube: '', whatsapp: '' } });
      });
    });
  }, [session]);

  const uploadDirectToCloudinary = async (file) => {
    const sigRes = await fetch('/api/upload/signature');
    const sigData = await sigRes.json();
    if (sigData.error) throw new Error(sigData.error);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', sigData.apiKey);
    formData.append('timestamp', sigData.timestamp);
    formData.append('signature', sigData.signature);
    formData.append('folder', 'rovexedits');

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) throw new Error(uploadData.error?.message || 'Cloudinary direct upload failed');

    const urlParts = uploadData.secure_url.split('/upload/');
    const thumbUrl = urlParts[0] + '/upload/w_600,c_scale,f_webp,q_auto/' + urlParts[1];

    return {
      imageUrl: uploadData.secure_url,
      thumbUrl,
      provider: `cloudinary:${sigData.cloudName}`
    };
  };

  const handleLinkEditor = async () => {
    if (!code.trim() || !user) return;
    setLinking(true); setError('');
    try {
      const editor = await linkClerkToEditor(code.trim(), user.id);
      if (!editor) { setError('Invalid or revoked editor code.'); setLinking(false); return; }
      setSession({ name: editor.name, slug: editor.slug, editorId: editor.id, maxUploads: editor.maxUploads || 0, quotaRemaining: (editor.maxUploads || 0) - (editor.usedCount || 0), expiresAt: editor.expiresAt });
    } catch (err) { setError(err.message || 'Failed to link editor.'); }
    finally { setLinking(false); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadName || !session) return;
    setUploading(true);
    try {
      const cdnData = await uploadDirectToCloudinary(uploadFile);
      
      await addEdit({ name: uploadName, editorId: session.editorId, editorName: session.name, editorSlug: session.slug, tier: uploadTier, style: uploadStyle, imageUrl: cdnData.imageUrl, thumbUrl: cdnData.thumbUrl, provider: cdnData.provider, downloads: 0, views: 0, isPinned: false });
      const freshEdits = await getEditsByEditor(session.editorId);
      setEdits(freshEdits);
      setShowUpload(false); setUploadFile(null); setUploadName('');
      // Re-sync quota from actual count instead of local decrement to prevent drift
      const { syncEditorUsedCount } = await import('@/lib/db');
      await syncEditorUsedCount(session.editorId);
      setSession(prev => prev ? { ...prev, quotaRemaining: prev.maxUploads - freshEdits.length } : null);
      alert('Edit uploaded successfully!');
    } catch (err) { alert('Upload failed: ' + err.message); }
    finally { setUploading(false); }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profileData || !session) return;
    setSavingProfile(true);
    try {
      let avatarUrl = profileData.avatar, bannerUrl = profileData.banner;
      const uploadTasks = [];
      if (avatarInputRef.current?.files?.[0]) { 
        uploadTasks.push(uploadDirectToCloudinary(avatarInputRef.current.files[0]).then(d => avatarUrl = d.imageUrl)); 
      }
      if (bannerInputRef.current?.files?.[0]) { 
        uploadTasks.push(uploadDirectToCloudinary(bannerInputRef.current.files[0]).then(d => bannerUrl = d.imageUrl)); 
      }
      if (uploadTasks.length > 0) await Promise.all(uploadTasks);
      
      const updatedData = { ...profileData, avatar: avatarUrl, banner: bannerUrl };
      const { updateEditorProfile } = await import('@/lib/db');
      await updateEditorProfile(session.editorId, updatedData);
      setProfileData(updatedData);
      setSession(prev => ({ ...prev, name: updatedData.name }));
      alert('Profile updated successfully!');
    } catch (err) { alert('Update failed: ' + err.message); }
    finally { setSavingProfile(false); }
  };

  const isExpired = session?.expiresAt && session.expiresAt < Date.now();
  const daysUntilExpiry = session?.expiresAt ? Math.ceil((session.expiresAt - Date.now()) / (1000 * 60 * 60 * 24)) : null;
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 3 && daysUntilExpiry > 0;

  useEffect(() => {
    if (isExpiringSoon && session?.editorId) {
      // Trigger email notification using Clerk on the backend
      const notified = localStorage.getItem(`expiry_notified_${session.editorId}`);
      if (!notified) {
         fetch('/api/editor/notify-expiry', { method: 'POST', body: JSON.stringify({ editorId: session.editorId }) }).catch(console.error);
         localStorage.setItem(`expiry_notified_${session.editorId}`, 'true');
      }
    }
  }, [isExpiringSoon, session?.editorId]);

  if (!isLoaded || checkingLink) return (
    <div className="container" style={{ textAlign: 'center', padding: '120px 20px' }}>
      <div className="animate-spin" style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid var(--color-primary)', borderRadius: '50%', margin: '0 auto 16px' }} />
      <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dim)', letterSpacing: '0.1em', fontSize: '0.9rem' }}>LOADING...</h2>
    </div>
  );

  if (!isSignedIn) return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: 24 }}>
      <div className="glass" style={{ padding: '48px 40px', maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🎨</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '0.1em', marginBottom: 8 }}>Editor Dashboard</h1>
        <p style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: 28 }}>Sign in to access your editor dashboard.</p>
        <Link href="/sign-in"><button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Sign In to Continue</button></Link>
        <a href="/" className="btn btn-ghost" style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}>← Back to Gallery</a>
      </div>
    </div>
  );

  if (!session) return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: 24 }}>
      <div className="glass" style={{ padding: '48px 40px', maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)' }}>Signed in as {user?.firstName || user?.emailAddresses[0]?.emailAddress}</span>
          <UserButton />
        </div>
        <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🔑</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.1em', marginBottom: 8 }}>Become an Editor</h1>
        <p style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: 24 }}>Enter your editor code to link your account.</p>
        <input className="input" type="text" placeholder="ROVEX-XXX-XXXX" value={code} onChange={e => setCode(e.target.value.toUpperCase())} onKeyDown={e => e.key === 'Enter' && !linking && handleLinkEditor()} style={{ marginBottom: 16, textAlign: 'center', letterSpacing: '0.15em', fontFamily: 'var(--font-mono)' }} />
        {error && <p style={{ color: 'var(--color-primary)', fontSize: '0.8rem', marginBottom: 12 }}>{error}</p>}
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/" className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Cancel</a>
          <button className="btn btn-purple" onClick={handleLinkEditor} disabled={linking} style={{ flex: 1, justifyContent: 'center' }}>{linking ? 'Linking...' : 'Link Account'}</button>
        </div>
      </div>
    </div>
  );

  const handleDelete = async (editId) => {
    if (!confirm('Are you sure you want to delete this edit?')) return;
    try {
      const { deleteEdit, syncEditorUsedCount } = await import('@/lib/db');
      await deleteEdit(editId);
      const remaining = edits.filter(e => e.id !== editId);
      setEdits(remaining);
      // Re-sync quota after deletion
      await syncEditorUsedCount(session.editorId);
      setSession(prev => prev ? { ...prev, quotaRemaining: prev.maxUploads - remaining.length } : null);
    } catch (err) {
      alert('Failed to delete edit: ' + err.message);
    }
  };

  const handleEditClick = (edit) => {
    setEditingEdit(edit);
    setEditName(edit.name);
    setEditTier(edit.tier);
    setEditStyle(edit.style);
    setShowUpload(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const { updateEdit } = await import('@/lib/db');
      await updateEdit(editingEdit.id, {
        name: editName,
        tier: editTier,
        style: editStyle
      });
      setEdits(edits.map(e => e.id === editingEdit.id ? { ...e, name: editName, tier: editTier, style: editStyle } : e));
      setEditingEdit(null);
    } catch (err) {
      alert('Failed to update: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '24px 24px 80px' }}>
      {isExpired && (
        <div style={{ padding: 16, background: 'rgba(255, 70, 85, 0.1)', border: '1px solid #ff4655', borderRadius: 8, marginBottom: 24 }}>
          <h3 style={{ color: '#ff4655', fontFamily: 'var(--font-display)', marginBottom: 4 }}>🚨 Code Expired</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Your editor code has expired. You can no longer upload edits. Please contact the admin to renew your code.</p>
        </div>
      )}
      {isExpiringSoon && (
        <div style={{ padding: 16, background: 'rgba(251, 191, 36, 0.1)', border: '1px solid #fbbf24', borderRadius: 8, marginBottom: 24 }}>
          <h3 style={{ color: '#fbbf24', fontFamily: 'var(--font-display)', marginBottom: 4 }}>⚠️ Code Expiring Soon</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Your editor code will expire in {daysUntilExpiry} day(s). Please prepare to renew it.</p>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '0.08em' }}><span style={{ color: 'var(--color-primary)' }}>🎨</span> {session.name}&apos;s Dashboard</h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 4 }}>{session.quotaRemaining} upload slots remaining</p>
          {session.expiresAt && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: isExpired ? '#ff4655' : 'var(--color-accent)', marginTop: 4 }}>Valid until: {new Date(session.expiresAt).toLocaleDateString()}</p>}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <a href={`/${session.slug}`} className="btn btn-ghost" style={{ fontSize: '0.6rem' }} target="_blank">👤 View Profile</a>
          <a href="/" className="btn btn-ghost" style={{ fontSize: '0.6rem' }}>← Gallery</a>
          <UserButton />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button className="btn btn-ghost" style={{ borderRadius: '8px 8px 0 0', borderBottom: tab === 'edits' ? '2px solid var(--color-accent)' : 'none' }} onClick={() => setTab('edits')}>My Edits</button>
        <button className="btn btn-ghost" style={{ borderRadius: '8px 8px 0 0', borderBottom: tab === 'profile' ? '2px solid var(--color-purple)' : 'none' }} onClick={() => setTab('profile')}>Profile Settings</button>
      </div>

      {tab === 'edits' && (
        <>
          <div className="glass" style={{ padding: 16, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>Upload Quota</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-accent)' }}>{edits.length} / {session.maxUploads} used</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 4, background: edits.length >= session.maxUploads ? 'var(--color-primary)' : 'var(--color-accent)', width: `${session.maxUploads > 0 ? Math.min((edits.length / session.maxUploads) * 100, 100) : 0}%`, transition: 'width 0.5s ease' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button className="btn btn-primary" onClick={() => setShowUpload(true)} disabled={session.quotaRemaining <= 0 || isExpired}>{isExpired ? '⚠ Expired' : session.quotaRemaining > 0 ? '+ Upload Edit' : '⚠ No slots left'}</button>
          </div>
          {showUpload && (
            <div className="glass" style={{ padding: 24, marginBottom: 24, border: '1px solid var(--color-primary)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Upload New Edit</h3>
              <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Image File</label><input type="file" accept="image/*" className="input" ref={fileInputRef} onChange={e => setUploadFile(e.target.files?.[0] || null)} required /></div>
                <div><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Edit Name</label><input type="text" className="input" placeholder="e.g., Reaver Vandal Red" value={uploadName} onChange={e => setUploadName(e.target.value)} required /></div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Tier</label><select className="input" value={uploadTier} onChange={e => setUploadTier(e.target.value)}><option value="high-prem">High Prem</option><option value="mid-prem">Mid Prem</option><option value="low-prem">Low Prem</option></select></div>
                  <div style={{ flex: 1 }}><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Style</label><select className="input" value={uploadStyle} onChange={e => setUploadStyle(e.target.value)}><option value="regular">Regular</option><option value="php">PHP (Glow)</option></select></div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}><button type="button" className="btn btn-ghost" onClick={() => setShowUpload(false)}>Cancel</button><button type="submit" className="btn btn-primary" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload & Save'}</button></div>
              </form>
            </div>
          )}
          {editingEdit && (
            <div className="glass" style={{ padding: 24, marginBottom: 24, border: '1px solid var(--color-accent)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Edit Post</h3>
              <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Edit Name</label><input type="text" className="input" value={editName} onChange={e => setEditName(e.target.value)} required /></div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Tier</label><select className="input" value={editTier} onChange={e => setEditTier(e.target.value)}><option value="high-prem">High Prem</option><option value="mid-prem">Mid Prem</option><option value="low-prem">Low Prem</option></select></div>
                  <div style={{ flex: 1 }}><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Style</label><select className="input" value={editStyle} onChange={e => setEditStyle(e.target.value)}><option value="regular">Regular</option><option value="php">PHP (Glow)</option></select></div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}><button type="button" className="btn btn-ghost" onClick={() => setEditingEdit(null)}>Cancel</button><button type="submit" className="btn btn-accent" disabled={uploading}>{uploading ? 'Updating...' : 'Save Changes'}</button></div>
              </form>
            </div>
          )}
          <div className="glass" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', marginBottom: 16 }}>My Edits</h3>
            {loading ? <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>Loading...</p> : edits.length === 0 ? <p style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', textAlign: 'center' }}>No edits yet. Click &quot;+ Upload Edit&quot; to get started!</p> : (
              <div className="gallery-grid">
                {edits.map((edit, i) => (
                  <div key={edit.id} className={`edit-card ${edit.style === 'php' ? 'php-glow' : ''}`} style={{ animationDelay: `${i * 0.08}s` }}>
                    <div className="card-img-wrap" style={{ aspectRatio: '16/10', borderRadius: '16px 16px 0 0' }}>
                      {edit.thumbUrl ? <img className="card-img" src={edit.thumbUrl} alt={edit.name} loading="lazy" /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}><span style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', opacity: 0.5 }}>{edit.name}</span></div>}
                      <div className="card-badges">
                        <span className={`badge badge-${edit.tier === 'high-prem' ? 'high' : edit.tier === 'mid-prem' ? 'mid' : 'low'}`} style={{ borderRadius: 8, padding: '4px 10px' }}>{edit.tier.replace('-', ' ')}</span>
                        <span className={`badge badge-${edit.style === 'php' ? 'php' : 'reg'}`} style={{ borderRadius: 8, padding: '4px 10px' }}>{edit.style === 'php' ? 'PHP' : 'Regular'}</span>
                      </div>
                    </div>
                    <div className="card-footer" style={{ display: 'flex', flexDirection: 'column', padding: '16px 20px', gap: 12 }}>
                      <div className="card-title" style={{ fontSize: '1.1rem' }}>{edit.name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div className="card-meta">{edit.tier.replace('-', ' ')} • {edit.style} • {edit.downloads} DL</div>
                         <div style={{ display: 'flex', gap: 12 }}>
                           <button onClick={(e) => { e.stopPropagation(); handleEditClick(edit); }} style={{ color: 'var(--color-accent)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>Edit</button>
                           <button onClick={(e) => { e.stopPropagation(); handleDelete(edit.id); }} style={{ color: 'var(--color-primary)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>Delete</button>
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'profile' && !profileData && <div style={{ textAlign: 'center', padding: 60 }}><p style={{ color: 'var(--text-dim)' }}>Loading profile...</p></div>}

      {tab === 'profile' && profileData && (
        <div className="glass" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 20 }}>Customize Profile</h3>
          <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Display Name</label><input type="text" className="input" value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} placeholder="Your Editor Name" required /></div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 250 }}><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Avatar</label><input type="file" accept="image/*" className="input" ref={avatarInputRef} />{profileData.avatar && <img src={profileData.avatar} alt="Avatar" style={{ height: 60, marginTop: 10, borderRadius: '50%' }} />}</div>
              <div style={{ flex: 1, minWidth: 250 }}><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Banner</label><input type="file" accept="image/*" className="input" ref={bannerInputRef} />{profileData.banner && <img src={profileData.banner} alt="Banner" style={{ height: 60, marginTop: 10, borderRadius: 8, objectFit: 'cover' }} />}</div>
            </div>
            <div><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Bio</label><textarea className="input" rows={3} value={profileData.bio} onChange={e => setProfileData({ ...profileData, bio: e.target.value })} placeholder="Tell people about yourself..." /></div>
            <div><label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Commissions</label><select className="input" value={profileData.commissionStatus} onChange={e => setProfileData({ ...profileData, commissionStatus: e.target.value })}><option value="open">Open</option><option value="closed">Closed</option></select></div>
            <div>
              <h4 style={{ fontSize: '0.9rem', marginBottom: 10 }}>Social Links</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div><label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Instagram</label><input type="text" className="input" value={profileData.socialLinks.instagram} onChange={e => setProfileData({ ...profileData, socialLinks: { ...profileData.socialLinks, instagram: e.target.value } })} /></div>
                <div><label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>Discord</label><input type="text" className="input" value={profileData.socialLinks.discord} onChange={e => setProfileData({ ...profileData, socialLinks: { ...profileData.socialLinks, discord: e.target.value } })} /></div>
                <div><label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>WhatsApp</label><input type="text" className="input" value={profileData.socialLinks.whatsapp} onChange={e => setProfileData({ ...profileData, socialLinks: { ...profileData.socialLinks, whatsapp: e.target.value } })} /></div>
                <div><label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 4, display: 'block' }}>YouTube</label><input type="text" className="input" value={profileData.socialLinks.youtube} onChange={e => setProfileData({ ...profileData, socialLinks: { ...profileData.socialLinks, youtube: e.target.value } })} /></div>
              </div>
            </div>
            <button type="submit" className="btn btn-purple" style={{ alignSelf: 'flex-start', marginTop: 10 }} disabled={savingProfile}>{savingProfile ? 'Saving...' : 'Save Profile'}</button>
          </form>
        </div>
      )}
    </div>
  );
}
