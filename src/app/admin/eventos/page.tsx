'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Calendar,
    MapPin,
    Image as ImageIcon,
    Trash2,
    Edit2,
    Loader2,
    Users,
    ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog';
import {
    getEventos,
    createEvento,
    updateEvento,
    deleteEvento
} from '@/lib/eventos';
import { uploadImage } from '@/lib/galeria'; // Reusando função de upload
import type { Evento } from '@/types/evento';
import { Timestamp } from 'firebase/firestore';
import Image from 'next/image';

export default function EventosPage() {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
    const [uploading, setUploading] = useState(false);

    // Estado do formulário
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        coverImage: '',
        coverImageAlt: '',
        date: '',
        time: '',
        location: '',
        locationDetails: '',
        maxParticipants: 0,
        registrationOpen: true,
        metaTitle: '',
        metaDescription: ''
    });

    useEffect(() => {
        loadEventos();
    }, []);

    const loadEventos = async () => {
        setLoading(true);
        try {
            const data = await getEventos();
            setEventos(data);
        } catch (error) {
            console.error('Erro ao listar eventos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (evento: Evento | null = null) => {
        if (evento) {
            setEditingEvento(evento);
            const d = evento.date.toDate();
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            setFormData({
                title: evento.title,
                description: evento.description,
                coverImage: evento.coverImage,
                coverImageAlt: evento.coverImageAlt,
                date: dateStr,
                time: evento.time,
                location: evento.location,
                locationDetails: evento.locationDetails,
                maxParticipants: evento.maxParticipants || 0,
                registrationOpen: evento.registrationOpen,
                metaTitle: evento.metaTitle,
                metaDescription: evento.metaDescription
            });
        } else {
            setEditingEvento(null);
            setFormData({
                title: '',
                description: '',
                coverImage: '',
                coverImageAlt: '',
                date: '',
                time: '',
                location: '',
                locationDetails: '',
                maxParticipants: 0,
                registrationOpen: true,
                metaTitle: '',
                metaDescription: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadImage(file, 'event-covers');
            setFormData(prev => ({ ...prev, coverImage: url }));
        } catch (error) {
            console.error('Erro no upload da capa:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.date) return;

        try {
            const [year, month, day] = formData.date.split('-').map(Number);
            const dateObj = new Date(year, month - 1, day, 12, 0, 0);
            const timestamp = Timestamp.fromDate(dateObj);

            const payload = {
                ...formData,
                date: timestamp,
            };

            if (editingEvento) {
                await updateEvento(editingEvento.id, payload);
            } else {
                await createEvento(payload);
            }

            setIsModalOpen(false);
            loadEventos();
        } catch (error) {
            console.error('Erro ao salvar evento:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Deseja excluir este evento?')) return;
        try {
            await deleteEvento(id);
            loadEventos();
        } catch (error) {
            console.error('Erro ao excluir evento:', error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold">Gestão de Eventos</h1>
                    <p className="text-muted-foreground">Gerencie suas palestras, congressos e participações em congressos.</p>
                </div>

                <Button className="rounded-xl" onClick={() => handleOpenModal()}>
                    <Plus className="w-4 h-4 mr-2" /> Novo Evento
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {eventos.map(evento => (
                        <div key={evento.id} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-all">
                            <div className="relative w-full md:w-48 aspect-video md:aspect-square flex-shrink-0">
                                <Image
                                    src={evento.coverImage || 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80'}
                                    alt={evento.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6 flex-grow flex flex-col justify-between min-h-[160px]">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{evento.title}</h3>
                                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {evento.date.toDate().toLocaleDateString('pt-BR')} às {evento.time}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {evento.location}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{evento.description}</p>
                                </div>
                                <div className="flex justify-end gap-2 mt-6">
                                    <Button variant="outline" size="sm" onClick={() => handleOpenModal(evento)}>
                                        <Edit2 className="w-4 h-4 mr-2" /> Editar
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-rose-500 hover:bg-rose-50 border-rose-100" onClick={() => handleDelete(evento.id)}>
                                        <Trash2 className="w-4 h-4 mr-2" /> Excluir
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {eventos.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-3xl">
                            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Nenhum evento cadastrado para 2026 ainda.</p>
                        </div>
                    )}
                </div>
            )}

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingEvento ? 'Editar Evento' : 'Novo Evento'}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Título do Evento</label>
                                <Input
                                    placeholder="Ex: XII Congresso Todos Juntos Contra o Câncer"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Data</label>
                                    <Input
                                        type="date"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Horário</label>
                                    <Input
                                        placeholder="Ex: 09:00 - 18:00"
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Local</label>
                                <Input
                                    placeholder="Ex: WTC Events Center, SP"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Descrição</label>
                                <Textarea
                                    placeholder="Detalhes sobre a participação ou do evento..."
                                    rows={4}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 border-t pt-4">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Imagem de Capa</h3>
                            <div className="flex items-center gap-4">
                                <div className="relative w-32 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                    {formData.coverImage ? (
                                        <Image src={formData.coverImage} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="mb-2"
                                    />
                                    <p className="text-[10px] text-muted-foreground">Recomendado: 800x600px ou maior.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 border-t pt-4">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">SEO (Google)</h3>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Título Meta</label>
                                <Input
                                    placeholder="Como aparecerá no Google..."
                                    value={formData.metaTitle}
                                    onChange={e => setFormData({ ...formData, metaTitle: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Descrição Meta</label>
                                <Textarea
                                    placeholder="Breve resumo para os resultados de busca..."
                                    value={formData.metaDescription}
                                    onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSubmit} disabled={uploading}>
                            {editingEvento ? 'Salvar Alterações' : 'Criar Evento'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}




