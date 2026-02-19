'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Save,
    Trash2,
    MessageSquare,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Quote,
    Eye,
    EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
    getTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
} from '@/lib/testimonials';
import type { Testimonial } from '@/types/testimonial';

export default function TestimonialsAdminPage() {
    const [items, setItems] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        loadTestimonials();
    }, []);

    const loadTestimonials = async () => {
        try {
            const data = await getTestimonials(true);
            setItems(data);

            // Seed fake testimonial if empty
            if (data.length === 0) {
                await handleAddInitial();
            }
        } catch (error) {
            console.error('Error loading testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddInitial = async () => {
        const initial = {
            name: 'Luana Oliveira',
            role: 'Paciente',
            content: 'O suporte da Luciana foi essencial para eu atravessar o momento mais difícil da minha vida. Gratidão pelo acolhimento.',
            status: 'published' as const,
            order: 0
        };
        await createTestimonial(initial as any);
        const data = await getTestimonials(true);
        setItems(data);
    };

    const handleAddItem = async () => {
        const newItem = {
            name: 'Nome da Pessoa',
            role: 'Qualificação (ex: Paciente)',
            content: 'Escreva o depoimento aqui...',
            status: 'draft' as const,
            order: items.length
        };
        try {
            setSaving(true);
            await createTestimonial(newItem as any);
            loadTestimonials();
            setMessage({ type: 'success', text: 'Depoimento adicionado!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao adicionar.' });
        } finally {
            setSaving(false);
            loadTestimonials();
        }
    };

    const handleUpdateItem = async (id: string, updates: any) => {
        try {
            setSaving(true);
            await updateTestimonial(id, updates);
            setItems(items.map(item => item.id === id ? { ...item, ...updates } : item));
            setMessage({ type: 'success', text: 'Salvo com sucesso!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao salvar.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 2000);
        }
    };

    const handleDeleteItem = async (id: string) => {
        if (!confirm('Deseja excluir este depoimento?')) return;
        try {
            setSaving(true);
            await deleteTestimonial(id);
            setItems(items.filter(item => item.id !== id));
            setMessage({ type: 'success', text: 'Excluído!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao excluir.' });
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
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-headline font-bold text-foreground">Depoimentos</h2>
                    <p className="text-muted-foreground">Gerencie as histórias de acolhimento que aparecem no site.</p>
                </div>
                <Button onClick={handleAddItem} disabled={saving} className="rounded-full">
                    <Plus className="mr-2 h-4 w-4" /> Novo Depoimento
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
                {items.map((item) => (
                    <Card key={item.id} className={`p-6 border-l-4 transition-all ${item.status === 'published' ? 'border-l-primary' : 'border-l-muted'
                        }`}>
                        <div className="space-y-4">
                            <div className="flex justify-between items-start gap-4">
                                <div className="grid grid-cols-2 gap-4 flex-1">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nome</label>
                                        <Input
                                            value={item.name}
                                            onChange={(e) => setItems(prev => prev.map(i => i.id === item.id ? { ...i, name: e.target.value } : i))}
                                            onBlur={(e) => handleUpdateItem(item.id, { name: e.target.value })}
                                            className="rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Qualificação / Papel</label>
                                        <Input
                                            value={item.role}
                                            onChange={(e) => setItems(prev => prev.map(i => i.id === item.id ? { ...i, role: e.target.value } : i))}
                                            onBlur={(e) => handleUpdateItem(item.id, { role: e.target.value })}
                                            placeholder="Ex: Paciente Oncológica"
                                            className="rounded-xl"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleUpdateItem(item.id, { status: item.status === 'published' ? 'draft' : 'published' })}
                                        className="rounded-full gap-2"
                                    >
                                        {item.status === 'published' ? <Eye size={16} /> : <EyeOff size={16} />}
                                        {item.status === 'published' ? 'Público' : 'Rascunho'}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2 relative">
                                <Quote className="absolute -top-2 -left-2 text-primary/10" size={32} />
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Conteúdo do Depoimento</label>
                                <Textarea
                                    value={item.content}
                                    onChange={(e) => setItems(prev => prev.map(i => i.id === item.id ? { ...i, content: e.target.value } : i))}
                                    onBlur={(e) => handleUpdateItem(item.id, { content: e.target.value })}
                                    className="rounded-2xl min-h-[100px] bg-secondary/20 italic"
                                />
                            </div>

                            <div className="flex justify-between items-center text-xs text-muted-foreground pt-2">
                                <div className="flex items-center gap-2">
                                    <span>Ordem de exibição:</span>
                                    <Input
                                        type="number"
                                        value={item.order}
                                        onChange={(e) => handleUpdateItem(item.id, { order: parseInt(e.target.value) })}
                                        className="w-12 h-7 rounded text-center"
                                    />
                                </div>
                                {saving && <span className="animate-pulse">Salvando...</span>}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
