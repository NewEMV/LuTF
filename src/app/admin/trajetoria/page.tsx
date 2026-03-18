'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Save,
    Trash2,
    GripVertical,
    Image as ImageIcon,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ImageUpload } from '@/components/image-upload';
import {
    getTrajectory,
    createTrajectoryItem,
    updateTrajectoryItem,
    deleteTrajectoryItem
} from '@/lib/trajectory';
import type { TrajectoryItem } from '@/types/trajectory';

export default function TrajectoryAdminPage() {
    const [items, setItems] = useState<TrajectoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        loadTrajectory();
    }, []);

    const loadTrajectory = async () => {
        try {
            const data = await getTrajectory();
            setItems(data);
        } catch (error) {
            console.error('Error loading trajectory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async () => {
        const newItem = {
            title: 'Nova Etapa',
            description: 'Descrição da etapa...',
            imageUrl: '',
            order: items.length
        };
        try {
            setSaving(true);
            const id = await createTrajectoryItem(newItem as any);
            await loadTrajectory();
            setMessage({ type: 'success', text: 'Item adicionado com sucesso!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao adicionar item.' });
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateItem = async (id: string, updates: any) => {
        try {
            setSaving(true);
            await updateTrajectoryItem(id, updates);
            setItems(items.map(item => item.id === id ? { ...item, ...updates } : item));
            setMessage({ type: 'success', text: 'Alterações salvas!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao salvar alterações.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleDeleteItem = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta etapa da trajetória?')) return;
        try {
            setSaving(true);
            await deleteTrajectoryItem(id);
            await loadTrajectory();
            setMessage({ type: 'success', text: 'Item excluído!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao excluir item.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-headline font-bold text-foreground">Gerenciar Trajetória</h2>
                    <p className="text-muted-foreground">Adicione ou edite as etapas da sua jornada profissional.</p>
                </div>
                <Button onClick={handleAddItem} disabled={saving} className="rounded-full">
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Etapa
                </Button>
            </div>

            {message && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            <div className="grid gap-6">
                {items.length === 0 ? (
                    <Card className="p-12 text-center border-dashed border-2">
                        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground font-medium">Nenhuma etapa cadastrada ainda.</p>
                        <Button variant="outline" onClick={handleAddItem} className="mt-4 rounded-full">
                            Começar agora
                        </Button>
                    </Card>
                ) : (
                    items.map((item, index) => (
                        <Card key={item.id} className="p-6 transition-all hover:shadow-md">
                            <div className="grid md:grid-cols-[250px_1fr] gap-8">
                                <div className="space-y-4">
                                    <label className="text-sm font-bold block mb-2">Imagem de Fundo</label>
                                    <ImageUpload
                                        value={item.imageUrl}
                                        onChange={(url) => handleUpdateItem(item.id, { imageUrl: url })}
                                        storagePath="trajectory"
                                    />
                                    <p className="text-[10px] text-muted-foreground text-center italic">Recomendado: 1200x800px</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-[1fr_auto] gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold">Título da Etapa</label>
                                            <Input
                                                value={item.title}
                                                onChange={(e) => setItems(prev => prev.map(i => i.id === item.id ? { ...i, title: e.target.value } : i))}
                                                onBlur={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                                                placeholder="Ex: Atendimento Clínico"
                                                className="rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2 flex flex-col justify-end">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteItem(item.id)}
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 size={20} />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold">Breve Descrição</label>
                                        <Textarea
                                            value={item.description}
                                            onChange={(e) => setItems(prev => prev.map(i => i.id === item.id ? { ...i, description: e.target.value } : i))}
                                            onBlur={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                                            placeholder="Descreva o que esta etapa representa..."
                                            className="rounded-xl min-h-[100px] bg-secondary/30"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 pt-2">
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs font-bold text-muted-foreground">Ordem:</label>
                                            <Input
                                                type="number"
                                                value={item.order}
                                                onChange={(e) => handleUpdateItem(item.id, { order: parseInt(e.target.value) })}
                                                className="w-16 h-8 rounded-lg text-center"
                                            />
                                        </div>
                                        <div className="flex-1 flex justify-end">
                                            {saving && <Loader2 className="animate-spin text-primary h-4 w-4" />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
