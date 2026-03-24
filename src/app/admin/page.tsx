'use client';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import {
    Users,
    Calendar,
    BookOpen,
    Video,
    Image as ImageIcon,
    BookMarked,
    Briefcase,
    CalendarClock,
    MessageSquareQuote,
} from 'lucide-react';

const modules = [
    {
        title: 'Clientes',
        description: 'Gerencie pacientes e aprovações de acesso',
        href: '/admin/clientes',
        icon: Users,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
    },
    {
        title: 'Depoimentos',
        description: 'Adicione e gerencie depoimentos de pacientes',
        href: '/admin/depoimentos',
        icon: MessageSquareQuote,
        color: 'text-pink-500',
        bg: 'bg-pink-500/10',
    },
    {
        title: 'Eventos',
        description: 'Gerencie eventos e palestras realizados',
        href: '/admin/eventos',
        icon: Calendar,
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
    },
    {
        title: 'Eventos Futuros',
        description: 'Gerencie próximos eventos e inscrições',
        href: '/admin/eventos-futuros',
        icon: CalendarClock,
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
    },
    {
        title: 'Trajetória',
        description: 'Atualize sua história e conquistas profissionais',
        href: '/admin/trajetoria',
        icon: BookMarked,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
    },
    {
        title: 'Serviços',
        description: 'Cadastre atendimentos, cursos e supervisões',
        href: '/admin/servicos',
        icon: Briefcase,
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/10',
    },
    {
        title: 'Blog',
        description: 'Escreva e publique artigos e reflexões',
        href: '/admin/blog',
        icon: BookOpen,
        color: 'text-green-500',
        bg: 'bg-green-500/10',
    },
    {
        title: 'Vídeos',
        description: 'Adicione e gerencie vídeos e shorts do YouTube',
        href: '/admin/videos',
        icon: Video,
        color: 'text-red-500',
        bg: 'bg-red-500/10',
    },
    {
        title: 'Galeria',
        description: 'Organize fotos da sua trajetória e eventos',
        href: '/admin/galeria',
        icon: ImageIcon,
        color: 'text-teal-500',
        bg: 'bg-teal-500/10',
    },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-heading font-bold">Dashboard Administrativo</h1>
                <p className="text-muted-foreground mt-1">Bem-vinda! Selecione uma seção para gerenciar.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((mod) => {
                    const Icon = mod.icon;
                    return (
                        <Link
                            key={mod.href}
                            href={mod.href}
                            className="group p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all duration-200"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-lg ${mod.bg} shrink-0`}>
                                    <Icon className={`h-6 w-6 ${mod.color}`} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                        {mod.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {mod.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}