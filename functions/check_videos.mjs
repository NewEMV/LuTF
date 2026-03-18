import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp({ projectId: 'lucianatf-8395f' });
const db = getFirestore(app);

const snap = await db.collection('videos').get();
snap.docs.forEach(doc => {
  const d = doc.data();
  const problems = [];
  ['title','description','category','youtubeUrl','youtubeId','thumbnail'].forEach(field => {
    if (d[field] === undefined || d[field] === null) problems.push(field + '=MISSING');
  });
  console.log(`DOC ${doc.id}: ${problems.length > 0 ? problems.join(', ') : 'OK'}`);
});
process.exit(0);
