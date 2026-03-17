'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Video } from '@/types/video';
import { ArrowLeft, Tag, Loader2, Share2, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LucianaLogo } from '@/components/luciana-logo';
import { ScrollReveal } from '@/components/scroll-reveal';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Separator } from '@/components/ui/separator';

export default function VideoPage() {
    const params = useParams();
    const videoId = params?.id as string;
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadVideo = async () => {
            try {
                setLoading(true);
                const docRef = doc(db, 'videos', videoId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setVideo({ id: docSnap.id, ...docSnap.data() } as Video);
                }
            } catch (error) {
                console.error("Erro ao carregar vídeo:", error);
            } finally {
                setLoading(false);
            }
        };
        if (videoId) loadVideo();
    }, [videoId]);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (!video) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
                <h1 className="text-4xl font-headline">Vídeo não encontrado</h1>
                <Button asChild><Link href="/">Voltar para o início</Link></Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <nav className="fixed w-full z-50 bg-white/50 dark:bg-gray-900/40 backdrop-blur-2xl shadow-sm py-4">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <LucianaLogo className="w-8 h-8 transition-transform group-hover:rotate-12" />
                        <span className="text-2xl font-allison pt-1 text-foreground leading-none">luciana telles</span>
                    </Link>
                    <Button variant="outline" size="sm" asChild className="rounded-full">
                        <Link href="/">Voltar ao Início</Link>
                    </Button>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-4 max-w-5xl mx-auto space-y-12">
                <ScrollReveal direction="up">
                    <Link href="/#vlog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft size={16} /> Voltar para Vídeos
                    </Link>
                </ScrollReveal>

                <div className="space-y-6 text-center">
                    <ScrollReveal direction="up" delay={100}>
                        <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 w-fit mx-auto">
                            <Tag size={12} /> {video.category}
                        </span>
                    </ScrollReveal>
                    <ScrollReveal direction="up" delay={200}>
                        <h1 className="text-3xl md:text-5xl font-headline font-bold">{video.title}</h1>
                    </ScrollReveal>
                </div>

                <ScrollReveal direction="up" delay={300}>
                    <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white dark:border-gray-800 bg-black">
                        <iframe
                            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute top-0 left-0 w-full h-full"
                        ></iframe>
                    </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={400} className="space-y-8">
                    <div className="prose prose-purple dark:prose-invert max-w-none">
                        <h3 className="font-headline text-2xl">Sobre este vídeo</h3>
                        <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">{video.description}</p>
                    </div>
                    <Separator className="my-8" />
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-8 px-8 bg-secondary/30 rounded-[2.5rem] border border-primary/10">
                        <div className="space-y-4 text-center md:text-left">
                            <h4 className="text-2xl font-headline font-bold">Compartilhe este vídeo</h4>
                            <div className="flex gap-3 justify-center md:justify-start">
                                <Button variant="outline" size="icon" className="rounded-full w-12 h-12 hover:bg-primary hover:text-white transition-all" asChild>
                                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`} target="_blank" rel="noopener noreferrer">
                                        <Share2 size={20} />
                                    </a>
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-full w-12 h-12 hover:bg-primary hover:text-white transition-all"
                                    onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copiado!'); }}>
                                    <LinkIcon size={20} />
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <p className="text-sm text-muted-foreground text-center max-w-[300px]">entre em contato para agendar uma consulta personalizada ou convite a participação em eventos.</p>
                            <Button size="lg" className="rounded-full px-10 h-14 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all" asChild>
                                <Link href="/login">Contato | Agendamento</Link>
                            </Button>
                        </div>
                    </div>
                </ScrollReveal>
            </main>
        </div>
    );
}
