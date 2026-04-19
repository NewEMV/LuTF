'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollReveal } from '@/components/scroll-reveal';
import { InteractiveCalendar } from '@/components/interactive-calendar';
import { PageLoader } from '@/components/page-loader';
import { Button } from '@/components/ui/button';
import { Clock, XCircle } from 'lucide-react';

export default function AgendamentoPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // Não logado → redireciona para login
    if (!user) {
      router.push('/login');
      return;
    }

    // Admin → redireciona para o painel admin
    if (user.role === 'admin') {
      router.push('/admin');
    }
  }, [user, loading, router]);

  // Enquanto carrega o estado de auth
  if (loading) return <PageLoader />;

  // Não logado (aguardando redirect)
  if (!user) return <PageLoader />;

  // Admin (aguardando redirect)
  if (user.role === 'admin') return <PageLoader />;

  // Cadastro pendente de aprovação
  if (user.status === 'pending') {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto">
            <Clock className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-3xl font-headline font-bold">Cadastro em análise</h1>
          <p className="text-muted-foreground leading-relaxed">
            Seu cadastro está aguardando aprovação. Você receberá um e-mail assim que seu acesso for liberado pela Luciana.
          </p>
          <Button variant="outline" className="rounded-full" onClick={() => router.push('/')}>
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  // Cadastro negado
  if (user.status === 'denied') {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-headline font-bold">Acesso não autorizado</h1>
          <p className="text-muted-foreground leading-relaxed">
            Seu cadastro não foi aprovado. Entre em contato com a Luciana para mais informações.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" className="rounded-full" onClick={() => router.push('/')}>
              Voltar ao Início
            </Button>
            <Button className="rounded-full" onClick={() => router.push('/contato')}>
              Falar com a Luciana
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Cliente aprovado → exibe o calendário
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <main className="pt-32 px-4 max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-center mb-12">Agendamento</h1>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={100}>
          <InteractiveCalendar />
        </ScrollReveal>
      </main>
    </div>
  );
}
