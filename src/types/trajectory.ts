import { Timestamp } from 'firebase/firestore';

export interface TrajectoryItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    order: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface CreateTrajectoryData extends Omit<TrajectoryItem, 'id' | 'createdAt' | 'updatedAt'> { }
export interface UpdateTrajectoryData extends Partial<CreateTrajectoryData> { }
