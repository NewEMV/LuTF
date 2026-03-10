import { Timestamp } from 'firebase/firestore';

export interface FutureEvent {
    id: string;
    title: string;
    description: string;
    date: Timestamp;
    location: string;
    link?: string;
    status: 'draft' | 'published';
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface CreateFutureEventData extends Omit<FutureEvent, 'id' | 'createdAt' | 'updatedAt'> { }
export interface UpdateFutureEventData extends Partial<CreateFutureEventData> { }
