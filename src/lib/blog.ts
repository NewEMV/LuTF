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
    orderBy,
    Timestamp,
    writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BlogPost, CreateBlogPostData, UpdateBlogPostData } from '@/types/blog';

const COLLECTION_NAME = 'posts';

/**
 * Gera um slug a partir do título
 */
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/--+/g, '-') // Remove hífens duplicados
        .trim();
}

/**
 * Criar um novo post
 */
export async function createPost(data: CreateBlogPostData): Promise<string> {
    const now = Timestamp.now();

    const postData: Omit<BlogPost, 'id'> = {
        ...data,
        createdAt: now,
        updatedAt: now,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), postData);
    return docRef.id;
}

/**
 * Atualizar um post existente
 */
export async function updatePost(id: string, data: UpdateBlogPostData): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
    });
}

/**
 * Deletar um post
 */
export async function deletePost(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
}

/**
 * Buscar post por ID
 */
export async function getPostById(id: string): Promise<BlogPost | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as BlogPost;
    }

    return null;
}

/**
 * Buscar post por slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    const q = query(
        collection(db, COLLECTION_NAME),
        where('slug', '==', slug),
        where('status', '==', 'published')
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as BlogPost;
    }

    return null;
}

/**
 * Listar posts com filtros
 * Ordenação: fixados primeiro, depois por order, depois por data
 */
export async function getPosts(filters?: {
    status?: 'draft' | 'published';
    category?: string;
    limit?: number;
}): Promise<BlogPost[]> {
    let q = query(collection(db, COLLECTION_NAME));

    // Aplicar filtros
    if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
    }

    if (filters?.category) {
        q = query(q, where('categories', 'array-contains', filters.category));
    }

    const querySnapshot = await getDocs(q);
    const posts: BlogPost[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as BlogPost[];

    // Ordenar: fixados primeiro, depois por order, depois por data
    posts.sort((a, b) => {
        // Fixados primeiro
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        // Se ambos fixados ou ambos não fixados, ordenar por order
        if (a.order !== b.order) {
            return a.order - b.order;
        }

        // Se order igual, ordenar por data (mais recente primeiro)
        const dateA = a.publishedAt || a.createdAt;
        const dateB = b.publishedAt || b.createdAt;
        return dateB.seconds - dateA.seconds;
    });

    // Aplicar limit se especificado
    if (filters?.limit) {
        return posts.slice(0, filters.limit);
    }

    return posts;
}

/**
 * Fixar/desafixar post
 */
export async function togglePinPost(id: string, isPinned: boolean): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
        isPinned,
        updatedAt: Timestamp.now(),
    });
}

/**
 * Reordenar posts após drag & drop
 * Recebe array de IDs na nova ordem
 */
export async function reorderPosts(postIds: string[]): Promise<void> {
    const batch = writeBatch(db);

    postIds.forEach((id, index) => {
        const docRef = doc(db, COLLECTION_NAME, id);
        batch.update(docRef, { order: index });
    });

    await batch.commit();
}

/**
 * Buscar posts publicados (para o site público)
 */
export async function getPublishedPosts(limit?: number): Promise<BlogPost[]> {
    return getPosts({ status: 'published', limit });
}

/**
 * Buscar categorias únicas de todos os posts
 */
export async function getCategories(): Promise<string[]> {
    const posts = await getPosts();
    const categoriesSet = new Set<string>();

    posts.forEach((post) => {
        post.categories.forEach((cat) => categoriesSet.add(cat));
    });

    return Array.from(categoriesSet).sort();
}
