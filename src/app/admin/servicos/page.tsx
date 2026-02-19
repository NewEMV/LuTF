'use client';
import { useState, useEffect } from 'react';
import {
    LayoutGrid,
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    HandHeart,
    Loader2,
    MoveUp,
    MoveDown
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    getServices,
    createService,
    updateService,
    deleteService,
    seedServices
} from '@/lib/services';
import type { Service, ServiceCategory, CreateServiceData } from '@/types/service';
import { toast } from '@/components/ui/toast'; // Assuming toast exists based on file list

const CATEGORIES: { value: ServiceCategory; label: string }[] = [
    { value: 'supervisao', label: 'Supervisão Clínica' },
    { value: 'atendimento', label: 'Atendimento Individual' },
    { value: 'grupos', label: 'Grupos Terapêuticos' },
    { value: 'aulas', label: 'Aulas Abertas' },
    { value: 'cursos-palestras', label: 'Cursos e Palestras' },
];

export default function ServicesAdminPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    // Form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<ServiceCategory>('atendimento');
    const [dateInfo, setDateInfo] = useState('');
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState<'draft' | 'public'>('draft');
    const [withOphicina, setWithOphicina] = useState(false);

    const loadServices = async () => {
        try {
            setLoading(true);
            let data = await getServices(true);

            // Se estiver vazio, tenta rodar o seed
            if (data.length === 0) {
                await seedServices();
                data = await getServices(true);
            }

            setServices(data);
        } catch (error) {
            console.error('Erro ao carregar serviços:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServices();
    }, []);

    const handleOpenDialog = (service?: Service) => {
        if (service) {
            setEditingService(service);
            setTitle(service.title);
            setDescription(service.description);
            setCategory(service.category);
            setDateInfo(service.dateInfo || '');
            setPrice(service.price || '');
            setStatus(service.status);
            setWithOphicina(service.withOphicina);
        } else {
            setEditingService(null);
            setTitle('');
            setDescription('');
            setCategory('atendimento');
            setDateInfo('');
            setPrice('');
            setStatus('draft');
            setWithOphicina(false);
        }
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        try {
            const serviceData: CreateServiceData = {
                title,
                description,
                category,
                dateInfo,
                price,
                status,
                withOphicina,
                order: editingService ? editingService.order : services.length,
            };

            if (editingService) {
                await updateService(editingService.id, serviceData);
            } else {
                await createService(serviceData);
            }

            setIsDialogOpen(false);
            loadServices();
        } catch (error) {
            console.error('Erro ao salvar serviço:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este serviço?')) {
            try {
                await deleteService(id);
                loadServices();
            } catch (error) {
                console.error('Erro ao deletar serviço:', error);
            }
        }
    };

    const toggleStatus = async (service: Service) => {
        try {
            const newStatus = service.status === 'public' ? 'draft' : 'public';
            await updateService(service.id, { status: newStatus });
            loadServices();
        } catch (error) {
            console.error('Erro ao alterar status:', error);
        }
    };

    const moveOrder = async (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= services.length) return;

        try {
            const service1 = services[index];
            const service2 = services[newIndex];

            await Promise.all([
                updateService(service1.id, { order: service2.order }),
                updateService(service2.id, { order: service1.order })
            ]);

            loadServices();
        } catch (error) {
            console.error('Erro ao reordenar:', error);
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
                    <h2 className="text-3xl font-headline font-bold">Gestão de Serviços</h2>
                    <p className="text-muted-foreground">Cadastre atendimentos, cursos e supervisões.</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="rounded-full">
                    <Plus className="w-4 h-4 mr-2" /> Novo Serviço
                </Button>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Serviço</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Parceria</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map((service, index) => (
                            <TableRow key={service.id}>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={() => moveOrder(index, 'up')}
                                            disabled={index === 0}
                                            className="text-muted-foreground hover:text-primary disabled:opacity-30"
                                        >
                                            <MoveUp className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() => moveOrder(index, 'down')}
                                            disabled={index === services.length - 1}
                                            className="text-muted-foreground hover:text-primary disabled:opacity-30"
                                        >
                                            <MoveDown className="w-3 h-3" />
                                        </button>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{service.title}</div>
                                    <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                                        {service.description}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="capitalize text-xs bg-muted px-2 py-1 rounded-full">
                                        {CATEGORIES.find(c => c.value === service.category)?.label}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <button
                                        onClick={() => toggleStatus(service)}
                                        className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors ${service.status === 'public'
                                                ? 'bg-green-500/10 text-green-600 border-green-200'
                                                : 'bg-yellow-500/10 text-yellow-600 border-yellow-200'
                                            }`}
                                    >
                                        {service.status === 'public' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                        {service.status === 'public' ? 'Público' : 'Rascunho'}
                                    </button>
                                </TableCell>
                                <TableCell>
                                    {service.withOphicina && (
                                        <div className="flex items-center gap-1 text-xs text-primary font-semibold">
                                            <HandHeart className="w-3 h-3" /> Ophicina
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(service)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(service.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingService ? 'Editar Serviço' : 'Novo Serviço'}</DialogTitle>
                        <DialogDescription>
                            Preencha os detalhes do serviço abaixo.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Título</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Supervisão Clínica em Psico-Oncologia"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category">Categoria</Label>
                            <Select value={category} onValueChange={(v: ServiceCategory) => setCategory(v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Descrição Detalhada</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                placeholder="Descreva o que é oferecido, público-alvo, etc."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="dateInfo">Data/Horário (Opcional)</Label>
                                <Input
                                    id="dateInfo"
                                    value={dateInfo}
                                    onChange={(e) => setDateInfo(e.target.value)}
                                    placeholder="Ex: Terças às 19h"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="price">Valor (Opcional)</Label>
                                <Input
                                    id="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="Ex: R$ 250,00"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                            <div className="flex flex-col gap-0.5">
                                <Label>Parceria com a Ophicina</Label>
                                <span className="text-xs text-muted-foreground">Exibir selo de parceria no site.</span>
                            </div>
                            <Switch checked={withOphicina} onCheckedChange={setWithOphicina} />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                            <div className="flex flex-col gap-0.5">
                                <Label>Status de Publicação</Label>
                                <span className="text-xs text-muted-foreground">Tornar este serviço visível no site.</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium">{status === 'public' ? 'Público' : 'Rascunho'}</span>
                                <Switch checked={status === 'public'} onCheckedChange={(checked) => setStatus(checked ? 'public' : 'draft')} />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave}>Salvar Alterações</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
