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
    Timestamp,
    writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Video, CreateVideoData, UpdateVideoData } from '@/types/video';

const COLLECTION_NAME = 'videos';

/**
 * Extrair ID do YouTube de várias formatações de URL
 */
export function extractYouTubeId(url: string): string | null {
    // Padrões de URL do YouTube
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/, // ID direto
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

/**
 * Gerar URL do thumbnail do YouTube
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'hq' | 'sd' | 'maxres' = 'hq'): string {
    const qualityMap = {
        default: 'default',
        hq: 'hqdefault',
        sd: 'sddefault',
        maxres: 'maxresdefault',
    };

    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Criar um novo vídeo
 */
export async function createVideo(data: CreateVideoData): Promise<string> {
    const youtubeId = extractYouTubeId(data.youtubeUrl);

    if (!youtubeId) {
        throw new Error('URL do YouTube inválida');
    }

    const thumbnail = getYouTubeThumbnail(youtubeId);
    const now = Timestamp.now();

    const videoData: Omit<Video, 'id'> = {
        ...data,
        youtubeId,
        thumbnail,
        createdAt: now,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), videoData);
    return docRef.id;
}

/**
 * Atualizar um vídeo existente
 */
export async function updateVideo(id: string, data: UpdateVideoData): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);

    // Se a URL mudou, atualizar ID e thumbnail
    if (data.youtubeUrl) {
        const youtubeId = extractYouTubeId(data.youtubeUrl);
        if (!youtubeId) {
            throw new Error('URL do YouTube inválida');
        }

        const thumbnail = getYouTubeThumbnail(youtubeId);
        await updateDoc(docRef, {
            ...data,
            youtubeId,
            thumbnail,
        });
    } else {
        await updateDoc(docRef, data);
    }
}

/**
 * Deletar um vídeo
 */
export async function deleteVideo(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
}

/**
 * Buscar vídeo por ID
 */
export async function getVideoById(id: string): Promise<Video | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Video;
    }

    return null;
}

/**
 * Listar vídeos com filtros
 * Ordenação: fixados primeiro, depois por order, depois por data
 */
export async function getVideos(filters?: {
    category?: string;
    limit?: number;
}): Promise<Video[]> {
    let q = query(collection(db, COLLECTION_NAME));

    // Aplicar filtros
    if (filters?.category) {
        q = query(q, where('category', '==', filters.category));
    }

    const querySnapshot = await getDocs(q);
    const videos: Video[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Video[];

    // Ordenar: fixados primeiro, depois por order, depois por data
    videos.sort((a, b) => {
        // Fixados primeiro
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        // Se ambos fixados ou ambos não fixados, ordenar por order
        if (a.order !== b.order) {
            return a.order - b.order;
        }

        // Se order igual, ordenar por data (mais recente primeiro)
        return b.publishedAt.seconds - a.publishedAt.seconds;
    });

    // Aplicar limit se especificado
    if (filters?.limit) {
        return videos.slice(0, filters.limit);
    }

    return videos;
}

/**
 * Fixar/desafixar vídeo
 */
export async function togglePinVideo(id: string, isPinned: boolean): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { isPinned });
}

/**
 * Reordenar vídeos após drag & drop
 * Recebe array de IDs na nova ordem
 */
export async function reorderVideos(videoIds: string[]): Promise<void> {
    const batch = writeBatch(db);

    videoIds.forEach((id, index) => {
        const docRef = doc(db, COLLECTION_NAME, id);
        batch.update(docRef, { order: index });
    });

    await batch.commit();
}

/**
 * Buscar categorias únicas de todos os vídeos
 */
export async function getVideoCategories(): Promise<string[]> {
    const videos = await getVideos();
    const categoriesSet = new Set<string>();

    videos.forEach((video) => {
        if (video.category) categoriesSet.add(video.category);
    });

    return Array.from(categoriesSet).sort();
}
