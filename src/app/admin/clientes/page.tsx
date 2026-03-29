'use client';

import { useState, useEffect } from 'react';
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    UserCircle,
    Phone,
    Mail
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'pending' | 'approved' | 'denied';
    subject?: string;
    createdAt: any;
}

export default function ClientesPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchClients = async () => {
        setLoading(true);
        try {
            const q = query(
                collection(db, 'users'),
                where('role', '==', 'client'),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const clientsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Client[];
            setClients(clientsData);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const updateStatus = async (clientId: string, newStatus: 'approved' | 'denied' | 'pending') => {
        try {
            const clientRef = doc(db, 'users', clientId);
            await updateDoc(clientRef, { status: newStatus });

            // Notifica o lead se foi aprovado
            if (newStatus === 'approved') {
                const client = clients.find(c => c.id === clientId);
                if (client) {
                    await fetch('/api/notify-approved-user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: client.name, email: client.email }),
                    });
                }
            }

            setClients(clients.map(c => c.id === clientId ? { ...c, status: newStatus } : c));
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
        }
    };

    const filteredClients = clients.filter(client =>
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.includes(searchTerm) ||
        client.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle2 className="text-green-500 w-5 h-5" />;
            case 'denied': return <XCircle className="text-red-500 w-5 h-5" />;
            default: return <Clock className="text-amber-500 w-5 h-5" />;
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'denied': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'approved': return 'Aprovado';
            case 'denied': return 'Negado';
            default: return 'Pendente';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-heading font-bold">Gestão de Clientes</h2>
                    <p className="text-muted-foreground">Aprovação de cadastros e lista de pacientes</p>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Buscar por nome, email ou telefone..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border">
                                <th className="p-4 font-semibold text-sm">Paciente</th>
                                <th className="p-4 font-semibold text-sm">Contato</th>
                                <th className="p-4 font-semibold text-sm">Assunto</th>
                                <th className="p-4 font-semibold text-sm">Status</th>
                                <th className="p-4 font-semibold text-sm">Data de Cadastro</th>
                                <th className="p-4 font-semibold text-sm text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-sm">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="p-6 text-center text-muted-foreground">Carregando pacientes...</td>
                                    </tr>
                                ))
                            ) : filteredClients.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-muted-foreground">
                                        Nenhum paciente encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filteredClients.map((client) => (
                                    <tr key={client.id} className="hover:bg-accent/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                                    <UserCircle className="w-7 h-7" />
                                                </div>
                                                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                    {client.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    <span>{client.email}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    <span>{client.phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="max-w-[200px] truncate text-muted-foreground italic text-xs" title={client.subject}>
                                                {client.subject || 'Sem assunto específico'}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 w-fit ${getStatusStyles(client.status)}`}>
                                                {getStatusIcon(client.status)}
                                                {getStatusText(client.status)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-muted-foreground italic">
                                            {client.createdAt?.toDate ?
                                                new Date(client.createdAt.toDate()).toLocaleString('pt-BR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }) :
                                                'Data não disponível'}
                                        </td>
                                        <td className="p-4 text-right">
                                            {client.status === 'pending' ? (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                                                        onClick={() => updateStatus(client.id, 'approved')}
                                                    >
                                                        Aprovar
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                                        onClick={() => updateStatus(client.id, 'denied')}
                                                    >
                                                        Negar
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => updateStatus(client.id, 'pending')}
                                                    className="text-xs text-muted-foreground hover:text-foreground"
                                                >
                                                    Reverter para Pendente
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
