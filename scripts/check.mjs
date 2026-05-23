import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

// Initialize Firebase with the config from your env
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const q = query(collection(db, 'editors'));
  const snapshot = await getDocs(q);
  const editors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const vaibhav = editors.find(e => e.isAdmin || e.email === 'vaibhavpatilpro@gmail.com' || e.name?.toLowerCase() === 'vaibhav' || e.name?.toLowerCase() === 'va1bhav');
  
  console.log("Vaibhav Editor ID:", vaibhav?.id);
  console.log("Vaibhav Name:", vaibhav?.name);
  
  if (vaibhav) {
    const q2 = query(collection(db, 'conversations'), where('participants', 'array-contains', vaibhav.id));
    const convos = await getDocs(q2);
    console.log("Conversations found for editor ID:", convos.size);
    convos.forEach(c => console.log(c.id, c.data().participants, c.data().lastMessage));
    
    const q3 = query(collection(db, 'conversations'), where('participants', 'array-contains', 'admin'));
    const adminConvos = await getDocs(q3);
    console.log("Conversations found for 'admin':", adminConvos.size);
    adminConvos.forEach(c => console.log(c.id, c.data().participants, c.data().lastMessage));
  }
}

check().then(() => process.exit(0)).catch(console.error);
