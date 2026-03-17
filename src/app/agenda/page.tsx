'use client';
import { ProtectedRoute } from '@/components/protected-route';

export const dynamic = 'force-dynamic';

export default function AgendaPage() {
    return (
        <ProtectedRoute requireApprovedClient>
            <div className="min-h-screen p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-headline mb-4">Agendar Consulta</h1>
                    <p className="text-muted-foreground mb-8">
                        Esta página será implementada na FASE 5 com integração Cal.com
                    </p>

                    <div className="p-8 bg-card border border-border rounded-lg text-center">
                        <p className="text-lg">🗓️ Sistema de agendamento em breve</p>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
