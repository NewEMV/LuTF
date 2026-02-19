'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Calendar,
    BookOpen,
    Video,
    Image as ImageIcon,
    LayoutGrid,
    ChevronLeft,
    ChevronRight,
    LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LucianaLogo } from '@/components/luciana-logo';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        title: 'Clientes',
        href: '/admin/clientes',
        icon: Users,
    },
    {
        title: 'Eventos',
        href: '/admin/eventos',
        icon: Calendar,
    },
    {
        title: 'Eventos Futuros',
        href: '/admin/eventos-futuros',
        icon: Calendar,
    },
    {
        title: 'Blog',
        href: '/admin/blog',
        icon: BookOpen,
    },
    {
        title: 'Vídeos',
        href: '/admin/videos',
        icon: Video,
    },
    {
        title: 'Serviços',
        href: '/admin/servicos',
        icon: LayoutGrid,
    },
    {
        title: 'Trajetória',
        href: '/admin/trajetoria',
        icon: LayoutGrid,
    },
    {
        title: 'Depoimentos',
        href: '/admin/depoimentos',
        icon: Users,
    },
    {
        title: 'Galeria',
        href: '/admin/galeria',
        icon: ImageIcon,
    },
];

export function AdminSidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <div
            className={cn(
                'relative h-screen bg-card border-r border-border transition-all duration-300 flex flex-col',
                collapsed ? 'w-20' : 'w-64'
            )}
        >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <LucianaLogo className="h-8" />
                        <span className="font-heading text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Admin
                        </span>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className="ml-auto"
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                                'hover:bg-[#F3E8FF]/50 dark:hover:bg-[#8B5CF6]/10',
                                isActive && 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary font-medium',
                                !isActive && 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary')} />
                            {!collapsed && <span className="text-sm">{item.title}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border">
                <Button
                    variant="ghost"
                    onClick={logout}
                    className={cn(
                        'w-full justify-start gap-3 text-muted-foreground hover:text-foreground',
                        collapsed && 'justify-center'
                    )}
                >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>Sair</span>}
                </Button>
            </div>
        </div>
    );
}
