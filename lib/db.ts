import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Edit, Editor, Review, CDNAccount, StoreLink } from './types';

// ── EDITS ──

// Normalizes old data format (rovexedits) to new format (rovexedits-v2)
function normalizeEdit(docId: string, data: any): Edit {
  // Handle old "created_at" (Firestore Timestamp) vs new "createdAt" (number)
  let createdAt = data.createdAt;
  if (!createdAt && data.created_at) {
    createdAt = data.created_at.seconds ? data.created_at.seconds * 1000 : Date.now();
  }
  if (!createdAt) createdAt = Date.now();

  // Handle old tier format ("low","mid","high") vs new ("low-prem","mid-prem","high-prem")
  let tier = data.tier || 'mid-prem';
  if (tier === 'low') tier = 'low-prem';
  else if (tier === 'mid') tier = 'mid-prem';
  else if (tier === 'high') tier = 'high-prem';

  return {
    id: docId,
    name: data.name || 'Untitled',
    imageUrl: data.imageUrl || data.url || '',
    thumbUrl: data.thumbUrl || data.imageUrl || data.url || '',
    provider: data.provider || 'imagekit',
    tier,
    style: data.style || 'regular',
    editorId: data.editorId || 'admin',
    editorName: data.editorName || 'Vaibhav',
    editorSlug: data.editorSlug || (data.editorName || 'vaibhav').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    isPinned: data.isPinned ?? data.pinned ?? false,
    downloads: data.downloads || 0,
    views: data.views || 0,
    createdAt,
  } as Edit;
}

export async function getAllEdits(): Promise<Edit[]> {
  try {
    const snapshot = await getDocs(collection(db, 'edits'));
    let edits = snapshot.docs.map(doc => normalizeEdit(doc.id, doc.data()));
    
    // Fetch editors to attach avatars
    const editorsSnapshot = await getDocs(collection(db, 'editors'));
    const editorsMap = new Map();
    editorsSnapshot.docs.forEach(d => editorsMap.set(d.id, d.data()));
    
    edits = edits.map(e => {
      const ed = editorsMap.get(e.editorId);
      return {
        ...e,
        editorAvatar: ed?.avatar || null,
        editorWhatsapp: ed?.socialLinks?.whatsapp || null,
      };
    });

    return edits.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Error fetching edits:", error);
    return [];
  }
}

export async function getEditsByEditor(editorId: string): Promise<Edit[]> {
  try {
    const q = query(collection(db, 'edits'), where('editorId', '==', editorId));
    const snapshot = await getDocs(q);
    let results = snapshot.docs.map(doc => normalizeEdit(doc.id, doc.data()));
    
    const editorDoc = await getDoc(doc(db, 'editors', editorId));
    const ed = editorDoc.data();
    results = results.map(e => ({
       ...e,
       editorAvatar: ed?.avatar || null,
       editorWhatsapp: ed?.socialLinks?.whatsapp || null,
    }));

    return results.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Error fetching editor's edits:", error);
    return [];
  }
}

export async function addEdit(edit: Omit<Edit, 'id' | 'createdAt'>): Promise<string> {
  const newDocRef = doc(collection(db, 'edits'));
  const newEdit = {
    ...edit,
    id: newDocRef.id,
    createdAt: Date.now(), // using client timestamp for simplicity in sorting arrays later
  };
  await setDoc(newDocRef, newEdit);
  
  // Update the editor's used quota
  const editorRef = doc(db, 'editors', edit.editorId);
  const editorSnap = await getDoc(editorRef);
  if (editorSnap.exists()) {
    const data = editorSnap.data();
    await updateDoc(editorRef, { usedCount: (data.usedCount || 0) + 1 });
  }
  
  return newDocRef.id;
}

export async function incrementDownloads(editId: string): Promise<void> {
  const ref = doc(db, 'edits', editId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, { downloads: (snap.data().downloads || 0) + 1 });
  }
}

export async function deleteEdit(editId: string): Promise<void> {
  const ref = doc(db, 'edits', editId);
  const snap = await getDoc(ref);
  
  // Decrement the editor's usedCount before deleting
  if (snap.exists()) {
    const editData = snap.data();
    if (editData.editorId) {
      const editorRef = doc(db, 'editors', editData.editorId);
      const editorSnap = await getDoc(editorRef);
      if (editorSnap.exists()) {
        const editorData = editorSnap.data();
        await updateDoc(editorRef, { usedCount: Math.max(0, (editorData.usedCount || 0) - 1) });
      }
    }
  }
  
  await deleteDoc(ref);
}

export async function updateEdit(editId: string, data: Partial<Edit>): Promise<void> {
  const ref = doc(db, 'edits', editId);
  await updateDoc(ref, data);
}

// Sync an editor's usedCount with the actual number of edits in the database
export async function syncEditorUsedCount(editorId: string): Promise<number> {
  const q = query(collection(db, 'edits'), where('editorId', '==', editorId));
  const snapshot = await getDocs(q);
  const actualCount = snapshot.size;
  const editorRef = doc(db, 'editors', editorId);
  await updateDoc(editorRef, { usedCount: actualCount });
  return actualCount;
}

export async function deleteAllEdits(): Promise<number> {
  const snapshot = await getDocs(collection(db, 'edits'));
  const count = snapshot.size;
  const promises = snapshot.docs.map(d => deleteDoc(doc(db, 'edits', d.id)));
  await Promise.all(promises);

  // Reset all editor usedCounts to 0
  const editorsSnapshot = await getDocs(collection(db, 'editors'));
  const editorPromises = editorsSnapshot.docs.map(d => updateDoc(doc(db, 'editors', d.id), { usedCount: 0 }));
  await Promise.all(editorPromises);

  return count;
}

// ── EDITORS ──

export async function getAllEditors(): Promise<Editor[]> {
  try {
    const q = query(collection(db, 'editors'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Editor));
  } catch (error) {
    console.error("Error fetching editors:", error);
    return [];
  }
}

export async function getEditorById(id: string): Promise<Editor | null> {
  try {
    const docSnap = await getDoc(doc(db, 'editors', id));
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as Editor;
  } catch (error) {
    console.error("Error fetching editor by id:", error);
    return null;
  }
}

export async function getEditorBySlug(slug: string): Promise<Editor | null> {
  try {
    const q = query(collection(db, 'editors'), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Editor;
  } catch (error) {
    console.error("Error fetching editor by slug:", error);
    return null;
  }
}

export async function getEditorByCode(code: string): Promise<Editor | null> {
  try {
    const q = query(collection(db, 'editors'), where('code', '==', code), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Editor;
  } catch (error) {
    console.error("Error fetching editor by code:", error);
    return null;
  }
}

export async function getEditorByClerkId(clerkId: string): Promise<Editor | null> {
  try {
    const q = query(collection(db, 'editors'), where('clerkId', '==', clerkId), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Editor;
  } catch (error) {
    console.error("Error fetching editor by clerkId:", error);
    return null;
  }
}

export async function linkClerkToEditor(code: string, clerkId: string): Promise<Editor | null> {
  const editor = await getEditorByCode(code);
  if (!editor) return null;
  if (editor.revoked) return null;
  // Link the Clerk user to this editor
  await updateDoc(doc(db, 'editors', editor.id), { clerkId });
  return { ...editor, clerkId } as Editor;
}

export async function addEditor(editor: Omit<Editor, 'id' | 'createdAt' | 'usedCount'>): Promise<string> {
  const newDocRef = doc(collection(db, 'editors'));
  const newEditor = {
    ...editor,
    id: newDocRef.id,
    usedCount: 0,
    createdAt: Date.now(),
  };
  await setDoc(newDocRef, newEditor);
  return newDocRef.id;
}

export async function deleteEditor(editorId: string): Promise<void> {
  await deleteDoc(doc(db, 'editors', editorId));
}

export async function toggleRevokeEditor(editorId: string, currentStatus: boolean): Promise<void> {
  await updateDoc(doc(db, 'editors', editorId), { revoked: !currentStatus });
}

export async function toggleVerifyEditor(editorId: string, currentStatus: boolean): Promise<void> {
  await updateDoc(doc(db, 'editors', editorId), { verified: !currentStatus });
}

export async function updateEditorProfile(editorId: string, data: Partial<Editor>): Promise<void> {
  await updateDoc(doc(db, 'editors', editorId), data);
}

export async function rateEditor(editorId: string, rating: number): Promise<void> {
  const editorRef = doc(db, 'editors', editorId);
  const snap = await getDoc(editorRef);
  if (snap.exists()) {
    const data = snap.data();
    const sum = (data.ratingSum || 0) + rating;
    const count = (data.ratingCount || 0) + 1;
    await updateDoc(editorRef, { ratingSum: sum, ratingCount: count });
  }
}

export async function addSlots(editorId: string, slotsToAdd: number, packageName: string, amountPaid: number): Promise<void> {
  // 1. Get current editor
  const editorDoc = await getDoc(doc(db, 'editors', editorId));
  if (!editorDoc.exists()) throw new Error('Editor not found');
  const currentMax = editorDoc.data().maxUploads || 0;

  // 2. Update maxUploads
  await updateDoc(doc(db, 'editors', editorId), { maxUploads: currentMax + slotsToAdd });

  // 3. Log the transaction
  const txnRef = doc(collection(db, 'transactions'));
  await setDoc(txnRef, {
    editorId,
    packageName,
    slotsAdded: slotsToAdd,
    amountPaid,
    createdAt: Date.now(),
    status: 'completed',
  });
}

export async function getTransactions(editorId: string): Promise<any[]> {
  try {
    const q = query(collection(db, 'transactions'), where('editorId', '==', editorId));
    const snapshot = await getDocs(q);
    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return results.sort((a: any, b: any) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

// ── REVIEWS ──

export async function getApprovedReviews(): Promise<Review[]> {
  try {
    const q = query(collection(db, 'reviews'), where('approved', '==', true));
    const snapshot = await getDocs(q);
    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
    return results.sort((a, b) => b.createdAt - a.createdAt).slice(0, 10);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export async function addReview(review: { name: string; rating: number; text: string }): Promise<void> {
  const newRef = doc(collection(db, 'reviews'));
  await setDoc(newRef, {
    ...review,
    approved: false,
    createdAt: Date.now(),
  });
}

export async function getAllReviews(): Promise<Review[]> {
  try {
    const snapshot = await getDocs(collection(db, 'reviews'));
    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
    return results.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export async function approveReview(reviewId: string, approved: boolean): Promise<void> {
  await updateDoc(doc(db, 'reviews', reviewId), { approved });
}

export async function deleteReview(reviewId: string): Promise<void> {
  await deleteDoc(doc(db, 'reviews', reviewId));
}

export async function deleteAllReviews(): Promise<number> {
  const snapshot = await getDocs(collection(db, 'reviews'));
  const count = snapshot.size;
  const promises = snapshot.docs.map(d => deleteDoc(doc(db, 'reviews', d.id)));
  await Promise.all(promises);
  return count;
}

// ── CDN TRACKER ──

export async function getCDNAccounts(): Promise<CDNAccount[]> {
  try {
    const q = query(collection(db, 'cdnAccounts'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CDNAccount));
  } catch (error) {
    console.error("Error fetching CDN accounts:", error);
    return [];
  }
}

// ── SITE SETTINGS ──

export async function getSiteSettings(): Promise<any> {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'global'));
    if (!docSnap.exists()) return { maintenanceMode: false, heroText: 'Valorant Image Design Studio' };
    return docSnap.data();
  } catch (error) {
    return { maintenanceMode: false, heroText: 'Valorant Image Design Studio' };
  }
}

export async function updateSiteSettings(data: any): Promise<void> {
  await setDoc(doc(db, 'settings', 'global'), data, { merge: true });
}

// ── STORE LINKS ──

export async function getAllStoreLinks(): Promise<StoreLink[]> {
  try {
    const snapshot = await getDocs(collection(db, 'storeLinks'));
    const links = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as StoreLink));
    return links.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (error) {
    console.error("Error fetching store links:", error);
    return [];
  }
}

export async function addStoreLink(link: Omit<StoreLink, 'id' | 'createdAt'>): Promise<string> {
  const newRef = doc(collection(db, 'storeLinks'));
  await setDoc(newRef, {
    ...link,
    id: newRef.id,
    createdAt: Date.now(),
  });
  return newRef.id;
}

export async function updateStoreLink(id: string, data: Partial<StoreLink>): Promise<void> {
  await updateDoc(doc(db, 'storeLinks', id), data);
}

export async function deleteStoreLink(id: string): Promise<void> {
  await deleteDoc(doc(db, 'storeLinks', id));
}
