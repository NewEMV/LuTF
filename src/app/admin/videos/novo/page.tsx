'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { createVideo, updateVideo, getVideoById, extractYouTubeId } from '@/lib/videos';
import type { Video } from '@/types/video';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { SEOFields } from '@/components/seo-fields';
import { ArrowLeft, Save, Loader2, Youtube, Image as ImageIcon, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function VideoFormPage() {
    const router = useRouter();
    const params = useParams();
    const isEditing = !!params?.id;
    const videoId = params?.id as string;

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [isPinned, setIsPinned] = useState(false);
    const [customCover, setCustomCover] = useState('');
    const [uploadingCover, setUploadingCover] = useState(false);

    // SEO
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');

    // Preview
    const [previewId, setPreviewId] = useState<string | null>(null);

    useEffect(() => {
        if (isEditing) {
            loadVideo();
        }
    }, [isEditing, videoId]);

    useEffect(() => {
        if (youtubeUrl) {
            const id = extractYouTubeId(youtubeUrl);
            setPreviewId(id);
        } else {
            setPreviewId(null);
        }
    }, [youtubeUrl]);

    useEffect(() => {
        if (title && !metaTitle) {
            setMetaTitle(title);
        }
    }, [title]);

    const loadVideo = async () => {
        try {
            setLoading(true);
            const video = await getVideoById(videoId);

            if (!video) {
                router.push('/admin/videos');
                return;
            }

            setYoutubeUrl(video.youtubeUrl);
            setTitle(video.title);
            setDescription(video.description);
            setCategory(video.category);
            setIsPinned(video.isPinned);
            setMetaTitle(video.metaTitle);
            setMetaDescription(video.metaDescription);
            setCustomCover(video.customCover || '');
        } catch (error) {
            console.error('Erro ao carregar vídeo:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingCover(true);
        try {
            const timestamp = Date.now();
            const filename = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;
            const storageRef = ref(storage, `video-covers/${filename}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setCustomCover(url);
        } catch (error) {
            console.error('Erro ao fazer upload da capa:', error);
            alert('Erro ao fazer upload da imagem. Tente novamente.');
        } finally {
            setUploadingCover(false);
        }
    };

    const handleSave = async () => {
        if (!youtubeUrl || !title || !category) {
            alert('Por favor, preencha todos os campos obrigatórios');
            return;
        }

        if (!metaTitle || !metaDescription) {
            alert('Por favor, preencha os campos de SEO');
            return;
        }

        const ytId = extractYouTubeId(youtubeUrl);
        if (!ytId) {
            alert('URL do YouTube inválida');
            return;
        }

        try {
            setSaving(true);

            const videoData = {
                youtubeUrl,
                title,
                description,
                category,
                isPinned,
                order: 0,
                publishedAt: Timestamp.now(),
                metaTitle,
                metaDescription,
                ...(customCover ? { customCover } : {}),
            };

            if (isEditing) {
                await updateVideo(videoId, videoData);
            } else {
                await createVideo(videoData);
            }

            router.push('/admin/videos');
        } catch (error) {
            console.error('Erro ao salvar vídeo:', error);
            alert('Erro ao salvar vídeo. Verifique a URL e tente novamente.');
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
                        <Link href="/admin/videos">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-3xl font-heading font-bold">
                            {isEditing ? 'Editar Vídeo' : 'Novo Vídeo'}
                        </h2>
                        <p className="text-muted-foreground">
                            {isEditing ? 'Atualize as informações do vídeo' : 'Adicione um vídeo ou short do YouTube'}
                        </p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4 mr-2" />
                    )}
                    Salvar
                </Button>
            </div>

            <Separator />

            {/* Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* URL do YouTube */}
                    <div className="space-y-2">
                        <Label htmlFor="youtube-url">URL do YouTube *</Label>
                        <div className="flex gap-2">
                            <Input
                                id="youtube-url"
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
                                required
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                disabled={!previewId}
                                asChild={!!previewId}
                            >
                                {previewId ? (
                                    <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
                                        <Youtube className="h-5 w-5" />
                                    </a>
                                ) : (
                                    <Youtube className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                        {previewId && (
                            <p className="text-xs text-muted-foreground">
                                ✓ URL válida - ID do vídeo: {previewId}
                            </p>
                        )}
                    </div>

                    {/* Preview do Vídeo */}
                    {previewId && (
                        <div className="space-y-2">
                            <Label>Preview</Label>
                            <div className="aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${previewId}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    )}

                    {/* Título */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Título do Vídeo *</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Digite um título atrativo para o vídeo"
                            required
                        />
                    </div>

                    {/* Descrição */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descreva o conteúdo do vídeo..."
                            rows={4}
                        />
                    </div>

                    {/* SEO Fields */}
                    <SEOFields
                        metaTitle={metaTitle}
                        metaDescription={metaDescription}
                        onMetaTitleChange={setMetaTitle}
                        onMetaDescriptionChange={setMetaDescription}
                    />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Categoria */}
                    <div className="p-4 border border-border rounded-lg bg-card space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Categoria *</Label>
                            <Input
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Ex: Terapia, Mindfulness, Dicas"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Use categorias para organizar seus vídeos
                            </p>
                        </div>

                        <Separator />

                        {/* Imagem de Capa Personalizada */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <ImageIcon className="h-4 w-4" />
                                Imagem de Capa Personalizada
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Opcional. Substitui o thumbnail automático do YouTube.
                            </p>

                            {/* Upload do computador */}
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    disabled={uploadingCover}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    disabled={uploadingCover}
                                >
                                    {uploadingCover ? (
                                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Enviando...</>
                                    ) : (
                                        <><Upload className="h-4 w-4 mr-2" /> Enviar do Computador</>
                                    )}
                                </Button>
                            </div>

                            {/* Ou por URL */}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="flex-1 h-px bg-border" />
                                <span>ou cole uma URL</span>
                                <div className="flex-1 h-px bg-border" />
                            </div>
                            <Input
                                value={customCover}
                                onChange={(e) => setCustomCover(e.target.value)}
                                placeholder="https://..."
                            />

                            {/* Preview da capa */}
                            {customCover && (
                                <div className="relative mt-2">
                                    <div className="aspect-video rounded-md overflow-hidden border border-border bg-muted">
                                        <img
                                            src={customCover}
                                            alt="Preview da capa"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                    <button
                                        onClick={() => setCustomCover('')}
                                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors"
                                        title="Remover imagem de capa"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <Separator />

                        {/* Destacar Vídeo */}
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="pin" className="cursor-pointer">
                                    Destacar este vídeo
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Aparecerá primeiro na lista
                                </p>
                            </div>
                            <Switch
                                id="pin"
                                checked={isPinned}
                                onCheckedChange={setIsPinned}
                            />
                        </div>
                    </div>

                    {/* Dicas */}
                    <div className="p-4 border border-border rounded-lg bg-muted/50 space-y-2">
                        <h3 className="font-semibold text-sm flex items-center gap-2">
                            <Youtube className="h-4 w-4" />
                            Dicas
                        </h3>
                        <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Funciona com vídeos e Shorts</li>
                            <li>• Cole a URL completa do YouTube</li>
                            <li>• O thumbnail é extraído automaticamente</li>
                            <li>• Use uma imagem de capa para personalizar</li>
                            <li>• Preencha os campos SEO para melhor posicionamento</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}