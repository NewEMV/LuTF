'use client';
import { ProtectedRoute } from '@/components/protected-route';
import { AdminSidebar } from '@/components/admin-sidebar';
import { ThemeToggle } from '@/contexts/ThemeContext';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute requireAdmin>
            <div className="flex h-screen overflow-hidden bg-background">
                {/* Sidebar */}
                <AdminSidebar />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-card/50 backdrop-blur-sm">
                        <h1 className="text-xl font-heading font-semibold text-foreground">
                            Painel Administrativo
                        </h1>
                        <ThemeToggle />
                    </header>

                    {/* Content Area */}
                    <main className="flex-1 overflow-auto p-6">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
