import { Timestamp } from 'firebase/firestore';
export interface Video {
    id: string;
    title: string;
    description: string;
    youtubeUrl: string;
    youtubeId: string; // Extraído da URL
    thumbnail: string; // Extraído automaticamente do YouTube
    customCover?: string; // Imagem de capa personalizada (substitui o thumbnail)
    category: string;
    isPinned: boolean; // Vídeo fixado no topo
    order: number; // Ordem manual de exibição
    publishedAt: Timestamp;
    createdAt: Timestamp;
    // SEO
    metaTitle: string;
    metaDescription: string;
}
export interface CreateVideoData extends Omit<Video, 'id' | 'createdAt' | 'youtubeId' | 'thumbnail'> {
    youtubeUrl: string;
}
export interface UpdateVideoData extends Partial<CreateVideoData> { }