'use client';
import { useState, useEffect } from "react";
import Link from 'next/link';
import Image from "next/image";
import { getVideos } from '@/lib/videos';
import { getServices } from '@/lib/services';
import type { Video } from '@/types/video';
import { LucianaLogo } from "@/components/luciana-logo";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from '@/components/scroll-reveal';
import { PlayCircle, ArrowRight, Loader2 } from 'lucide-react';
import { CardMovingBorder } from '@/components/card-moving-border';

export default function VideoListPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [hasServices, setHasServices] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('todos');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [videosData, servicesData] = await Promise.all([
                    getVideos(),
                    getServices(false)
                ]);
                setVideos(videosData);
                setHasServices(servicesData.length > 0);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const categories = ['todos', ...Array.from(new Set(videos.map(v => v.category).filter((cat): cat is string => !!cat)))];
    const filteredVideos = filter === 'todos' ? videos : videos.filter(v => (v.category || '') === filter);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <nav className="fixed w-full z-50 bg-white/50 dark:bg-gray-900/40 backdrop-blur-2xl shadow-sm py-4">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <LucianaLogo className="w-8 h-8 transition-transform group-hover:rotate-12" />
                        <span className="text-2xl font-allison pt-1">luciana telles</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        {hasServices && (
                            <Link href="/servicos" className="hidden md:block text-sm font-medium hover:text-primary transition-colors">Serviços</Link>
                        )}
                        <Button variant="outline" size="sm" asChild className="rounded-full">
                            <Link href="/">Voltar ao Início</Link>
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="pt-32 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <ScrollReveal direction="up">
                        <h1 className="text-4xl md:text-6xl font-headline font-bold">Vídeos: Diálogos Abertos</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Conteúdo em vídeo sobre saúde emocional, oncologia e cuidados paliativos de forma leve e informativa.
                        </p>
                    </ScrollReveal>
                    <ScrollReveal direction="up" delay={100}>
                        <div className="flex flex-wrap justify-center gap-2 mt-8">
                            {categories.map(cat => (
                                <button key={cat} onClick={() => setFilter(cat)}
                                    className={`px-5 py-2 rounded-full capitalize text-sm transition-all ${filter === cat ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-secondary text-foreground hover:bg-primary/10'}`}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredVideos.map((video, idx) => (
                        <ScrollReveal key={video.id} direction="up" delay={idx * 100}>
                            <CardMovingBorder className="shadow-lg transition-all duration-300 group overflow-hidden h-full" borderRadius="1.5rem">
                                <Link href={`/videos/${video.id}`} className="block h-full bg-card">
                                    <div className="aspect-video bg-secondary flex items-center justify-center relative">
                                        {video.customCover || video.thumbnail ? (
                                            <Image src={video.customCover || video.thumbnail} alt={video.title} fill className="object-cover" />
                                        ) : (
                                            <PlayCircle size={48} className="text-primary/50" />
                                        )}
                                        <span className="absolute top-4 left-4 px-3 py-1 glass rounded-full text-[10px] font-bold uppercase text-primary">
                                            {video.category}
                                        </span>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="text-xl font-headline font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{video.title}</h4>
                                        <p className="text-sm text-muted-foreground line-clamp-3">{video.description}</p>
                                    </div>
                                </Link>
                            </CardMovingBorder>
                        </ScrollReveal>
                    ))}
                </div>
            </main>
        </div>
    );
}