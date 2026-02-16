import { Timestamp } from 'firebase/firestore';

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string; // HTML do editor
    excerpt: string;
    coverImage: string; // URL do Firebase Storage
    coverImageAlt: string;
    author: string;
    publishedAt: Timestamp | null;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    status: 'draft' | 'published';
    categories: string[];
    tags: string[];
    isPinned: boolean; // Post fixado no topo
    order: number; // Ordem manual de exibição
    // SEO
    metaTitle: string;
    metaDescription: string;
    canonicalUrl?: string;
}

export interface CreateBlogPostData extends Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'> { }
export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {
    updatedAt: Timestamp;
}
