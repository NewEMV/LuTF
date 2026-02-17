'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    collection,
    query,
    where,
    getDocs,
    getCountFromServer
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
    Users,
    FileText,
    Video,
    Plus,
    Settings,
    ArrowUpRight,
    Users2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        clients: 0,
        pendingClients: 0,
        posts: 0,
        videos: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                // Contagem de Clientes
                const clientsQuery = query(collection(db, 'users'), where('role', '==', 'client'));
                const pendingQuery = query(collection(db, 'users'), where('role', '==', 'client'), where('status', '==', 'pending'));

                // Contagem de Posts e Vídeos
                const postsColl = collection(db, 'posts');
                const videosColl = collection(db, 'videos');

                const [clientsSnap, pendingSnap, postsSnap, videosSnap] = await Promise.all([
                    getCountFromServer(clientsQuery),
                    getCountFromServer(pendingQuery),
                    getCountFromServer(postsColl),
                    getCountFromServer(videosColl)
                ]);

                setStats({
                    clients: clientsSnap.data().count,
                    pendingClients: pendingSnap.data().count,
                    posts: postsSnap.data().count,
                    videos: videosSnap.data().count
                });
            } catch (error) {
                console.error('Erro ao carregar estatísticas:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'Pacientes Totais',
            value: stats.clients,
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-100',
            href: '/admin/clientes',
            footer: stats.pendingClients > 0 ? `${stats.pendingClients} aguardando aprovação` : 'Tudo em dia'
        },
        {
            title: 'Posts no Blog',
            value: stats.posts,
            icon: FileText,
            color: 'text-purple-600',
            bg: 'bg-purple-100',
            href: '/admin/blog',
            footer: 'Gerenciar conteúdo'
        },
        {
            title: 'Vídeos/Shorts',
            value: stats.videos,
            icon: Video,
            color: 'text-rose-600',
            bg: 'bg-rose-100',
            href: '/admin/videos',
            footer: 'Gerenciar YouTube'
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold">Resumo Geral</h1>
                    <p className="text-muted-foreground">Bem-vinda ao seu painel administrativo, Luciana.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                        <Settings className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Grid de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((card, idx) => (
                    <Link
                        key={idx}
                        href={card.href}
                        className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-md"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="space-y-1">
                            {loading ? (
                                <div className="h-9 w-16 bg-muted animate-pulse rounded" />
                            ) : (
                                <h3 className="text-3xl font-bold">{card.value}</h3>
                            )}
                            <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-border/50 text-xs font-medium text-muted-foreground italic">
                            {card.footer}
                        </div>
                    </Link>
                ))}
            </div>

            {/* Ações Rápidas */}
            <div>
                <h2 className="text-xl font-heading font-bold mb-4">Ações Rápidas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button asChild variant="outline" className="h-20 justify-start px-6 rounded-2xl border-dashed">
                        <Link href="/admin/blog/novo">
                            <Plus className="w-5 h-5 mr-3 text-primary" />
                            Criar novo post
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-20 justify-start px-6 rounded-2xl border-dashed">
                        <Link href="/admin/videos/novo">
                            <Plus className="w-5 h-5 mr-3 text-primary" />
                            Adicionar vídeo
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-20 justify-start px-6 rounded-2xl border-dashed">
                        <Link href="/admin/clientes">
                            <Users2 className="w-5 h-5 mr-3 text-primary" />
                            Aprovar pacientes
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
