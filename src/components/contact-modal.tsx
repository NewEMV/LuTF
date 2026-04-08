'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const contactSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(10, 'Whatsapp inválido'),
    subject: z.string().min(10, 'Por favor, detalhe um pouco mais o motivo da conversa (mín. 10 caracteres)'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactModalProps {
    open: boolean;
    onClose: () => void;
}

export function ContactModal({ open, onClose }: ContactModalProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        setLoading(true);
        setError('');

        try {
            // Salvar no Firestore
            await addDoc(collection(db, 'mensagens_contato'), {
                name: data.name,
                email: data.email,
                phone: data.phone,
                subject: data.subject,
                createdAt: serverTimestamp(),
                status: 'pendente'
            });

            // O email será enviado automaticamente por uma Firebase Function engatilhada por essa inserção no banco

            setSuccess(true);
            reset();

            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 3000);
        } catch (err: any) {
            console.error('Erro no onSubmit:', err);
            setError(err.message || 'Erro ao enviar mensagem');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        reset();
        setError('');
        setSuccess(false);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-headline">Contato</DialogTitle>
                    <DialogDescription>
                        Preencha seus dados para conversarmos
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Mensagem Enviada!</h3>
                        <p className="text-muted-foreground">
                            Sua mensagem foi enviada para a Luciana. Em breve ela entrará em contato.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <Label htmlFor="contact_name">Nome Completo</Label>
                            <Input
                                id="contact_name"
                                {...register('name')}
                                placeholder="João Silva"
                                className="mt-1"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="contact_email">E-mail</Label>
                            <Input
                                id="contact_email"
                                type="email"
                                {...register('email')}
                                placeholder="joao@exemplo.com"
                                className="mt-1"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="contact_phone">Whatsapp</Label>
                            <Input
                                id="contact_phone"
                                {...register('phone')}
                                placeholder="(11) 99999-9999"
                                className="mt-1"
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.phone.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="contact_subject">Motivo da conversa</Label>
                            <Input
                                id="contact_subject"
                                {...register('subject')}
                                placeholder="Ex: Gostaria de saber mais sobre..."
                                className="mt-1"
                            />
                            {errors.subject && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.subject.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar Mensagem'}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
