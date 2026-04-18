'use client';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";
import {
  Sparkles,
  HandHeart,
  ArrowRight,
  Award,
  Calendar,
  Speech,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ScrollReveal } from '@/components/scroll-reveal';
import { TestimonialsCarousel } from '@/components/testimonials-carousel';
import { PageLoader } from '@/components/page-loader';
import { ScrollProgress, BackToTop } from '@/components/scroll-components';
import { CardMovingBorder } from '@/components/card-moving-border';
import { useAuth } from '@/contexts/AuthContext';
import { getEventos } from '@/lib/eventos';
import { getFutureEvents } from '@/lib/future-events';
import type { Evento } from '@/types/evento';

const heroImage = PlaceHolderImages.find(p => p.id === 'hero-portrait');

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [realEventos, setRealEventos] = useState<Evento[]>([]);
  const [futureEvents, setFutureEvents] = useState<any[]>([]);
  const [modalContent, setModalContent] = useState<{ title: string; text: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const results = await Promise.allSettled([
          getEventos(4),
          getFutureEvents(false)
        ]);

        if (results[0].status === 'fulfilled') setRealEventos(results[0].value);
        if (results[1].status === 'fulfilled') setFutureEvents(results[1].value);

      } catch (error) {
        console.error("Erro geral ao carregar dados reais:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAgendarConsulta = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.status === 'pending') {
      alert('Seu cadastro está aguardando aprovação. Você receberá um email quando for aprovado.');
      return;
    }

    if (user.status === 'denied') {
      alert('Seu cadastro foi negado. Entre em contato para mais informações.');
      return;
    }

    if (user.role === 'client' && user.status === 'approved') {
      window.open('/agenda', '_blank');
    } else if (user.role === 'admin') {
      router.push('/admin');
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      <ScrollProgress />
      <div className="min-h-screen">
        <main>
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-4">
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl opacity-60"></div>
            <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">
              <ScrollReveal direction="left" className="lg:w-1/2 space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-muted text-muted-foreground rounded-full text-sm font-bold uppercase tracking-widest animate-bounce-slow">
                  <Sparkles size={16} /> Seja Gentil com Você!
                </div>
                <h1 className="text-5xl md:text-7xl font-headline text-foreground leading-tight">
                  Acolher o <span className="text-primary">desafio</span> com <span className="text-primary">dignidade</span>.
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 font-medium">
                  Psicóloga dedicada ao suporte e cuidado especializado em fases de transição.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Button onClick={() => router.push('/contato')} variant="outline" size="lg" className="px-8 py-5 text-lg rounded-2xl h-auto hover-lift border-primary text-primary hover:bg-primary/5">Contato</Button>
                  <Button onClick={handleAgendarConsulta} size="lg" className="px-8 py-5 text-lg rounded-2xl h-auto hover-lift bg-primary hover:bg-primary/90 text-primary-foreground">Agendamento</Button>
                  <Button onClick={() => router.push('/trajetoria')} variant="outline" size="lg" className="px-8 py-5 text-lg rounded-2xl h-auto">Ver Trajetória</Button>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={200} className="lg:w-1/2 relative">
                <div className="aspect-[4/5] bg-secondary rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-background animate-float flex items-center justify-center hover-lift">
                  {heroImage && <Image src={heroImage.imageUrl} alt={heroImage.description} width={400} height={500} data-ai-hint={heroImage.imageHint || ''} className="object-cover w-full h-full" />}
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Temas Centrais */}
          <section className="py-24 bg-secondary/50 px-4">
            <div className="max-w-7xl mx-auto text-center mb-16">
              <ScrollReveal direction="up">
                <h2 className="text-4xl font-headline mb-4">Temas Centrais</h2>
                <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
              </ScrollReveal>
            </div>
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
              {[
                {
                  title: "Psico-Oncologia",
                  icon: "speech",
                  color: "bg-purple-600",
                  desc: "Acolhimento e intervenção a pessoas com câncer e familiares desde o diagnóstico, no tratamento, reabilitação e luto.",
                  full: "A Psico-oncologia é o cuidado que olha para além do diagnóstico.\nÉ a escuta que acolhe o medo após a notícia difícil.\nÉ o espaço onde a dor pode ser nomeada.\nÉ o apoio nas decisões complexas, nas mudanças do corpo, nas incertezas do tratamento.\n\nA Psico-oncologia cuida do paciente, da família e também da equipe de saúde, integrando o olhar técnico à dimensão humana do adoecer.\n\nDo diagnóstico aos cuidados paliativos, da esperança à elaboração do luto, seu papel é sustentar sentido, dignidade e qualidade de vida — mesmo em meio à vulnerabilidade.\n\nPorque onde há vida, há subjetividade.\nE onde há subjetividade, há cuidado possível."
                },
                {
                  title: "Cuidados Paliativos",
                  icon: "butterfly",
                  color: "bg-purple-600",
                  desc: "Qualidade de vida e manejo emocional de doenças graves.",
                  full: "Os cuidados paliativos NÃO é sobre abandono e SIM  \"Há o que fazer, junto de\" e desde o diagnóstico de uma doença grave e que ameace a continuidade da vida.\n\nÉ oferecer, junto a sua equipe médica, uma jornada de cuidado mais próximo do que é importante para você, respeitando sua dignidade.\n\nDoenças graves atravessam o corpo — mas também atravessam a identidade, os vínculos, os projetos e o sentido da existência.\n\nOs cuidados paliativos atuam justamente nesse território sensível:\n✔️ Acolhendo o sofrimento emocional\n✔️ Favorecendo comunicação clara e ética\n✔️ Sustentando decisões difíceis\n✔️ Cuidando da família e da rede de apoio\n✔️ Promovendo qualidade de vida e alívio possível do sofrimento\n\nO manejo emocional não é um detalhe do tratamento — ele é parte essencial do cuidado. Há sempre alguém ali, com história, valores, medos e desejos. Cuidar é também sustentar o que é humano quando a vida se torna frágil."
                },
                {
                  title: "Clínica do Luto",
                  icon: "handheart",
                  color: "bg-purple-600",
                  desc: "Acolhimento aos processos de perdas. Suporte a dor da ausência.",
                  full: "O luto é um processo natural diante de uma perda significativa. É uma resposta complexa à perda, para além da morte de pessoas e pets (animais), ampliando para términos, doenças ou mudanças significativas.\n\nCada pessoa vivencia a perda de maneira singular, conforme sua história, vínculo estabelecido, contexto da morte ou da ruptura.\n\nA Clínica do Luto oferece atendimento psicológico fundamentado em referenciais técnicos sobre processos de perda, luto antecipatório e luto complicado/prolongado.\n\nO acompanhamento é indicado para pessoas que apresentam:\n\n• Necessidade de acolhimento ao luto, compreensão do processo e enfrentamento ao novo cenário que se apresenta;\n• Sofrimento intenso e persistente após uma perda;\n• Dificuldade de retomar atividades e vínculos;\n• Sentimentos recorrentes de culpa, ambivalência ou revolta;\n• Impacto significativo no sono, apetite e funcionamento diário;\n• Lutos traumáticos ou inesperados;\n• Lutos que se tornaram prolongados ou difíceis de elaborar;\n• Perdas gestacionais e neonatais;\n• Perdas de pet (animais);\n• Perdas traumáticas ou inesperadas;\n• Vivência de luto antecipatório diante de doenças graves.\n\nO objetivo do atendimento é:\n\n✔️ Favorecer a elaboração psíquica da perda\n✔️ Auxiliar na integração da ausência à história de vida\n✔️ Prevenir complicações emocionais associadas ao luto\n✔️ Promover reorganização interna e adaptação à nova realidade\n✔️ Ressignificar a história preservando a história de vínculo.\n\nO processo terapêutico respeita o tempo individual, prioriza escuta qualificada e atua na construção de sentidos possíveis diante da perda.\n\nVocê não precisa atravessar o luto sozinho(a)."
                },
              ].map((item, idx) => (
                <ScrollReveal key={idx} direction="up" delay={idx * 100}>
                  <CardMovingBorder className="bg-card shadow-sm transition-all duration-300 group" borderRadius="2.5rem">
                    <div className="p-10">
                      <div className={`w-14 h-14 ${item.color} text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        {item.icon === 'butterfly' ? (
                          <Image src="/images/butterfly.png" alt="Borboleta" width={28} height={28} className="invert" />
                        ) : item.icon === 'speech' ? (
                          <Speech size={28} />
                        ) : (
                          <HandHeart size={28} />
                        )}
                      </div>
                      <h3 className="text-2xl font-headline mb-4">{item.title}</h3>
                      <p className="text-muted-foreground mb-6">{item.desc}</p>
                      <button onClick={() => setModalContent({ title: item.title, text: item.full })} className="font-bold text-primary flex items-center gap-2 group-hover:gap-4 transition-all">
                        Saiba mais <ArrowRight size={18} />
                      </button>
                    </div>
                  </CardMovingBorder>
                </ScrollReveal>
              ))}
            </div>
          </section>

          <TestimonialsCarousel />

          {/* Agenda / Eventos Futuros */}
          {futureEvents.length > 0 && (
            <section className="py-24 bg-card px-4 border-y border-border">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                  <div className="space-y-4">
                    <ScrollReveal direction="up">
                      <span className="px-4 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-widest">
                        Agenda Aberta
                      </span>
                      <h2 className="text-4xl md:text-5xl font-headline font-bold mt-4">Próximos Eventos</h2>
                      <p className="text-muted-foreground max-w-xl">
                        Acompanhe minha agenda de palestras, cursos e encontros presenciais ou online.
                      </p>
                    </ScrollReveal>
                  </div>
                  <Button variant="outline" asChild className="rounded-full hidden md:flex">
                    <Link href="/login">Sugerir Palestra</Link>
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {futureEvents.map((event, i) => (
                    <ScrollReveal key={event.id} direction="up" delay={i * 100}>
                      <div className="group p-8 bg-white dark:bg-gray-800/50 rounded-3xl border border-border hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <Calendar size={20} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold uppercase text-primary tracking-tighter">
                              {event.date.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                            </span>
                            <span className="text-[10px] text-muted-foreground text-opacity-80">
                              {event.date.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • {event.location}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold font-headline mb-4 group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-8 flex-grow">
                          {event.description}
                        </p>
                        <Button className="w-full rounded-full group-hover:shadow-lg transition-all" asChild>
                          <a href={event.link || '/login'} target={event.link ? "_blank" : "_self"} rel="noreferrer">
                            {event.link ? 'Inscrição / Detalhes' : 'Mais Informações'}
                          </a>
                        </Button>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Eventos e Palestras */}
          <section className="py-24 bg-gradient-to-br from-primary/95 to-accent/95 text-white px-4">
            <div className="max-w-7xl mx-auto text-center mb-16">
              <ScrollReveal direction="up">
                <h2 className="text-4xl font-headline mb-4">Eventos e Palestras</h2>
                <p className="text-white/80">Presença ativa nos principais congressos nacionais.</p>
              </ScrollReveal>
            </div>
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                {realEventos.length > 0 ? (
                  realEventos.map((e, i) => (
                    <ScrollReveal key={e.id} direction="left" delay={i * 100}>
                      <Link href="/galeria" className="block group">
                        <div className="flex items-center gap-4 p-5 bg-purple-50/90 rounded-2xl border border-primary/10 hover:shadow-lg transition-all">
                          <div className="w-16 h-16 relative rounded-xl overflow-hidden flex-shrink-0 border-2 border-primary/10">
                            <Image src={e.coverImage} alt={e.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-grow">
                            <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
                              {e.date.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                            </span>
                            <h4 className="font-bold leading-tight text-purple-950 group-hover:text-primary transition-colors">{e.title}</h4>
                          </div>
                          <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all font-bold" />
                        </div>
                      </Link>
                    </ScrollReveal>
                  ))
                ) : (
                  [
                    "12º Congresso Todos Juntos Contra o Câncer (TJCC)",
                    "SINTOMA 2025 – Simpósio Internacional",
                    "Encontro Humanização Ubatuba",
                    "3º Simpósio Câncer Cabeça e Pescoço"
                  ].map((e, i) => (
                    <ScrollReveal key={i} direction="left" delay={i * 100}>
                      <div className="flex items-center gap-4 p-5 bg-white/10 rounded-2xl border border-white/10 hover:bg-white/20 transition-all">
                        <Award className="text-accent flex-shrink-0" />
                        <span className="font-bold">{e}</span>
                      </div>
                    </ScrollReveal>
                  ))
                )}
              </div>
              <ScrollReveal direction="right" delay={200}>
                <div className="glass-dark p-10 rounded-[3rem] border border-white/10">
                  <h3 className="text-2xl font-headline mb-6 italic text-white">Colaborações Ativas</h3>
                  <p className="opacity-80 mb-3">• Congresso Todos Juntos Contra o Câncer</p>
                  <p className="opacity-80 mb-3">• Movimento "World Cancer Day"</p>
                  <p className="opacity-80 mb-3">• Fórum do Ophicina de Cuidados Paliativos</p>
                  <p className="opacity-80 mb-3">• Congressos e Simpósios na Hematologia</p>
                  <p className="opacity-80">• Apoio a ações sociais.</p>
                </div>
              </ScrollReveal>
            </div>
          </section>
        </main>
      </div>

      {modalContent && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setModalContent(null)}>
          <div className="bg-card border border-border rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-card border-b border-border px-8 py-6 flex items-center justify-between rounded-t-3xl">
              <h3 className="text-2xl font-headline font-bold text-primary">{modalContent.title}</h3>
              <button onClick={() => setModalContent(null)} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="px-8 py-6 space-y-3">
              {modalContent.text.split('\n').map((line, i) => (
                <p key={i} className={line === '' ? 'h-2' : 'text-foreground leading-relaxed'}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      <BackToTop />
    </>
  );
}