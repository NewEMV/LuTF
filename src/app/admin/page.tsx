'use client';

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-4xl font-heading font-bold mb-8">Dashboard Administrativo</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-card border border-border rounded-lg">
                    <h3 className="font-bold mb-2">Gestão de Eventos</h3>
                    <p className="text-sm text-muted-foreground">Em breve</p>
                </div>

                <div className="p-6 bg-card border border-border rounded-lg">
                    <h3 className="font-bold mb-2">Gestão de Blog</h3>
                    <p className="text-sm text-muted-foreground">Em breve</p>
                </div>

                <div className="p-6 bg-card border border-border rounded-lg">
                    <h3 className="font-bold mb-2">Gestão de Galeria</h3>
                    <p className="text-sm text-muted-foreground">Em breve</p>
                </div>
            </div>
        </div>
    );
}
