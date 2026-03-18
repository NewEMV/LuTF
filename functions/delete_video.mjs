import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp({ projectId: 'lucianatf-8395f' });
const db = getFirestore(app);

await db.collection('videos').doc('kVqjCwLacuGEQNEKQChz').delete();
console.log('Documento deletado com sucesso!');
process.exit(0);
