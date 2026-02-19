import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { TrajectoryItem, CreateTrajectoryData, UpdateTrajectoryData } from '@/types/trajectory';

const COLLECTION_NAME = 'trajectory';

export async function getTrajectory(): Promise<TrajectoryItem[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as TrajectoryItem));
}

export async function createTrajectoryItem(data: CreateTrajectoryData): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        createdAt: now,
        updatedAt: now
    });
    return docRef.id;
}

export async function updateTrajectoryItem(id: string, data: UpdateTrajectoryData): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
    });
}

export async function deleteTrajectoryItem(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
}
