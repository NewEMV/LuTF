import { Timestamp } from 'firebase/firestore';

export interface Evento {
    id: string;
    title: string;
    slug: string;
    description: string;
    coverImage: string;
    coverImageAlt: string;
    date: Timestamp;
    time: string;
    location: string;
    locationDetails: string;
    maxParticipants?: number;
    currentParticipants: number;
    registrationOpen: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    metaTitle: string;
    metaDescription: string;
}

export interface CreateEventoData extends Omit<Evento, 'id' | 'createdAt' | 'updatedAt' | 'currentParticipants'> { }
export interface UpdateEventoData extends Partial<CreateEventoData> {
    updatedAt: Timestamp;
}
