import { Timestamp } from 'firebase/firestore';

export interface Video {
    id: string;
    title: string;
    description: string;
    youtubeUrl: string;
    youtubeId: string; // Extraído da URL
    thumbnail: string; // Extraído automaticamente do YouTube
    category: string;
    isPinned: boolean; // Vídeo fixado no topo
    order: number; // Ordem manual de exibição
    publishedAt: Timestamp;
    createdAt: Timestamp;
    // SEO
    metaTitle: string;
    metaDescription: string;
    customCover?: string; // Capa personalizada opcional
}

export interface CreateVideoData extends Omit<Video, 'id' | 'createdAt' | 'youtubeId' | 'thumbnail' | 'customCover'> {
    youtubeUrl: string;
    customCover?: string;
}
export interface UpdateVideoData extends Partial<CreateVideoData> { }
