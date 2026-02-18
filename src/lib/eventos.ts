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
    Timestamp,
    limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Evento, CreateEventoData, UpdateEventoData } from '@/types/evento';

const COLLECTION_NAME = 'events';

/**
 * Criar um novo evento
 */
export async function createEvento(data: CreateEventoData): Promise<string> {
    const now = Timestamp.now();

    // Gerar slug a partir do título
    const slug = data.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();

    const eventoData = {
        ...data,
        slug,
        currentParticipants: 0,
        createdAt: now,
        updatedAt: now,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), eventoData);
    return docRef.id;
}

/**
 * Listar todos os eventos (mais recentes primeiro)
 */
export async function getEventos(maxLimit?: number): Promise<Evento[]> {
    let q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));

    if (maxLimit) {
        q = query(q, limit(maxLimit));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Evento));
}

/**
 * Atualizar um evento existente
 */
export async function updateEvento(id: string, data: UpdateEventoData): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
    });
}

/**
 * Deletar um evento
 */
export async function deleteEvento(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
}

/**
 * Buscar evento por ID
 */
export async function getEventoById(id: string): Promise<Evento | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Evento;
    }

    return null;
}
