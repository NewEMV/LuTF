'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPosts, deletePost, togglePinPost, reorderPosts } from '@/lib/blog';
import type { BlogPost } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
    verticalListSortingStrategy,
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
    Eye,
    GripVertical,
    Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

function SortableRow({ post, onEdit, onDelete, onTogglePin }: {
    post: BlogPost;
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
    } = useSortable({ id: post.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <TableRow ref={setNodeRef} style={style}>
            <TableCell>
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    {post.isPinned && (
                        <Badge variant="default" className="gap-1">
                            <Pin className="h-3 w-3" />
                            Fixado
                        </Badge>
                    )}
                    <span className="font-medium">{post.title}</span>
                </div>
            </TableCell>
            <TableCell>
                <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                    {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                </Badge>
            </TableCell>
            <TableCell>
                {post.categories?.join(', ') || '-'}
            </TableCell>
            <TableCell>
                {post.publishedAt
                    ? format(post.publishedAt.toDate(), 'dd MMM yyyy', { locale: ptBR })
                    : '-'}
            </TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={onEdit}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onTogglePin}>
                            {post.isPinned ? (
                                <>
                                    <PinOff className="h-4 w-4 mr-2" />
                                    Desafixar
                                </>
                            ) : (
                                <>
                                    <Pin className="h-4 w-4 mr-2" />
                                    Fixar
                                </>
                            )}
                        </DropdownMenuItem>
                        {post.status === 'published' && (
                            <DropdownMenuItem asChild>
                                <Link href={`/blog/${post.slug}`} target="_blank">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Visualizar
                                </Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={onDelete} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}

export default function BlogPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const allPosts = await getPosts();
            setPosts(allPosts);
        } catch (error) {
            console.error('Erro ao carregar posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = posts.findIndex((p) => p.id === active.id);
            const newIndex = posts.findIndex((p) => p.id === over.id);

            const newPosts = arrayMove(posts, oldIndex, newIndex);
            setPosts(newPosts);

            try {
                await reorderPosts(newPosts.map((p) => p.id));
            } catch (error) {
                console.error('Erro ao reordenar posts:', error);
                loadPosts();
            }
        }
    };

    const handleTogglePin = async (postId: string) => {
        const post = posts.find((p) => p.id === postId);
        if (!post) return;

        try {
            await togglePinPost(postId, !post.isPinned);
            loadPosts();
        } catch (error) {
            console.error('Erro ao fixar/desafixar post:', error);
        }
    };

    const handleDelete = async () => {
        if (!postToDelete) return;

        try {
            await deletePost(postToDelete);
            loadPosts();
            setDeleteDialogOpen(false);
            setPostToDelete(null);
        } catch (error) {
            console.error('Erro ao deletar post:', error);
        }
    };

    const filteredPosts = posts.filter((post) => {
        const matchesSearch = (post.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (post.content?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || post.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-heading font-bold">Gestão de Blog</h2>
                    <p className="text-muted-foreground">
                        Crie e gerencie posts do blog com otimização SEO/AEO
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/blog/novo">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Post
                    </Link>
                </Button>
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-4">
                <Input
                    placeholder="Buscar posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />
                <div className="flex gap-2">
                    <Button
                        variant={statusFilter === 'all' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('all')}
                        size="sm"
                    >
                        Todos
                    </Button>
                    <Button
                        variant={statusFilter === 'published' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('published')}
                        size="sm"
                    >
                        Publicados
                    </Button>
                    <Button
                        variant={statusFilter === 'draft' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('draft')}
                        size="sm"
                    >
                        Rascunhos
                    </Button>
                </div>
            </div>

            {/* Tabela de Posts */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-lg">
                    <p className="text-muted-foreground">Nenhum post encontrado.</p>
                    <Button asChild className="mt-4">
                        <Link href="/admin/blog/novo">
                            <Plus className="h-4 w-4 mr-2" />
                            Criar Primeiro Post
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="border border-border rounded-lg overflow-hidden">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12" />
                                    <TableHead>Título</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Categorias</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead className="w-12" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <SortableContext
                                    items={filteredPosts.map((p) => p.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {filteredPosts.map((post) => (
                                        <SortableRow
                                            key={post.id}
                                            post={post}
                                            onEdit={() => router.push(`/admin/blog/${post.id}`)}
                                            onDelete={() => {
                                                setPostToDelete(post.id);
                                                setDeleteDialogOpen(true);
                                            }}
                                            onTogglePin={() => handleTogglePin(post.id)}
                                        />
                                    ))}
                                </SortableContext>
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
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
