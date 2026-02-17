'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug } from '@/lib/blog';
import type { BlogPost } from '@/types/blog';
import { ArrowLeft, Calendar, User, Tag, Loader2, Share2, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LucianaLogo } from '@/components/luciana-logo';
import { ScrollReveal } from '@/components/scroll-reveal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';

export default function BlogPostPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug as string;
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPost = async () => {
            try {
                setLoading(true);
                const data = await getPostBySlug(slug);
                if (!data) {
                    console.error("Post não encontrado:", slug);
                    return;
                }
                setPost(data);
            } catch (error) {
                console.error("Erro ao carregar post:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            loadPost();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
                <h1 className="text-4xl font-headline">Post não encontrado</h1>
                <p className="text-muted-foreground">O conteúdo que você busca não está disponível ou foi removido.</p>
                <Button asChild>
                    <Link href="/">Voltar para o início</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header / Nav Mini */}
            <nav className="fixed w-full z-50 bg-white/50 dark:bg-gray-900/40 backdrop-blur-2xl shadow-sm py-4">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <LucianaLogo className="w-8 h-8 transition-transform group-hover:rotate-12" />
                        <span className="text-2xl font-allison text-foreground pt-1">luciana telles</span>
                    </Link>
                    <Button variant="outline" size="sm" asChild className="rounded-full">
                        <Link href="/">Voltar ao Início</Link>
                    </Button>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-4">
                <article className="max-w-4xl mx-auto space-y-8">
                    {/* Breadcrumbs / Voltar */}
                    <ScrollReveal direction="up">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Voltar para o blog
                        </Link>
                    </ScrollReveal>

                    {/* Título e Meta */}
                    <div className="space-y-4 text-center">
                        <ScrollReveal direction="up" delay={100}>
                            <div className="flex flex-wrap justify-center gap-4 text-xs font-bold uppercase tracking-widest text-primary">
                                {post.categories.map(cat => (
                                    <span key={cat} className="flex items-center gap-1 bg-primary/5 px-3 py-1 rounded-full">
                                        <Tag size={12} /> {cat}
                                    </span>
                                ))}
                            </div>
                        </ScrollReveal>
                        <ScrollReveal direction="up" delay={200}>
                            <h1 className="text-4xl md:text-6xl font-headline leading-tight text-foreground">
                                {post.title}
                            </h1>
                        </ScrollReveal>
                        <ScrollReveal direction="up" delay={300}>
                            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <User size={16} />
                                    <span>{post.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>
                                        {post.publishedAt
                                            ? format(post.publishedAt.toDate(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                                            : format(post.createdAt.toDate(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                                        }
                                    </span>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Imagem de Capa */}
                    <ScrollReveal direction="up" delay={400}>
                        <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white dark:border-gray-800">
                            <Image
                                src={post.coverImage}
                                alt={post.coverImageAlt || post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </ScrollReveal>

                    {/* Conteúdo */}
                    <ScrollReveal direction="up" delay={500}>
                        <div
                            className="prose prose-purple prose-lg dark:prose-invert max-w-none 
                            prose-headings:font-headline prose-p:text-muted-foreground prose-p:leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </ScrollReveal>

                    {/* Footer do Post */}
                    <Separator className="my-12" />
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-8 px-8 bg-secondary/30 rounded-[2rem] border border-primary/10">
                        <div className="space-y-4 text-center md:text-left">
                            <h4 className="text-2xl font-headline font-bold">Gostou deste conteúdo?</h4>
                            <div className="flex items-center gap-4 justify-center md:justify-start">
                                <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Compartilhe:</span>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" className="rounded-full w-10 h-10 hover:bg-primary hover:text-white transition-all" asChild title="Compartilhar no LinkedIn">
                                        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`} target="_blank" rel="noopener noreferrer">
                                            <Share2 size={18} />
                                        </a>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full w-10 h-10 hover:bg-primary hover:text-white transition-all"
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            alert('Link copiado para a área de transferência!');
                                        }}
                                        title="Copiar Link"
                                    >
                                        <LinkIcon size={18} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <p className="text-sm text-muted-foreground max-w-[250px] text-center">Entre em contato para agendar uma consulta personalizada.</p>
                            <Button size="lg" className="rounded-full px-10 h-14 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all" asChild>
                                <Link href="/login">
                                    Agendar Consulta
                                </Link>
                            </Button>
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
}
