'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    ChevronLeft,
    Calendar,
    MapPin,
    Clock,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getEventos } from '@/lib/eventos';
import type { Evento } from '@/types/evento';
import { ScrollReveal } from '@/components/scroll-reveal';
import { PageLoader } from '@/components/page-loader';

export default function PublicEventosPage() {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const data = await getEventos();
                setEventos(data);
            } catch (error) {
                console.error("Erro ao carregar eventos:", error);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    if (loading) return <PageLoader />;

    return (
        <div className="min-h-screen bg-background">
            {/* Header com Navegação */}
            <header className="fixed w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Voltar ao Início</span>
                    </Link>
                    <h1 className="text-xl md:text-2xl font-headline font-bold text-primary">Eventos e Palestras</h1>
                    <div className="w-24" /> {/* Spacer */}
                </div>
            </header>

            <main className="pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center space-y-4 mb-20">
                        <ScrollReveal direction="up">
                            <h2 className="text-4xl md:text-5xl font-headline">Presença e <span className="text-primary">Diálogo</span></h2>
                            <p className="text-muted-foreground">Acompanhe as próximas palestras, congressos e participações da Luciana em 2026.</p>
                        </ScrollReveal>
                    </div>

                    <div className="space-y-12">
                        {eventos.map((evento, idx) => (
                            <ScrollReveal key={evento.id} direction="up" delay={idx * 100}>
                                <div className="group bg-card border border-border rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row hover:border-primary/50 transition-all hover:shadow-xl group">
                                    <div className="relative w-full md:w-64 aspect-video md:aspect-square flex-shrink-0 overflow-hidden">
                                        <Image
                                            src={evento.coverImage}
                                            alt={evento.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="p-8 flex flex-col justify-between flex-grow">
                                        <div>
                                            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-3">
                                                <Calendar className="w-4 h-4" />
                                                {evento.date.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                            </div>
                                            <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{evento.title}</h3>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground mb-6">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-primary/60" />
                                                    {evento.time}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-primary/60" />
                                                    {evento.location}
                                                </div>
                                            </div>

                                            <p className="text-muted-foreground leading-relaxed">{evento.description}</p>
                                        </div>

                                        {evento.registrationOpen && (
                                            <div className="mt-8">
                                                <Button className="rounded-2xl" variant="outline">
                                                    {evento.locationDetails.startsWith('http') ? 'Ver Localização' : 'Mais informações'}
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}

                        {eventos.length === 0 && (
                            <div className="py-20 text-center border-2 border-dashed border-border rounded-[3rem]">
                                <Calendar className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                                <p className="text-muted-foreground">Nenhum evento público programado para o momento.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
