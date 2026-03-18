'use client';
import { useState, useEffect } from 'react';
import {
    Calendar,
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Link as LinkIcon,
    Loader2,
    CalendarClock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    getFutureEvents,
    createFutureEvent,
    updateFutureEvent,
    deleteFutureEvent
} from '@/lib/future-events';
import type { FutureEvent, CreateFutureEventData } from '@/types/future-event';
import { Timestamp } from 'firebase/firestore';

export default function FutureEventsAdminPage() {
    const [events, setEvents] = useState<FutureEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<FutureEvent | null>(null);

    // Form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [link, setLink] = useState('');
    const [status, setStatus] = useState<'draft' | 'published'>('draft');

    const loadEvents = async () => {
        try {
            setLoading(true);
            const data = await getFutureEvents(true);
            setEvents(data);
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();
    }, []);

    const handleOpenDialog = (event?: FutureEvent) => {
        if (event) {
            setEditingEvent(event);
            setTitle(event.title);
            setDescription(event.description);
            // Format Timestamp to input date-time string
            const dateObj = event.date.toDate();
            const formattedDate = dateObj.toISOString().slice(0, 16);
            setDate(formattedDate);
            setLocation(event.location);
            setLink(event.link || '');
            setStatus(event.status);
        } else {
            setEditingEvent(null);
            setTitle('');
            setDescription('');
            setDate('');
            setLocation('');
            setLink('');
            setStatus('draft');
        }
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        try {
            const dateTimestamp = Timestamp.fromDate(new Date(date));
            const eventData: CreateFutureEventData = {
                title,
                description,
                date: dateTimestamp,
                location,
                link: link || "",
                status,
            };

            if (editingEvent) {
                await updateFutureEvent(editingEvent.id, eventData);
            } else {
                await createFutureEvent(eventData);
            }

            setIsDialogOpen(false);
            loadEvents();
        } catch (error) {
            console.error('Erro ao salvar evento:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este evento?')) {
            try {
                await deleteFutureEvent(id);
                loadEvents();
            } catch (error) {
                console.error('Erro ao deletar evento:', error);
            }
        }
    };

    const toggleStatus = async (event: FutureEvent) => {
        try {
            const newStatus = event.status === 'published' ? 'draft' : 'published';
            await updateFutureEvent(event.id, { status: newStatus });
            loadEvents();
        } catch (error) {
            console.error('Erro ao alterar status:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-headline font-bold">Eventos Futuros (Agenda)</h2>
                    <p className="text-muted-foreground">Gerencie os próximos eventos, palestras e encontros.</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="rounded-full">
                    <Plus className="w-4 h-4 mr-2" /> Novo Evento
                </Button>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Evento</TableHead>
                            <TableHead>Local</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    Nenhum evento futuro cadastrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            events.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">
                                        {event.date.toDate().toLocaleDateString('pt-BR')} {event.date.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-semibold">{event.title}</div>
                                        <div className="text-xs text-muted-foreground line-clamp-1">{event.description}</div>
                                    </TableCell>
                                    <TableCell className="text-xs">{event.location}</TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => toggleStatus(event)}
                                            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors ${event.status === 'published'
                                                ? 'bg-green-500/10 text-green-600 border-green-200'
                                                : 'bg-yellow-500/10 text-yellow-600 border-yellow-200'
                                                }`}
                                        >
                                            {event.status === 'published' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                            {event.status === 'published' ? 'Publicado' : 'Rascunho'}
                                        </button>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(event)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(event.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingEvent ? 'Editar Evento' : 'Novo Evento'}</DialogTitle>
                        <DialogDescription>
                            Preencha os detalhes do próximo evento ou palestra.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Título do Evento</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Palestra sobre Luto na Infância"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="date">Data e Hora</Label>
                                <Input
                                    id="date"
                                    type="datetime-local"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="location">Local / Plataforma</Label>
                                <Input
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Ex: Zoom, São Paulo/SP, etc."
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Descrição / Resumo</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                placeholder="Breve resumo do que será tratado no evento."
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="link">Link de Inscrição / Convite (Opcional)</Label>
                            <Input
                                id="link"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mt-2">
                            <div className="flex flex-col gap-0.5">
                                <Label>Status de Publicação</Label>
                                <span className="text-xs text-muted-foreground">Exibir na agenda da home.</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium">{status === 'published' ? 'Publicado' : 'Rascunho'}</span>
                                <Switch checked={status === 'published'} onCheckedChange={(checked) => setStatus(checked ? 'published' : 'draft')} />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={!title || !date || !location}>Salvar Evento</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
