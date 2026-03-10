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
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { GaleriaAlbum, GaleriaImage, CreateAlbumData, UpdateAlbumData, CreateImageData } from '@/types/galeria';

const ALBUMS_COLLECTION = 'galeria_albums';
const IMAGES_COLLECTION = 'galeria_images';

export async function getAlbums(): Promise<GaleriaAlbum[]> {
    const q = query(collection(db, ALBUMS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as GaleriaAlbum));
}

export async function getImagesByAlbum(albumId: string): Promise<GaleriaImage[]> {
    const q = query(
        collection(db, IMAGES_COLLECTION),
        where('albumId', '==', albumId),
        orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as GaleriaImage));
}

export async function createAlbum(data: CreateAlbumData): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, ALBUMS_COLLECTION), {
        ...data,
        createdAt: now,
        updatedAt: now
    });
    return docRef.id;
}

export async function updateAlbum(id: string, data: Partial<GaleriaAlbum>): Promise<void> {
    const docRef = doc(db, ALBUMS_COLLECTION, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
    });
}

export async function deleteAlbum(id: string): Promise<void> {
    await deleteDoc(doc(db, ALBUMS_COLLECTION, id));
}

/**
 * Upload de imagem para o Firebase Storage
 */
export async function uploadImage(file: File, albumId: string): Promise<string> {
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;
    const storageRef = ref(storage, `galeria/${albumId}/${filename}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
}

/**
 * Adiciona o registro da imagem no Firestore após o upload
 */
export async function addImageToGallery(data: CreateImageData): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, IMAGES_COLLECTION), {
        ...data,
        createdAt: now
    });
    return docRef.id;
}

/**
 * @deprecated use addImageToGallery
 */
export async function addImageToAlbum(data: CreateImageData): Promise<string> {
    return addImageToGallery(data);
}

/**
 * Exclui imagem do Firestore e do Firebase Storage
 */
export async function deleteImage(id: string, imageUrl?: string): Promise<void> {
    // Apagar do Firestore
    await deleteDoc(doc(db, IMAGES_COLLECTION, id));

    // Apagar do Storage (se a URL for do Firebase Storage)
    if (imageUrl && imageUrl.includes('firebasestorage.googleapis.com')) {
        try {
            const storageRef = ref(storage, imageUrl);
            await deleteObject(storageRef);
        } catch (e) {
            console.warn('Não foi possível remover do Storage:', e);
        }
    }
}
