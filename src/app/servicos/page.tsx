'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    LayoutGrid,
    HandHeart,
    Calendar,
    ChevronRight,
    Loader2,
    MessageCircle,
    BookOpen,
    Users,
    Users2,
    GraduationCap,
    Presentation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LucianaLogo } from '@/components/luciana-logo';
import { ScrollReveal } from '@/components/scroll-reveal';
import { CardMovingBorder } from '@/components/card-moving-border';
import { ContactModal } from '@/components/contact-modal';
import { getServices } from '@/lib/services';
import type { Service, ServiceCategory } from '@/types/service';

const CATEGORY_ICONS: Record<ServiceCategory, any> = {
    'supervisao': Users2,
    'atendimento': MessageCircle,
    'grupos': Users,
    'aulas': GraduationCap,
    'cursos-palestras': Presentation,
};

export default function ServicesPublicPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getServices(false);
                setServices(data);
            } catch (error) {
                console.error("Erro ao carregar serviços:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (services.length === 0) {
        return (
            <>
                <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
                    <div className="bg-primary/5 p-8 rounded-full mb-6">
                        <Calendar size={48} className="text-primary/50" />
                    </div>
                    <h1 className="text-3xl font-headline font-bold mb-4">Novidades em breve</h1>
                    <p className="text-muted-foreground max-w-md mb-8">
                        No momento não temos serviços ou turmas com inscrições abertas, mas você pode entrar em contato para saber mais sobre atendimentos e supervisões.
                    </p>
                    <div className="flex gap-4">
                        <Button variant="outline" asChild className="rounded-full">
                            <Link href="/">Voltar ao Início</Link>
                        </Button>
                        <Button className="rounded-full" onClick={() => setIsContactModalOpen(true)}>
                            Contato
                        </Button>
                    </div>
                </div>
                <ContactModal open={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
            </>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <main className="pt-32 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-20 space-y-4">
                    <ScrollReveal direction="up">
                        <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
                            Como posso te ajudar?
                        </span>
                        <h1 className="text-4xl md:text-6xl font-headline font-bold mt-4">Serviços e Atendimentos</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Apoio especializado para o público: infanto-juvenil - adulto - idoso
                        </p>
                    </ScrollReveal>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, idx) => {
                        const Icon = CATEGORY_ICONS[service.category as ServiceCategory] || LayoutGrid;
                        return (
                            <ScrollReveal key={service.id} direction="up" delay={idx * 100}>
                                <CardMovingBorder className="h-full" borderRadius="2rem">
                                    <div className="bg-card p-8 h-full flex flex-col">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-3 bg-primary/5 rounded-2xl text-primary">
                                                <Icon size={24} />
                                            </div>
                                            {service.withOphicina && (
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
                                                    <HandHeart size={12} /> Parceiro Ophicina
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-2xl font-headline font-bold mb-4">{service.title}</h3>
                                        <p className="text-muted-foreground mb-8 flex-grow leading-relaxed">{service.description}</p>
                                        <div className="space-y-4 pt-6 border-t border-border mt-auto">
                                            {(service as any).dateInfo && (
                                                <div className="flex items-center gap-2 text-sm text-primary font-medium">
                                                    <Calendar size={16} />
                                                    {(service as any).dateInfo}
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-3 pt-2">
                                                <Button className="w-full rounded-full h-12 text-md font-semibold font-headline" onClick={() => setIsContactModalOpen(true)}>
                                                    Contato
                                                </Button>
                                                {(service as any).price && (
                                                    <span className="text-xs text-center text-muted-foreground">
                                                        Investimento: {(service as any).price}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardMovingBorder>
                            </ScrollReveal>
                        );
                    })}
                </div>

                <section className="mt-32 p-12 bg-secondary/30 rounded-[3rem] text-center space-y-8 border border-primary/10">
                    <ScrollReveal direction="up">
                        <h2 className="text-3xl font-headline font-bold">Dúvidas sobre qual serviço escolher?</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Estou à disposição para conversar e entender qual o melhor caminho para o seu momento ou para o seu projeto institucional.
                        </p>
                        <Button variant="ghost" className="mt-4 hover:bg-transparent hover:text-primary group flex items-center gap-2 mx-auto text-base" onClick={() => setIsContactModalOpen(true)}>
                            Falar diretamente comigo <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Button>
                    </ScrollReveal>
                </section>
            </main>
            <ContactModal open={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
        </div>
    );
}
