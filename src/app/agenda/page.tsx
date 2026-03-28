'use client';
import { ProtectedRoute } from '@/components/protected-route';
import { useEffect } from 'react';

export const dynamic = 'force-dynamic';

export default function AgendaPage() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://app.cal.com/embed/embed.js';
        script.async = true;

        script.onload = () => {
            const cal = (window as any).Cal;
            if (cal) {
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
            }
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

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
                        <div id="my-cal-inline" style={{ width: '100%', height: '100%', overflow: 'scroll' }} />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}