'use client';
import Link from 'next/link';
import { LucianaLogo } from '@/components/luciana-logo';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';

export default function CookiesPage() {
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
                    <h1 className="text-4xl font-headline font-bold mb-8 text-primary">Aviso de Cookies</h1>
                    <div className="prose prose-purple dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                        <p>Utilizamos cookies para garantir que você tenha a melhor experiência em nosso site.</p>
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">1. O que são cookies?</h2>
                            <p>Cookies são pequenos arquivos de texto enviados ao seu navegador quando você visita um site. Eles ajudam o site a se lembrar de informações sobre sua visita.</p>
                        </section>
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">2. Tipos de cookies que utilizamos</h2>
                            <ul className="list-disc pl-6">
                                <li><strong>Cookies Essenciais:</strong> Necessários para o funcionamento básico do site.</li>
                                <li><strong>Cookies de Desempenho (Analytics):</strong> Utilizamos o Google Analytics para entender como os visitantes interagem com o site.</li>
                                <li><strong>Cookies de Preferência:</strong> Permitem que o site se lembre de escolhas que você faz (como tema claro/escuro).</li>
                            </ul>
                        </section>
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">3. Como gerenciar cookies</h2>
                            <p>Você pode controlar e/ou excluir cookies conforme desejar através das configurações do seu navegador.</p>
                        </section>
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">4. Google Analytics</h2>
                            <p>Nosso site utiliza o Google Analytics. Para mais informações, consulte a Política de Privacidade do Google.</p>
                        </section>
                        <p className="pt-8 text-xs italic">Última atualização: 18 de fevereiro de 2026.</p>
                    </div>
                </ScrollReveal>
            </main>
        </div>
    );
}
