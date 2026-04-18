'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    ChevronLeft,
    ImageIcon,
    Calendar,
    ArrowRight,
    Loader2,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAlbums, getImagesByAlbum } from '@/lib/galeria';
import type { GaleriaAlbum, GaleriaImage } from '@/types/galeria';
import { ScrollReveal } from '@/components/scroll-reveal';
import { PageLoader } from '@/components/page-loader';

export default function PublicGaleriaPage() {
    const [albums, setAlbums] = useState<GaleriaAlbum[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState<GaleriaAlbum | null>(null);
    const [images, setImages] = useState<GaleriaImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [imagesLoading, setImagesLoading] = useState(false);
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const albumsData = await getAlbums();
                setAlbums(albumsData);
            } catch (error) {
                console.error("Erro ao carregar álbuns:", error);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const handleSelectAlbum = async (album: GaleriaAlbum) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSelectedAlbum(album);
        setImagesLoading(true);
        try {
            const imagesData = await getImagesByAlbum(album.id);
            setImages(imagesData);
        } catch (error) {
            console.error("Erro ao carregar imagens:", error);
        } finally {
            setImagesLoading(false);
        }
    };

    if (loading) return <PageLoader />;

    return (
        <div className="min-h-screen bg-background">
            <main className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    {!selectedAlbum ? (
                        <div className="space-y-12">
                            <div className="text-center space-y-4 max-w-2xl mx-auto">
                                <ScrollReveal direction="up">
                                    <h2 className="text-4xl md:text-5xl font-headline">Nossa <span className="text-primary">Trajetória</span> em Imagens</h2>
                                    <p className="text-muted-foreground">Momentos especiais de palestras, congressos e a rotina do cuidar.</p>
                                </ScrollReveal>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {albums.map((album, idx) => (
                                    <ScrollReveal key={album.id} direction="up" delay={idx * 100}>
                                        <div onClick={() => handleSelectAlbum(album)} className="group cursor-pointer bg-card border border-border rounded-[2.5rem] overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl">
                                            <div className="aspect-[16/10] relative overflow-hidden">
                                                <Image src={album.coverImage} alt={album.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase text-white tracking-widest border border-white/20">
                                                        {album.createdAt.toDate().getFullYear()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-8 space-y-2">
                                                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{album.name}</h3>
                                                <p className="text-muted-foreground line-clamp-2 text-sm">{album.description}</p>
                                                <div className="pt-4 flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                                                    Ver fotos <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </ScrollReveal>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-2">
                                    <Button variant="ghost" onClick={() => setSelectedAlbum(null)} className="p-0 hover:bg-transparent text-muted-foreground hover:text-primary">
                                        <ChevronLeft className="w-4 h-4 mr-1" /> Todos os Álbuns
                                    </Button>
                                    <h2 className="text-4xl font-headline font-bold">{selectedAlbum.name}</h2>
                                    <p className="text-muted-foreground">{selectedAlbum.description}</p>
                                </div>
                                <div className="flex items-center gap-3 px-6 py-3 bg-primary/5 rounded-2xl border border-primary/10">
                                    <ImageIcon className="w-5 h-5 text-primary" />
                                    <span className="font-bold text-primary">{images.length} Fotografias</span>
                                </div>
                            </div>

                            {imagesLoading ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                </div>
                            ) : images.length > 0 ? (
                                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                                    {images.map((img, idx) => (
                                        <ScrollReveal key={img.id} direction="up" delay={idx % 5 * 50} className="break-inside-avoid">
                                            <div className="relative group rounded-2xl overflow-hidden cursor-zoom-in border border-border" onClick={() => setFullscreenImage(img.url)}>
                                                <Image src={img.url} alt={img.alt} width={500} height={700} className="w-full h-auto group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </ScrollReveal>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center border-2 border-dashed border-border rounded-[3rem]">
                                    <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                                    <p className="text-muted-foreground">Nenhuma foto encontrada neste álbum ainda.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {fullscreenImage && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setFullscreenImage(null)}>
                    <button className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all transform hover:rotate-90" onClick={() => setFullscreenImage(null)}>
                        <X className="w-8 h-8" />
                    </button>
                    <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center">
                        <Image src={fullscreenImage} alt="Visualização ampliada" fill className="object-contain" />
                    </div>
                </div>
            )}
        </div>
    );
}
