'use client';
import { ProtectedRoute } from '@/components/protected-route';
import { useEffect, useRef } from 'react';

export const dynamic = 'force-dynamic';

function CalEmbed() {
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        (function (C: any, A: any, L: any, T: any, I: any, V: any, E: any) {
            C.Cal = C.Cal || function (...args: any[]) {
                (C.Cal.q = C.Cal.q || []).push(args);
            };
            I = A.createElement(L);
            V = A.getElementsByTagName(L)[0];
            I.async = 1;
            I.src = T;
            V.parentNode.insertBefore(I, V);
        })(window, document, 'script', 'https://app.cal.com/embed/embed.js', 0, 0, 0);

        const cal = (window as any).Cal;
        cal('init', { origin: 'https://cal.com' });
        cal('inline', {
            elementOrSelector: '#my-cal-inline',
            calLink: 'newton-botuem-calendar/45min',
            layout: 'month_view',
        });
        cal('ui', {
            theme: 'light',
            styles: { branding: { brandColor: '#000000' } },
            hideEventTypeDetails: false,
            layout: 'month_view',
        });
    }, []);

    return (
        <div id="my-cal-inline" style={{ width: '100%', height: '100%', overflow: 'scroll' }} />
    );
}

export default function AgendaPage() {
    return (
        <ProtectedRoute requireApprovedClient>
            <div className="min-h-screen p-4 md:p-12 bg-background">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-10 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-headline mb-4">Agendar Consulta</h1>
                        <p className="text-muted-foreground text-lg">
                            Escolha um horário para sua sessão. A confirmação será enviada por e-mail.
                        </p>
                    </header>

                    <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-2xl h-[700px]">
                        <CalEmbed />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}