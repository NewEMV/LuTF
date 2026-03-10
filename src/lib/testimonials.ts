import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    orderBy,
    where,
    Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Testimonial, CreateTestimonialData, UpdateTestimonialData } from '@/types/testimonial';

const COLLECTION_NAME = 'testimonials';

export async function getTestimonials(showAll = false): Promise<Testimonial[]> {
    let q;
    if (showAll) {
        q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
    } else {
        q = query(
            collection(db, COLLECTION_NAME),
            where('status', '==', 'published'),
            orderBy('order', 'asc')
        );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Testimonial));
}

export async function createTestimonial(data: CreateTestimonialData): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        createdAt: now,
        updatedAt: now
    });
    return docRef.id;
}

export async function updateTestimonial(id: string, data: UpdateTestimonialData): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
    });
}

export async function deleteTestimonial(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
}
