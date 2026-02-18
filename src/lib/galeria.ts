import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp,
    writeBatch,
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type {
    GaleriaAlbum,
    GaleriaImage,
    CreateAlbumData,
    UpdateAlbumData,
    CreateImageData
} from '@/types/galeria';

const ALBUMS_COLLECTION = 'albums';
const IMAGES_COLLECTION = 'gallery_images';

/**
 * Gera um slug a partir do nome
 */
export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/--+/g, '-') // Remove hífens duplicados
        .trim();
}

/**
 * ÁLBUNS
 */

export async function createAlbum(data: Omit<CreateAlbumData, 'slug'>): Promise<string> {
    const now = Timestamp.now();
    const slug = generateSlug(data.name);

    const albumData = {
        ...data,
        slug,
        createdAt: now,
        updatedAt: now,
    };

    const docRef = await addDoc(collection(db, ALBUMS_COLLECTION), albumData);
    return docRef.id;
}

export async function getAlbums(): Promise<GaleriaAlbum[]> {
    const q = query(collection(db, ALBUMS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as GaleriaAlbum));
}

export async function updateAlbum(id: string, data: UpdateAlbumData): Promise<void> {
    const docRef = doc(db, ALBUMS_COLLECTION, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
    });
}

export async function deleteAlbum(id: string): Promise<void> {
    // 1. Deletar todas as imagens do álbum no Firestore e Storage
    const images = await getImagesByAlbum(id);
    for (const image of images) {
        await deleteImage(image.id, image.url);
    }

    // 2. Deletar o álbum
    await deleteDoc(doc(db, ALBUMS_COLLECTION, id));
}

/**
 * IMAGENS
 */

export async function uploadImage(file: File, albumId: string): Promise<string> {
    const storageRef = ref(storage, `gallery/${albumId}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
}

export async function addImageToGallery(data: CreateImageData): Promise<string> {
    const imageData = {
        ...data,
        createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, IMAGES_COLLECTION), imageData);
    return docRef.id;
}

export async function getImagesByAlbum(albumId: string): Promise<GaleriaImage[]> {
    const q = query(
        collection(db, IMAGES_COLLECTION),
        where('albumId', '==', albumId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as GaleriaImage));
}

export async function deleteImage(imageId: string, imageUrl: string): Promise<void> {
    // 1. Deletar arquivo do Storage
    try {
        const decodedUrl = decodeURIComponent(imageUrl.split('/o/')[1].split('?')[0]);
        const storageRef = ref(storage, decodedUrl);
        await deleteObject(storageRef);
    } catch (error) {
        console.error('Erro ao deletar arquivo do Storage:', error);
    }

    // 2. Deletar documento do Firestore
    await deleteDoc(doc(db, IMAGES_COLLECTION, imageId));
}

export async function reorderImages(imageIds: string[]): Promise<void> {
    const batch = writeBatch(db);
    imageIds.forEach((id, index) => {
        const docRef = doc(db, IMAGES_COLLECTION, id);
        batch.update(docRef, { order: index });
    });
    await batch.commit();
}
