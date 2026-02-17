'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Cal, { getCalApi } from "@calcom/embed-react";

export default function AgendaPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        (async function () {
            const cal = await getCalApi();
            cal("ui", {
                theme: "light",
                styles: { branding: { brandColor: "#7c3aed" } },
                hideEventTypeDetails: false,
                layout: "month_view"
            });
        })();
    }, []);

    // Proteção de rota: Só entra se estiver logado e aprovado
    useEffect(() => {
        if (!loading && (!user || user.status !== 'approved')) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user || user.status !== 'approved') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <p className="text-muted-foreground animate-pulse">Verificando acesso...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border bg-card p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-heading font-bold">Sua Agenda de Consultas</h1>
                        <p className="text-xs text-muted-foreground">Bem-vinda, {user.name}</p>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 md:p-8">
                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl min-h-[600px]">
                    <Cal
                        calLink="newton-botuem-calendar" // Substituto temporário
                        style={{ width: "100%", height: "100%", minHeight: "600px" }}
                        config={{ layout: 'month_view' }}
                    />
                </div>

                <p className="mt-6 text-center text-sm text-muted-foreground italic">
                    Escolha o melhor horário para o seu atendimento. O link será enviado para o seu e-mail.
                </p>
            </main>
        </div>
    );
}
