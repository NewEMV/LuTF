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
    Timestamp,
    writeBatch,
    limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Service, CreateServiceData, UpdateServiceData } from '@/types/service';

const COLLECTION_NAME = 'services';

/**
 * Cria os rascunhos iniciais de serviços para facilitar o setup
 */
export async function seedServices() {
    const servicesRef = collection(db, COLLECTION_NAME);
    const q = query(servicesRef, limit(1));
    const snapshot = await getDocs(q);

    // Só cria se a coleção estiver vazia
    if (snapshot.empty) {
        const batch = writeBatch(db);
        const now = Timestamp.now();

        const defaultServices: CreateServiceData[] = [
            {
                title: 'Supervisão Clínica',
                description: 'Suporte técnico e ético para psicólogos que buscam aprimoramento em psico-oncologia e luto.',
                category: 'supervisao',
                status: 'draft',
                order: 0,
                withOphicina: false
            },
            {
                title: 'Atendimento Individual',
                description: 'Psicoterapia focada em adultos lidando com diagnósticos de câncer, perdas e transições de vida.',
                category: 'atendimento',
                status: 'draft',
                order: 1,
                withOphicina: false
            },
            {
                title: 'Grupos Terapêuticos',
                description: 'Espaço de fala e acolhimento compartilhado para pacientes e cuidadores.',
                category: 'grupos',
                status: 'draft',
                order: 2,
                withOphicina: false
            },
            {
                title: 'Aulas Abertas',
                description: 'Encontros temáticos sobre saúde emocional e finitude.',
                category: 'aulas',
                status: 'draft',
                order: 3,
                withOphicina: true
            },
            {
                title: 'Cursos e Palestras',
                description: 'Treinamentos especializados para instituições de saúde e eventos corporativos.',
                category: 'cursos-palestras',
                status: 'draft',
                order: 4,
                withOphicina: true
            }
        ];

        defaultServices.forEach((service) => {
            const newDocRef = doc(servicesRef);
            batch.set(newDocRef, {
                ...service,
                createdAt: now,
                updatedAt: now
            });
        });

        await batch.commit();
        return true;
    }
    return false;
}

export async function getServices(showAll = false): Promise<Service[]> {
    let q;
    if (showAll) {
        q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
    } else {
        q = query(
            collection(db, COLLECTION_NAME),
            where('status', '==', 'public'),
            orderBy('order', 'asc')
        );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Service));
}

export async function getServiceById(id: string): Promise<Service | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Service;
    }
    return null;
}

export async function createService(data: CreateServiceData): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        createdAt: now,
        updatedAt: now
    });
    return docRef.id;
}

export async function updateService(id: string, data: UpdateServiceData): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
    });
}

export async function deleteService(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
}
