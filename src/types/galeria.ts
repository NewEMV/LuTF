import { Timestamp } from 'firebase/firestore';

export interface GaleriaAlbum {
    id: string;
    name: string;
    slug: string;
    coverImage: string;
    description: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface GaleriaImage {
    id: string;
    albumId: string;
    url: string;
    alt: string;
    caption: string;
    order: number;
    createdAt: Timestamp;
}

export interface CreateAlbumData extends Omit<GaleriaAlbum, 'id' | 'createdAt' | 'updatedAt'> { }
export interface UpdateAlbumData extends Partial<CreateAlbumData> {
    updatedAt: Timestamp;
}

export interface CreateImageData extends Omit<GaleriaImage, 'id' | 'createdAt'> { }
