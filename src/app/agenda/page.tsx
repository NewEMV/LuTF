'use client';
import { ProtectedRoute } from '@/components/protected-route';

export const dynamic = 'force-dynamic';

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
                        <iframe
                            src="https://cal.com/luciana-telles/60min?embed=true"
                            style={{ width: '100%', height: '100%', border: 'none' }}
                            title="Agendamento"
                        />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}