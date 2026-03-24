'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Timestamp } from 'firebase/firestore';
import { createPost, updatePost, getPostById, generateSlug } from '@/lib/blog';
import type { BlogPost } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ImageUpload } from '@/components/image-upload';
import { RichTextEditor } from '@/components/rich-text-editor';
import { SEOFields } from '@/components/seo-fields';
import { ArrowLeft, Save, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

export default function BlogFormPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuth();
    const isEditing = !!params?.id;
    const postId = params?.id as string;

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [coverImageAlt, setCoverImageAlt] = useState('');
    const [categories, setCategories] = useState('');
    const [tags, setTags] = useState('');
    const [isPinned, setIsPinned] = useState(false);
    const [status, setStatus] = useState<'draft' | 'published'>('draft');

    // SEO
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');

    // Carregar post se estiver editando
    useEffect(() => {
        if (isEditing) {
            loadPost();
        }
    }, [isEditing, postId]);

    // Auto-gerar slug quando título mudar
    useEffect(() => {
        if (!isEditing && title && !slug) {
            setSlug(generateSlug(title));
        }
    }, [title, isEditing]);

    // Auto-gerar meta title se estiver vazio
    useEffect(() => {
        if (title && !metaTitle) {
            setMetaTitle(title);
        }
    }, [title]);

    const loadPost = async () => {
        try {
            setLoading(true);
            const post = await getPostById(postId);

            if (!post) {
                router.push('/admin/blog');
                return;
            }

            setTitle(post.title);
            setSlug(post.slug);
            setContent(post.content);
            setExcerpt(post.excerpt);
            setCoverImage(post.coverImage);
            setCoverImageAlt(post.coverImageAlt);
            setCategories(post.categories.join(', '));
            setTags(post.tags.join(', '));
            setIsPinned(post.isPinned);
            setStatus(post.status);
            setMetaTitle(post.metaTitle);
            setMetaDescription(post.metaDescription);
        } catch (error) {
            console.error('Erro ao carregar post:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (publishNow: boolean = false) => {
        if (!title || !content) {
            alert('Por favor, preencha o título e o conteúdo do post');
            return;
        }

        if (publishNow && !coverImage) {
            alert('Por favor, adicione uma imagem de capa antes de publicar');
            return;
        }

        if (publishNow && (!metaTitle || !metaDescription)) {
            alert('Por favor, preencha os campos de SEO antes de publicar');
            return;
        }

        try {
            setSaving(true);

            const postData = {
                title,
                slug: slug || generateSlug(title),
                content,
                excerpt: excerpt || content.substring(0, 160).replace(/<[^>]*>/g, ''),
                coverImage: coverImage || '',
                coverImageAlt: coverImageAlt || '',
                author: user?.displayName || user?.email || 'Admin',
                publishedAt: publishNow ? Timestamp.now() : null,
                status: publishNow ? 'published' as const : 'draft' as const,
                categories: categories
                    .split(',')
                    .map((c) => c.trim())
                    .filter((c) => c),
                tags: tags
                    .split(',')
                    .map((t) => t.trim())
                    .filter((t) => t),
                isPinned,
                order: 0,
                metaTitle: metaTitle || title,
                metaDescription: metaDescription || '',
            };

            if (isEditing) {
                await updatePost(postId, postData);
            } else {
                await createPost(postData);
            }

            router.push('/admin/blog');
        } catch (error) {
            console.error('Erro ao salvar post:', error);
            alert('Erro ao salvar post. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/blog">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-3xl font-heading font-bold">
                            {isEditing ? 'Editar Post' : 'Novo Post'}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEditing ? 'Atualize o conteúdo do post' : 'Crie um novo post para o blog'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleSave(false)}
                        disabled={saving}
                    >
                        {saving ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Salvar Rascunho
                    </Button>
                    <Button onClick={() => handleSave(true)} disabled={saving}>
                        {saving ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Eye className="h-4 w-4 mr-2" />
                        )}
                        Publicar
                    </Button>
                </div>
            </div>

            <Separator />

            {/* Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Título */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Título do Post *</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Digite um título atrativo para o post"
                            required
                            className="text-lg"
                        />
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                        <Label htmlFor="slug">
                            URL (Slug)
                            <span className="text-xs text-muted-foreground ml-2">
                                Gerado automaticamente
                            </span>
                        </Label>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                                /blog/
                            </Badge>
                            <Input
                                id="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                placeholder="url-do-post"
                            />
                        </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="space-y-2">
                        <Label>Conteúdo do Post *</Label>
                        <RichTextEditor
                            content={content}
                            onChange={setContent}
                            placeholder="Escreva o conteúdo do post usando o editor..."
                        />
                    </div>

                    {/* Excerpt (Resumo) */}
                    <div className="space-y-2">
                        <Label htmlFor="excerpt">
                            Resumo (Excerpt)
                            <span className="text-xs text-muted-foreground ml-2">
                                Opcional - extraído automaticamente do conteúdo
                            </span>
                        </Label>
                        <Textarea
                            id="excerpt"
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Breve resumo do post (150-160 caracteres)"
                            rows={3}
                        />
                    </div>

                    {/* SEO Fields */}
                    <SEOFields
                        metaTitle={metaTitle}
                        metaDescription={metaDescription}
                        slug={slug}
                        onMetaTitleChange={setMetaTitle}
                        onMetaDescriptionChange={setMetaDescription}
                        onSlugChange={setSlug}
                    />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status */}
                    <div className="p-4 border border-border rounded-lg bg-card space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Status</h3>
                            <Badge variant={status === 'published' ? 'default' : 'secondary'}>
                                {status === 'published' ? 'Publicado' : 'Rascunho'}
                            </Badge>
                        </div>

                        {/* Fixar Post */}
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="pin" className="cursor-pointer">
                                    Fixar este post
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Aparecerá no topo da lista
                                </p>
                            </div>
                            <Switch
                                id="pin"
                                checked={isPinned}
                                onCheckedChange={setIsPinned}
                            />
                        </div>
                    </div>

                    {/* Imagem de Capa */}
                    <div className="space-y-2">
                        <Label>
                            Imagem de Capa
                            <span className="text-xs text-muted-foreground ml-2">
                                Obrigatória para publicar
                            </span>
                        </Label>
                        <ImageUpload
                            value={coverImage}
                            onChange={(url, alt) => {
                                setCoverImage(url);
                                setCoverImageAlt(alt);
                            }}
                            onRemove={() => {
                                setCoverImage('');
                                setCoverImageAlt('');
                            }}
                            storagePath="posts"
                            altText={coverImageAlt}
                            onAltTextChange={setCoverImageAlt}
                        />
                    </div>

                    {/* Categorias */}
                    <div className="space-y-2">
                        <Label htmlFor="categories">
                            Categorias
                            <span className="text-xs text-muted-foreground ml-2">
                                Separadas por vírgula
                            </span>
                        </Label>
                        <Input
                            id="categories"
                            value={categories}
                            onChange={(e) => setCategories(e.target.value)}
                            placeholder="Terapia, Ansiedade, Mindfulness"
                        />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label htmlFor="tags">
                            Tags
                            <span className="text-xs text-muted-foreground ml-2">
                                Separadas por vírgula
                            </span>
                        </Label>
                        <Input
                            id="tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="saúde mental, bem-estar, autoconhecimento"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}