import { Timestamp } from 'firebase/firestore';

export type ServiceCategory =
    | 'supervisao'
    | 'atendimento'
    | 'grupos'
    | 'aulas'
    | 'cursos-palestras';

export interface Service {
    id: string;
    title: string;
    description: string;
    category: ServiceCategory;
    dateInfo?: string; // Ex: "Toda terça às 19h" ou "Início em 10/03"
    price?: string;
    status: 'draft' | 'public';
    order: number;
    withOphicina: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface CreateServiceData extends Omit<Service, 'id' | 'createdAt' | 'updatedAt'> { }
export interface UpdateServiceData extends Partial<CreateServiceData> { }
