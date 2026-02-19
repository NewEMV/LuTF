import { Timestamp } from 'firebase/firestore';

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    status: 'draft' | 'published';
    order: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface CreateTestimonialData extends Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'> { }
export interface UpdateTestimonialData extends Partial<CreateTestimonialData> { }
