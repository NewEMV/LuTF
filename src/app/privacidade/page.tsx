'use client';
import Link from 'next/link';
import { LucianaLogo } from '@/components/luciana-logo';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <nav className="fixed w-full z-50 bg-white/50 dark:bg-gray-900/40 backdrop-blur-2xl shadow-sm py-4">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <LucianaLogo className="w-8 h-8 transition-transform group-hover:rotate-12" />
                        <span className="text-2xl font-allison pt-1">luciana telles</span>
                    </Link>
                    <Button variant="outline" size="sm" asChild className="rounded-full">
                        <Link href="/">Voltar ao Início</Link>
                    </Button>
                </div>
            </nav>

            <main className="pt-32 px-4 max-w-4xl mx-auto">
                <ScrollReveal direction="up">
                    <h1 className="text-4xl font-headline font-bold mb-8 text-primary">Política de Privacidade</h1>

                    <div className="prose prose-purple dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                        <p>
                            Esta Política de Privacidade descreve como suas informações pessoais são coletadas, usadas e compartilhadas quando você visita o site de Luciana Telles Ferri.
                        </p>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">1. Informações que coletamos</h2>
                            <p>
                                Quando você se cadastra no site para solicitar um contato ou agendamento, coletamos as seguintes informações:
                            </p>
                            <ul className="list-disc pl-6">
                                <li>Nome completo</li>
                                <li>E-mail</li>
                                <li>Número de telefone</li>
                                <li>Assunto específico do contato</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">2. Como usamos suas informações</h2>
                            <p>
                                Usamos as informações coletadas para:
                            </p>
                            <ul className="list-disc pl-6">
                                <li>Entrar em contato para agendamentos de consultas ou eventos.</li>
                                <li>Fornecer suporte e informações solicitadas por você.</li>
                                <li>Melhorar a experiência do usuário em nosso site.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">3. Compartilhamento de informações</h2>
                            <p>
                                Não vendemos nem compartilhamos suas informações pessoais com terceiros, exceto quando necessário para cumprir obrigações legais ou com o seu consentimento explícito.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">4. Segurança</h2>
                            <p>
                                Tomamos medidas de segurança adequadas para proteger seus dados contra acesso não autorizado, alteração ou destruição.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">5. Seus Direitos</h2>
                            <p>
                                Você tem o direito de acessar, corrigir ou excluir as informações pessoais que possuímos sobre você. Para isso, entre em contato através do e-mail oficial disponível no site.
                            </p>
                        </section>

                        <p className="pt-8 text-xs italic">
                            Última atualização: 18 de fevereiro de 2026.
                        </p>
                    </div>
                </ScrollReveal>
            </main>
        </div>
    );
}
