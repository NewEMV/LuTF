'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
    requireApprovedClient?: boolean;
}

export function ProtectedRoute({
    children,
    requireAdmin = false,
    requireApprovedClient = false
}: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            // Não autenticado
            if (!user) {
                router.push('/login');
                return;
            }

            // Requer admin mas não é admin
            if (requireAdmin && user.role !== 'admin') {
                router.push('/login');
                return;
            }

            // Requer cliente aprovado
            if (requireApprovedClient) {
                if (user.role !== 'client' || user.status !== 'approved') {
                    router.push('/login');
                    return;
                }
            }
        }
    }, [user, loading, requireAdmin, requireApprovedClient, router]);

    // Mostrar loading enquanto verifica autenticação
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Verificando acesso...</p>
                </div>
            </div>
        );
    }

    // Verificar autenticação
    if (!user) {
        return null;
    }

    // Verificar permissões
    if (requireAdmin && user.role !== 'admin') {
        return null;
    }

    if (requireApprovedClient && (user.role !== 'client' || user.status !== 'approved')) {
        return null;
    }

    return <>{children}</>;
}
