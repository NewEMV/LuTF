'use client';
import { ScrollReveal } from '@/components/scroll-reveal';
import { InteractiveCalendar } from '@/components/interactive-calendar';

export default function AgendamentoPage() {
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
