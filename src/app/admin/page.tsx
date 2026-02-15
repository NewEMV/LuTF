'use client';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-headline mb-4">Painel Administrativo</h1>
                <p className="text-muted-foreground mb-8">
                    Esta página será implementada na FASE 3
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 bg-card border border-border rounded-lg">
                        <h3 className="font-bold mb-2">Gestão de Clientes</h3>
                        <p className="text-sm text-muted-foreground">Em breve</p>
                    </div>

                    <div className="p-6 bg-card border border-border rounded-lg">
                        <h3 className="font-bold mb-2">Gestão de Eventos</h3>
                        <p className="text-sm text-muted-foreground">Em breve</p>
                    </div>

                    <div className="p-6 bg-card border border-border rounded-lg">
                        <h3 className="font-bold mb-2">Gestão de Blog</h3>
                        <p className="text-sm text-muted-foreground">Em breve</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
