import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    orderBy,
    where,
    Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { FutureEvent, CreateFutureEventData, UpdateFutureEventData } from '@/types/future-event';

const COLLECTION_NAME = 'future_events';

export async function getFutureEvents(showAll = false): Promise<FutureEvent[]> {
    let q;
    const now = Timestamp.now();

    if (showAll) {
        q = query(collection(db, COLLECTION_NAME), orderBy('date', 'asc'));
    } else {
        q = query(
            collection(db, COLLECTION_NAME),
            where('status', '==', 'published'),
            where('date', '>=', now),
            orderBy('date', 'asc')
        );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as FutureEvent));
}

export async function createFutureEvent(data: CreateFutureEventData): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        createdAt: now,
        updatedAt: now
    });
    return docRef.id;
}

export async function updateFutureEvent(id: string, data: UpdateFutureEventData): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
    });
}

export async function deleteFutureEvent(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
}
