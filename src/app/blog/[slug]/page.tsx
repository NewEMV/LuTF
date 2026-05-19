'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug } from '@/lib/blog';
import type { BlogPost } from '@/types/blog';
import { ArrowLeft, Calendar, User, Tag, Loader2, Linkedin, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LucianaLogo } from '@/components/luciana-logo';
import { ScrollReveal } from '@/components/scroll-reveal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';

export default function BlogPostPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

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
        if (slug) loadPost();
    }, [slug]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWhatsAppShare = () => {
        const text = encodeURIComponent(`Confira este artigo: ${post?.title}\n${window.location.href}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    const handleLinkedInShare = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
                <h1 className="text-4xl font-headline">Post não encontrado</h1>
                <p className="text-muted-foreground">O conteúdo que você busca não está disponível ou foi removido.</p>
                <Button asChild><Link href="/">Voltar para o início</Link></Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
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
                    <ScrollReveal direction="up">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Voltar para o blog
                        </Link>
                    </ScrollReveal>

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
                            <h1 className="text-4xl md:text-6xl font-headline leading-tight text-foreground">{post.title}</h1>
                        </ScrollReveal>
                        <ScrollReveal direction="up" delay={300}>
                            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2"><User size={16} /><span>{post.author}</span></div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>{post.publishedAt
                                        ? format(post.publishedAt.toDate(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                                        : format(post.createdAt.toDate(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                                    }</span>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    <ScrollReveal direction="up" delay={400}>
                        <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white dark:border-gray-800">
                            <Image src={post.coverImage} alt={post.coverImageAlt || post.title} fill className="object-cover" priority />
                        </div>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={500}>
                        <div
                            className="prose prose-purple prose-lg dark:prose-invert max-w-none prose-headings:font-headline prose-p:text-muted-foreground prose-p:leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </ScrollReveal>

                    <Separator className="my-12" />
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 py-8 px-8 bg-secondary/30 rounded-[2rem] border border-primary/10">
                        <div className="space-y-4 text-center">
                            <h4 className="text-2xl font-headline font-bold">Gostou deste conteúdo?</h4>
                            <div className="flex items-center gap-4 justify-center flex-wrap">
                                <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Compartilhe:</span>
                                <div className="flex gap-3">
                                    {/* Botão WhatsApp */}
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full w-12 h-12 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all"
                                        onClick={handleWhatsAppShare}
                                        title="Compartilhar no WhatsApp"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                    </Button>

                                    {/* Botão LinkedIn */}
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full w-12 h-12 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all"
                                        onClick={handleLinkedInShare}
                                        title="Compartilhar no LinkedIn"
                                    >
                                        <Linkedin size={20} />
                                    </Button>

                                    {/* Botão Copiar Link */}
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full w-12 h-12 hover:bg-primary hover:text-white transition-all"
                                        onClick={handleCopyLink}
                                        title={copied ? "Link copiado!" : "Copiar link"}
                                    >
                                        <Copy size={20} />
                                    </Button>
                                </div>
                            </div>
                            {copied && (
                                <p className="text-sm text-primary font-medium animate-in fade-in duration-200">
                                    ✓ Link copiado para a área de transferência!
                                </p>
                            )}
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
}