'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollReveal } from '@/components/scroll-reveal';
import { CardMovingBorder } from '@/components/card-moving-border';

const contactSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Whatsapp inválido'),
  subject: z.string().min(10, 'Por favor, detalhe um pouco mais o motivo da conversa (mín. 10 caracteres)'),
});
type ContactFormData = z.infer<typeof contactSchema>;

export default function ContatoPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    setError('');

    try {
        await addDoc(collection(db, 'mensagens_contato'), {
            name: data.name,
            email: data.email,
            phone: data.phone,
            subject: data.subject,
            createdAt: serverTimestamp(),
            status: 'pendente'
        });
        setSuccess(true);
        reset();
    } catch (err: any) {
        console.error('Erro no onSubmit:', err);
        setError(err.message || 'Erro ao enviar mensagem');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <main className="pt-32 px-4 max-w-3xl mx-auto">
        <ScrollReveal direction="up">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-center mb-4">Contato</h1>
          <p className="text-center text-muted-foreground mb-12">
            Preencha seus dados para conversarmos
          </p>
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={100}>
          <CardMovingBorder className="p-8 shadow-2xl bg-card border border-border" borderRadius="2rem">
            {success ? (
                <div className="p-12 text-center">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 font-headline">Mensagem Enviada!</h3>
                    <p className="text-muted-foreground">
                        Sua mensagem foi enviada para a Luciana. Em breve ela entrará em contato.
                    </p>
                    <Button className="mt-8" onClick={() => setSuccess(false)}>Enviar outra mensagem</Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-200 text-sm">
                            {error}
                        </div>
                    )}
                    <div>
                        <Label htmlFor="contact_name">Nome Completo</Label>
                        <Input id="contact_name" {...register('name')} placeholder="João Silva" className="mt-2" />
                        {errors.name && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="contact_email">E-mail</Label>
                        <Input id="contact_email" type="email" {...register('email')} placeholder="joao@exemplo.com" className="mt-2" />
                        {errors.email && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="contact_phone">Whatsapp</Label>
                        <Input id="contact_phone" {...register('phone')} placeholder="(11) 99999-9999" className="mt-2" />
                        {errors.phone && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="contact_subject">Motivo da conversa</Label>
                        <Input id="contact_subject" {...register('subject')} placeholder="Ex: Gostaria de saber mais sobre..." className="mt-2" />
                        {errors.subject && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.subject.message}</p>}
                    </div>
                    <Button type="submit" size="lg" className="w-full mt-4" disabled={loading}>
                        {loading ? 'Enviando...' : 'Enviar Mensagem'}
                    </Button>
                </form>
            )}
          </CardMovingBorder>
        </ScrollReveal>
      </main>
    </div>
  );
}
