'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Image as ImageLucide,
    Trash2,
    ChevronRight,
    Upload,
    X,
    Loader2,
    Star
} from 'lucide-react';

const ImageIcon = ImageLucide;
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog';
import {
    getAlbums,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getImagesByAlbum,
    uploadImage,
    addImageToGallery,
    deleteImage
} from '@/lib/galeria';
import type { GaleriaAlbum, GaleriaImage } from '@/types/galeria';
import Image from 'next/image';

export default function GaleriaPage() {
    const [albums, setAlbums] = useState<GaleriaAlbum[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState<GaleriaAlbum | null>(null);
    const [images, setImages] = useState<GaleriaImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Estados para novo álbum
    const [newAlbum, setNewAlbum] = useState({ name: '', description: '', coverImage: '' });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        loadAlbums();
    }, []);

    const loadAlbums = async () => {
        setLoading(true);
        try {
            const data = await getAlbums();
            setAlbums(data);
        } catch (error) {
            console.error('Erro ao carregar álbuns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAlbum = async (album: GaleriaAlbum) => {
        setSelectedAlbum(album);
        setLoading(true);
        try {
            const data = await getImagesByAlbum(album.id);
            setImages(data);
        } catch (error) {
            console.error('Erro ao carregar imagens:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAlbum = async () => {
        if (!newAlbum.name) return;
        try {
            await createAlbum({
                name: newAlbum.name,
                slug: newAlbum.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-'),
                description: newAlbum.description,
                coverImage: newAlbum.coverImage || 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80'
            });
            setIsCreateModalOpen(false);
            setNewAlbum({ name: '', description: '', coverImage: '' });
            loadAlbums();
        } catch (error) {
            console.error('Erro ao criar álbum:', error);
        }
    };

    const handleDeleteAlbum = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Deseja realmente excluir este álbum e todas as suas fotos?')) return;
        try {
            await deleteAlbum(id);
            if (selectedAlbum?.id === id) setSelectedAlbum(null);
            loadAlbums();
        } catch (error) {
            console.error('Erro ao excluir álbum:', error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !selectedAlbum) return;

        setUploading(true);
        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const url = await uploadImage(file, selectedAlbum.id);
                await addImageToGallery({
                    albumId: selectedAlbum.id,
                    url,
                    alt: file.name,
                    caption: '',
                    order: images.length + i
                });
            }
            // Recarregar imagens do álbum
            const data = await getImagesByAlbum(selectedAlbum.id);
            setImages(data);
        } catch (error) {
            console.error('Erro no upload:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = async (image: GaleriaImage) => {
        if (!confirm('Excluir esta foto?')) return;
        try {
            await deleteImage(image.id, image.url);
            setImages(images.filter(img => img.id !== image.id));
        } catch (error) {
            console.error('Erro ao excluir imagem:', error);
        }
    };

    const handleSetAsCover = async (imageUrl: string) => {
        if (!selectedAlbum) return;
        try {
            await updateAlbum(selectedAlbum.id, { coverImage: imageUrl, updatedAt: undefined as any });
            setSelectedAlbum({ ...selectedAlbum, coverImage: imageUrl });
            loadAlbums();
        } catch (error) {
            console.error('Erro ao definir capa:', error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold">Gestão de Galeria</h1>
                    <p className="text-muted-foreground">Organize as fotos da sua trajetória e eventos.</p>
                </div>

                {!selectedAlbum && (
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-xl">
                                <Plus className="w-4 h-4 mr-2" /> Novo Álbum
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Criar Novo Álbum</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nome do Álbum</label>
                                    <Input
                                        placeholder="Ex: Consultório Ubatuba"
                                        value={newAlbum.name}
                                        onChange={e => setNewAlbum({ ...newAlbum, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Descrição</label>
                                    <Textarea
                                        placeholder="Breve descrição do álbum..."
                                        value={newAlbum.description}
                                        onChange={e => setNewAlbum({ ...newAlbum, description: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">URL da Imagem de Capa (Opcional)</label>
                                    <Input
                                        placeholder="https://..."
                                        value={newAlbum.coverImage}
                                        onChange={e => setNewAlbum({ ...newAlbum, coverImage: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
                                <Button onClick={handleCreateAlbum}>Criar Álbum</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}

                {selectedAlbum && (
                    <Button variant="outline" onClick={() => setSelectedAlbum(null)}>
                        Voltar para Álbuns
                    </Button>
                )}
            </div>

            {loading && !uploading && (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            )}

            {!loading && !selectedAlbum && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {albums.map(album => (
                        <div
                            key={album.id}
                            onClick={() => handleSelectAlbum(album)}
                            className="group relative bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:border-primary/50 transition-all"
                        >
                            <div className="aspect-[16/10] relative">
                                <Image
                                    src={album.coverImage}
                                    alt={album.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/20" />
                                <button
                                    onClick={(e) => handleDeleteAlbum(album.id, e)}
                                    className="absolute top-2 right-2 p-2 bg-white/10 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-4 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold">{album.name}</h3>
                                    <p className="text-xs text-muted-foreground">{album.description || 'Sem descrição'}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            </div>
                        </div>
                    ))}
                    {albums.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-3xl">
                            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Nenhum álbum criado ainda.</p>
                        </div>
                    )}
                </div>
            )}

            {selectedAlbum && (
                <div className="space-y-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between bg-primary/5 p-6 rounded-2xl border border-primary/20">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary font-bold">
                                {images.length} fotos
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{selectedAlbum.name}</h2>
                                <p className="text-sm text-muted-foreground italic">Clique no botão ao lado para subir novas fotos do seu computador.</p>
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                disabled={uploading}
                            />
                            <Button disabled={uploading}>
                                {uploading ? (
                                    <> <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Subindo...</>
                                ) : (
                                    <> <Upload className="w-4 h-4 mr-2" /> Subir Fotos</>
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {images.map(img => (
                            <div key={img.id} className="group relative aspect-square bg-muted rounded-xl overflow-hidden border border-border">
                                <Image
                                    src={img.url}
                                    alt={img.alt}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform"
                                />
                                <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 ${selectedAlbum?.coverImage === img.url ? 'opacity-100' : ''}`}>
                                    <button
                                        onClick={() => handleSetAsCover(img.url)}
                                        className={`p-2 rounded-full text-white transition-all transform hover:scale-110 ${selectedAlbum?.coverImage === img.url ? 'bg-amber-500 scale-110' : 'bg-white/20 hover:bg-amber-500'}`}
                                        title="Definir como capa do álbum"
                                    >
                                        <Star className={`w-4 h-4 ${selectedAlbum?.coverImage === img.url ? 'fill-current' : ''}`} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteImage(img)}
                                        className="p-2 bg-rose-500 rounded-full text-white hover:scale-110 transition-transform"
                                        title="Excluir imagem"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                {selectedAlbum?.coverImage === img.url && (
                                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                                        CAPA
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
