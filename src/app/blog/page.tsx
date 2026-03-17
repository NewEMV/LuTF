'use client';
import { useState, useEffect } from "react";
import Link from 'next/link';
import Image from "next/image";
import { getPublishedPosts } from '@/lib/blog';
import { getServices } from '@/lib/services';
import type { BlogPost } from '@/types/blog';
import { LucianaLogo } from "@/components/luciana-logo";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from '@/components/scroll-reveal';
import { BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import { CardMovingBorder } from '@/components/card-moving-border';

export default function BlogListPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasServices, setHasServices] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [postsData, servicesData] = await Promise.all([
                    getPublishedPosts(),
                    getServices(false)
                ]);
                setPosts(postsData);
                setHasServices(servicesData.length > 0);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
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
                        <h1 className="text-4xl md:text-6xl font-headline font-bold">Escritas do Cuidar</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Reflexões sobre psico-oncologia, cuidados paliativos e o processo humano de viver e cuidar.
                        </p>
                    </ScrollReveal>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, idx) => (
                        <ScrollReveal key={post.id} direction="up" delay={idx * 100}>
                            <CardMovingBorder className="shadow-sm transition-all duration-300 group overflow-hidden h-full" borderRadius="2rem">
                                <Link href={`/blog/${post.slug || post.id}`} className="block h-full border border-border rounded-[2rem] overflow-hidden">
                                    <div className="aspect-[16/10] bg-secondary relative overflow-hidden">
                                        {post.coverImage ? (
                                            <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                                <BookOpen size={48} className="text-primary/20" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 glass rounded-full text-[10px] font-bold uppercase text-primary">
                                                {post.categories[0]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-xl font-headline font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-8 line-clamp-3">{post.excerpt}</p>
                                        <div className="font-bold flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary group-hover:gap-4 transition-all mt-auto">
                                            Ler completo <ArrowRight size={16} />
                                        </div>
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
