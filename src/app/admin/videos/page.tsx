'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getVideos, deleteVideo, togglePinVideo, reorderVideos } from '@/lib/videos';
import type { Video } from '@/types/video';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    Pin,
    PinOff,
    ExternalLink,
    GripVertical,
    Loader2,
    Star,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

function SortableVideoCard({ video, onEdit, onDelete, onTogglePin }: {
    video: Video;
    onEdit: () => void;
    onDelete: () => void;
    onTogglePin: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: video.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Card ref={setNodeRef} style={style} className="relative group">
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-2 left-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded-md p-1"
            >
                <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>

            {/* Pinned Badge */}
            {video.isPinned && (
                <Badge className="absolute top-2 right-14 z-10 gap-1" variant="default">
                    <Star className="h-3 w-3" />
                    Destacado
                </Badge>
            )}

            {/* Actions Menu */}
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={onEdit}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onTogglePin}>
                            {video.isPinned ? (
                                <>
                                    <PinOff className="h-4 w-4 mr-2" />
                                    Remover Destaque
                                </>
                            ) : (
                                <>
                                    <Pin className="h-4 w-4 mr-2" />
                                    Destacar
                                </>
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Ver no YouTube
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onDelete} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <CardHeader className="p-0">
                {/* Thumbnail */}
                <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                    <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            </CardHeader>

            <CardContent className="p-4 space-y-2">
                <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {video.description}
                </p>
                <div className="flex items-center justify-between pt-2">
                    <Badge variant="outline">{video.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                        {format(video.publishedAt.toDate(), 'dd MMM yyyy', { locale: ptBR })}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

export default function VideosPage() {
    const router = useRouter();
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        loadVideos();
    }, []);

    const loadVideos = async () => {
        try {
            setLoading(true);
            const allVideos = await getVideos();
            setVideos(allVideos);
        } catch (error) {
            console.error('Erro ao carregar vídeos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = videos.findIndex((v) => v.id === active.id);
            const newIndex = videos.findIndex((v) => v.id === over.id);

            const newVideos = arrayMove(videos, oldIndex, newIndex);
            setVideos(newVideos);

            // Atualizar ordem no Firestore
            try {
                await reorderVideos(newVideos.map((v) => v.id));
            } catch (error) {
                console.error('Erro ao reordenar vídeos:', error);
                // Reverter em caso de erro
                loadVideos();
            }
        }
    };

    const handleTogglePin = async (videoId: string) => {
        const video = videos.find((v) => v.id === videoId);
        if (!video) return;

        try {
            await togglePinVideo(videoId, !video.isPinned);
            loadVideos();
        } catch (error) {
            console.error('Erro ao fixar/desafixar vídeo:', error);
        }
    };

    const handleDelete = async () => {
        if (!videoToDelete) return;

        try {
            await deleteVideo(videoToDelete);
            loadVideos();
            setDeleteDialogOpen(false);
            setVideoToDelete(null);
        } catch (error) {
            console.error('Erro ao deletar vídeo:', error);
        }
    };

    const filteredVideos = videos.filter((video) =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-heading font-bold">Gestão de Vídeos</h2>
                    <p className="text-muted-foreground">
                        Adicione e gerencie vídeos e shorts do YouTube
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/videos/novo">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Vídeo
                    </Link>
                </Button>
            </div>

            {/* Search */}
            <Input
                placeholder="Buscar vídeos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
            />

            {/* Grid de Vídeos */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : filteredVideos.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-lg">
                    <p className="text-muted-foreground">Nenhum vídeo encontrado.</p>
                    <Button asChild className="mt-4">
                        <Link href="/admin/videos/novo">
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Primeiro Vídeo
                        </Link>
                    </Button>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={filteredVideos.map((v) => v.id)}
                        strategy={rectSortingStrategy}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredVideos.map((video) => (
                                <SortableVideoCard
                                    key={video.id}
                                    video={video}
                                    onEdit={() => router.push(`/admin/videos/${video.id}`)}
                                    onDelete={() => {
                                        setVideoToDelete(video.id);
                                        setDeleteDialogOpen(true);
                                    }}
                                    onTogglePin={() => handleTogglePin(video.id)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir este vídeo? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
