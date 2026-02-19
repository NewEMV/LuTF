'use client';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";
import {
  Sparkles,
  HandHeart,
  Sun,
  ArrowRight,
  Award,
  BookOpen,
  PlayCircle,
  Phone,
  MessageCircle,
  Menu,
  X,
  Speech,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { LucianaLogo } from "@/components/luciana-logo";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
// Novos componentes
import { ScrollReveal } from '@/components/scroll-reveal';
import { TestimonialsCarousel } from '@/components/testimonials-carousel';
import { FloatingChat } from '@/components/floating-chat';
import { PageLoader } from '@/components/page-loader';
import { InteractiveCalendar } from '@/components/interactive-calendar';
import { ScrollProgress, BackToTop } from '@/components/scroll-components';
import { ThemeToggle } from '@/contexts/ThemeContext';
import { CardMovingBorder } from '@/components/card-moving-border';
import { useAuth } from '@/contexts/AuthContext';
import { getPublishedPosts } from '@/lib/blog';
import { getVideos } from '@/lib/videos';
import { getEventos } from '@/lib/eventos';
import { getServices } from '@/lib/services';
import { getFutureEvents } from '@/lib/future-events';
import { getTrajectory } from '@/lib/trajectory';
import { getTestimonials } from '@/lib/testimonials';
import type { BlogPost } from '@/types/blog';
import type { Video } from '@/types/video';
import type { Evento } from '@/types/evento';
import type { TrajectoryItem } from '@/types/trajectory';
import type { Testimonial } from '@/types/testimonial';

const heroImage = PlaceHolderImages.find(p => p.id === 'hero-portrait');
const vlogThumbOncologia = PlaceHolderImages.find(p => p.id === 'vlog-oncologia');
const vlogThumbPaliativos = PlaceHolderImages.find(p => p.id === 'vlog-paliativos');
const vlogThumbLuto = PlaceHolderImages.find(p => p.id === 'vlog-luto');
const vlogThumbReflexao = PlaceHolderImages.find(p => p.id === 'vlog-reflexao');

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [vlogFilter, setVlogFilter] = useState('todos');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [realPosts, setRealPosts] = useState<BlogPost[]>([]);
  const [realVideos, setRealVideos] = useState<Video[]>([]);
  const [realEventos, setRealEventos] = useState<Evento[]>([]);
  const [realTrajectory, setRealTrajectory] = useState<TrajectoryItem[]>([]);
  const [realTestimonials, setRealTestimonials] = useState<Testimonial[]>([]);
  const [hasServices, setHasServices] = useState(false);
  const [futureEvents, setFutureEvents] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const results = await Promise.allSettled([
          getPublishedPosts(4),
          getVideos({ limit: 6 }),
          getEventos(4),
          getServices(false),
          getFutureEvents(false),
          getTrajectory(),
          getTestimonials()
        ]);

        if (results[0].status === 'fulfilled') setRealPosts(results[0].value);
        if (results[1].status === 'fulfilled') setRealVideos(results[1].value);
        if (results[2].status === 'fulfilled') setRealEventos(results[2].value);
        if (results[3].status === 'fulfilled') setHasServices(results[3].value.length > 0);
        if (results[4].status === 'fulfilled') setFutureEvents(results[4].value);
        if (results[5].status === 'fulfilled') setRealTrajectory(results[5].value);
        if (results[6].status === 'fulfilled') setRealTestimonials(results[6].value);

        // Opcional: Logar erros individuais para debug
        results.forEach((result, idx) => {
          if (result.status === 'rejected') {
            console.warn(`Erro ao carregar módulo ${idx}:`, result.reason);
          }
        });

      } catch (error) {
        console.error("Erro geral ao carregar dados reais:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  }, [activeTab]);

  // Função para lidar com clique no botão "Agendar Consulta"
  const handleAgendarConsulta = () => {
    if (!user) {
      // Não está logado - redireciona para login
      router.push('/login');
      return;
    }

    if (user.status === 'pending') {
      // Cadastro pendente
      alert('Seu cadastro está aguardando aprovação. Você receberá um email quando for aprovado.');
      return;
    }

    if (user.status === 'denied') {
      alert('Seu cadastro foi negado. Entre em contato para mais informações.');
      return;
    }

    if (user.role === 'client' && user.status === 'approved') {
      // Cliente aprovado - redireciona para agenda
      router.push('/agenda');
    } else if (user.role === 'admin') {
      // Admin - redireciona para área admin
      router.push('/admin');
    }
  };

  // Mapear dados reais para o formato esperado pelo componente (ou usar diretamente)
  const vlogItems = realVideos.length > 0
    ? realVideos.map(v => ({
      id: v.id,
      title: v.title,
      category: v.category,
      desc: v.description,
      thumb: v.customCover || v.thumbnail,
      hint: v.title
    }))
    : [
      { id: 1, title: "Acolhimento no Diagnóstico", category: "oncologia", desc: "Como lidar com as primeiras notícias.", thumb: vlogThumbOncologia?.imageUrl, hint: vlogThumbOncologia?.imageHint },
      { id: 2, title: "O que são Cuidados Paliativos?", category: "paliativos", desc: "Desmistificando o conceito de cuidado.", thumb: vlogThumbPaliativos?.imageUrl, hint: vlogThumbPaliativos?.imageHint },
      { id: 3, title: "Vivenciando o Luto", category: "luto", desc: "Respeitando o tempo de cada dor.", thumb: vlogThumbLuto?.imageUrl, hint: vlogThumbLuto?.imageHint },
      { id: 4, title: "Saúde Mental do Cuidador", category: "reflexão", desc: "Quem cuida também precisa de amparo.", thumb: vlogThumbReflexao?.imageUrl, hint: vlogThumbReflexao?.imageHint },
    ];

  const blogPosts = realPosts.length > 0
    ? realPosts.map(p => ({
      id: p.id,
      title: p.title,
      summary: p.excerpt,
      tag: p.categories[0],
      slug: p.slug,
      image: p.coverImage
    }))
    : [
      { id: 1, title: "Comunicação Difícil na Saúde", summary: "Como falar sobre verdades dolorosas com empatia.", tag: "Comunicação", image: "" },
      { id: 2, title: "Dilemas Éticos no Fim da Vida", summary: "Reflexões sobre autonomia e dignidade do paciente.", tag: "Ética", image: "" },
      { id: 3, title: "O Luto Não é uma Doença", summary: "Entendendo os processos naturais de despedida.", tag: "Luto", image: "" },
      { id: 4, title: "Saúde Emocional e Câncer", summary: "O papel da psicologia na jornada do tratamento.", tag: "Saúde", image: "" },
    ];

  const trajectoryGallery = realTrajectory.length > 0
    ? realTrajectory.map(t => ({ url: t.imageUrl, title: t.title, desc: t.description }))
    : [
      { url: heroImage?.imageUrl, title: "Atendimento Clínico", desc: "Suporte especializado." },
      { url: vlogThumbOncologia?.imageUrl, title: "Psico-Oncologia", desc: "Acompanhamento no tratamento." },
      { url: vlogThumbPaliativos?.imageUrl, title: "Cuidados Paliativos", desc: "Dignidade e presença." },
      { url: vlogThumbReflexao?.imageUrl, title: "Docência e Palestras", desc: "Compartilhando conhecimento." },
    ];

  const [currentTraj, setCurrentTraj] = useState(0);

  const nextTraj = () => setCurrentTraj((prev) => (prev + 1) % trajectoryGallery.length);
  const prevTraj = () => setCurrentTraj((prev) => (prev - 1 + trajectoryGallery.length) % trajectoryGallery.length);

  const NavLink = ({ id, label }: { id: string; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 font-medium transition-all duration-300 relative group ${activeTab === id ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary'}`}
    >
      {label}
      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 ${activeTab === id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}`}></span>
    </button>
  );

  const MobileNavMenu = () => (
    <div className={`absolute top-full left-0 w-full glass lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
      <div className="flex flex-col items-center space-y-4 py-8">
        <NavLink id="home" label="Início" />
        <NavLink id="trajetoria" label="Trajetória" />
        <NavLink id="vlog" label="Vlog" />
        <NavLink id="blog" label="Blog" />
        {hasServices && (
          <Link href="/servicos" className="px-4 py-2 font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">Serviços</Link>
        )}
        <Link href="/galeria" className="px-4 py-2 font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">Galeria</Link>
        <Button onClick={() => setActiveTab('contato')} className="mt-4" size="lg">Contato | Agendamento</Button>
      </div>
    </div>
  );

  if (isLoading) return <PageLoader />;

  return (
    <>
      <ScrollProgress />
      <div className="min-h-screen">
        <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/50 dark:bg-gray-900/40 backdrop-blur-2xl shadow-lg py-2' : 'bg-transparent py-4'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
                <LucianaLogo className="w-10 h-10 md:w-12 md:h-12 transition-transform duration-500 group-hover:rotate-12" />
                <div className="flex flex-col">
                  <span className="text-4xl md:text-5xl font-allison text-foreground leading-none pt-2">luciana telles</span>
                  <span className="text-[9px] md:text-[11px] uppercase tracking-[0.15em] text-primary font-bold mt-1">Psicologia Clínica | Psico Oncologia | Cuidados Paliativos | Luto</span>
                </div>
              </div>
              <div className="hidden lg:flex items-center space-x-2">
                <NavLink id="home" label="Início" />
                <NavLink id="trajetoria" label="Trajetória" />
                <NavLink id="vlog" label="Vídeos" />
                <NavLink id="blog" label="Blog" />
                {hasServices && (
                  <Link href="/servicos" className="px-4 py-2 font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">Serviços</Link>
                )}
                <Link href="/galeria" className="px-4 py-2 font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">Galeria</Link>
                <div className="ml-4">
                  <ThemeToggle />
                </div>
                <Button onClick={handleAgendarConsulta} className="ml-6 rounded-full px-7 py-3 font-bold" size="lg">Contato | Agendamento</Button>
              </div>
              <div className="lg:hidden flex items-center gap-3">
                <ThemeToggle />
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-foreground p-2">
                  {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                </button>
              </div>
            </div>
          </div>
          <MobileNavMenu />
        </nav>

        <main>
          {activeTab === 'home' && (
            <>
              {/* Hero Section */}
              <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-4">
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl opacity-60"></div>
                <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">
                  <ScrollReveal direction="left" className="lg:w-1/2 space-y-8 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-muted text-muted-foreground rounded-full text-sm font-bold uppercase tracking-widest animate-bounce-slow">
                      <Sparkles size={16} /> Seja Gentil com Você!
                    </div>
                    <h1 className="text-5xl md:text-7xl font-headline text-foreground leading-tight">
                      Acolher o <span className="text-primary">desafio</span> com dignidade.
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 font-medium">
                      Psicóloga dedicada ao suporte, presença e cuidado especializado em fases de transição.
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                      <Button onClick={handleAgendarConsulta} size="lg" className="px-10 py-5 text-lg rounded-2xl h-auto hover-lift">Contato | Agendamento</Button>
                      <Button onClick={() => setActiveTab('trajetoria')} variant="outline" size="lg" className="px-10 py-5 text-lg rounded-2xl h-auto">Ver Trajetória</Button>
                    </div>
                  </ScrollReveal>
                  <ScrollReveal direction="right" delay={200} className="lg:w-1/2 relative">
                    <div className="aspect-[4/5] bg-secondary rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-background animate-float flex items-center justify-center hover-lift">
                      {heroImage && <Image src={heroImage.imageUrl} alt={heroImage.description} width={400} height={500} data-ai-hint={heroImage.imageHint || ''} className="object-cover w-full h-full" />}
                    </div>
                  </ScrollReveal>
                </div>
              </section>

              {/* Temas Centrais – com CardMovingBorder */}
              <section className="py-24 bg-secondary/50 px-4">
                <div className="max-w-7xl mx-auto text-center mb-16">
                  <ScrollReveal direction="up">
                    <h2 className="text-4xl font-headline mb-4">Temas Centrais</h2>
                    <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
                  </ScrollReveal>
                </div>
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
                  {[
                    { title: "Psico-Oncologia", icon: Speech, color: "bg-purple-500", desc: "Acolhimento e intervenção a pessoas com câncer e familiares desde o diagnóstico, no tratamento, reabilitação e luto." },
                    { title: "Cuidados Paliativos", icon: Sun, color: "bg-purple-400", desc: "Qualidade de vida e manejo emocional de doenças graves." },
                    { title: "Clínica do Luto", icon: HandHeart, color: "bg-purple-600", desc: "Acolhimento aos processos de perdas. Suporte a dor da ausência." }
                  ].map((item, idx) => (
                    <ScrollReveal key={idx} direction="up" delay={idx * 100}>
                      <CardMovingBorder className="bg-card shadow-sm transition-all duration-300 group" borderRadius="2.5rem">
                        <div className="p-10">
                          <div className={`w-14 h-14 ${item.color} text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <item.icon size={28} />
                          </div>
                          <h3 className="text-2xl font-headline mb-4">{item.title}</h3>
                          <p className="text-muted-foreground mb-6">{item.desc}</p>
                          <button onClick={() => setActiveTab('contato')} className="font-bold text-primary flex items-center gap-2 group-hover:gap-4 transition-all">
                            Saiba mais <ArrowRight size={18} />
                          </button>
                        </div>
                      </CardMovingBorder>
                    </ScrollReveal>
                  ))}
                </div>
              </section>

              <TestimonialsCarousel items={realTestimonials} />

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
                      <p className="opacity-80">• Apoio a ações sociais.</p>
                    </div>
                  </ScrollReveal>
                </div>
              </section>
            </>
          )}

          {activeTab === 'trajetoria' && (
            <section className="pt-40 pb-32 px-4 max-w-4xl mx-auto">
              <ScrollReveal direction="up">
                <h2 className="text-4xl font-headline text-center mb-12">Trajetória Profissional</h2>
              </ScrollReveal>

              <div className="space-y-12">
                {/* Carrossel de Fotos da Trajetória */}
                <ScrollReveal direction="up">
                  <div className="relative aspect-video md:aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-background bg-muted">
                    {trajectoryGallery[currentTraj].url && (
                      <Image
                        src={trajectoryGallery[currentTraj].url}
                        alt={trajectoryGallery[currentTraj].title}
                        fill
                        className="object-cover transition-all duration-700 ease-in-out"
                        key={currentTraj}
                      />
                    )}
                    <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                      <h4 className="text-2xl font-bold">{trajectoryGallery[currentTraj].title}</h4>
                      <p className="text-white/80">{trajectoryGallery[currentTraj].desc}</p>
                    </div>

                    <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4">
                      <button onClick={prevTraj} className="w-12 h-12 rounded-full glass flex items-center justify-center text-primary hover:scale-110 transition-all">
                        <ChevronLeft size={24} />
                      </button>
                      <button onClick={nextTraj} className="w-12 h-12 rounded-full glass flex items-center justify-center text-primary hover:scale-110 transition-all">
                        <ChevronRight size={24} />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={100}>
                  <div className="p-8 bg-secondary border-l-8 border-primary rounded-3xl hover-lift">
                    <h3 className="text-2xl font-bold text-muted-foreground mb-4">Experiência</h3>
                    <p className="mb-4"><strong>Psicóloga Clínica na Abrale:</strong> Foco em onco-hematologia.</p>
                    <p className="mb-4"><strong>Instituto de Imunologia e Oncologia:</strong> Psico-oncologista.</p>
                    <p><strong>Rede Nacional de Tanatologia:</strong> Docente.</p>
                  </div>
                </ScrollReveal>
                <div className="grid md:grid-cols-2 gap-6">
                  {["Mackenzie (Psicologia)", "Espec. Psico-Oncologia", "Espec. Cuidados Paliativos", "Aperfeiçoamento em Luto"].map((edu, i) => (
                    <ScrollReveal key={i} direction="up" delay={i * 100}>
                      <div className="p-5 border border-border rounded-2xl flex items-center gap-3 bg-card hover-lift">
                        <BookOpen size={20} className="text-primary" />
                        <span className="font-medium text-foreground">{edu}</span>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'vlog' && (
            <section className="pt-40 pb-32 px-4 text-center">
              <ScrollReveal direction="up">
                <h2 className="text-4xl font-headline mb-8">Vídeos: Diálogos Abertos</h2>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={100}>
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                  {['todos', 'oncologia', 'paliativos', 'luto', 'reflexão'].map(cat => (
                    <button key={cat} onClick={() => setVlogFilter(cat)} className={`px-6 py-2 rounded-full capitalize transition-all ${vlogFilter === cat ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary text-foreground hover:bg-primary/20'}`}>{cat}</button>
                  ))}
                </div>
              </ScrollReveal>
              <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {vlogItems.filter(v => v.category === vlogFilter || vlogFilter === 'todos').map((item, idx) => (
                  <ScrollReveal key={item.id} direction="up" delay={idx * 100}>
                    <CardMovingBorder className="shadow-lg transition-all duration-300 group overflow-hidden" borderRadius="1.5rem">
                      <Link href={`/videos/${item.id}`} className="block bg-card text-left">
                        <div className="aspect-video bg-secondary flex items-center justify-center relative">
                          {item.thumb ? (
                            <Image src={item.thumb} alt={item.title} fill style={{ objectFit: "cover" }} data-ai-hint={item.hint} />
                          ) : (
                            <PlayCircle size={48} className="text-primary/50" />
                          )}
                          <span className="absolute top-4 left-4 px-3 py-1 glass rounded-full text-[10px] font-bold uppercase text-primary z-10">{item.category}</span>
                        </div>
                        <div className="p-6">
                          <h4 className="text-xl font-headline font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </Link>
                    </CardMovingBorder>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'blog' && (
            <section className="pt-40 pb-32 px-4 max-w-7xl mx-auto">
              <ScrollReveal direction="up">
                <h2 className="text-4xl font-headline text-center mb-12">Escritas do Cuidar</h2>
              </ScrollReveal>
              <div className="grid md:grid-cols-2 gap-8">
                {blogPosts.map((post, idx) => (
                  <ScrollReveal key={post.id} direction="up" delay={idx * 100}>
                    <CardMovingBorder className="shadow-sm transition-all duration-300 group overflow-hidden" borderRadius="2.5rem">
                      <Link href={`/blog/${(post as any).slug || post.id}`} className="block h-full">
                        <div className="aspect-[16/10] bg-secondary relative overflow-hidden">
                          {post.image ? (
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/5">
                              <BookOpen size={48} className="text-primary/20" />
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 glass rounded-full text-[10px] font-bold uppercase text-primary">
                              {post.tag}
                            </span>
                          </div>
                        </div>
                        <div className="p-8">
                          <h3 className="text-2xl font-headline font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground mb-8 line-clamp-3">
                            {post.summary}
                          </p>
                          <div className="font-bold flex items-center gap-2 text-muted-foreground group-hover:text-primary group-hover:gap-4 transition-all mt-auto">
                            Ler completo <ArrowRight size={18} />
                          </div>
                        </div>
                      </Link>
                    </CardMovingBorder>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'contato' && (
            <section className="pt-40 pb-32 px-4 max-w-7xl mx-auto">
              <ScrollReveal direction="up">
                <h2 className="text-4xl font-headline text-center mb-12">Contato | Agendamento</h2>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={100}>
                <InteractiveCalendar />
              </ScrollReveal>

            </section>
          )}
        </main>

        <footer className="py-12 border-t border-border text-center bg-card">
          <LucianaLogo className="mx-auto mb-4 w-12 h-12" />
          <p className="font-allison text-foreground text-4xl">luciana telles</p>

          <div className="flex justify-center gap-4 mt-6 mb-4">
            <a
              href="https://www.linkedin.com/in/luciana-telles-ferri-b9966817"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary hover:text-white flex items-center justify-center transition-all hover:scale-110"
              aria-label="LinkedIn Luciana Telles"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            <a
              href="https://www.instagram.com/lucianatellesf.psi/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary hover:text-white flex items-center justify-center transition-all hover:scale-110"
              aria-label="Instagram Luciana Telles"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

          </div>

          <p className="text-xs text-muted-foreground mt-6 italic">CRP 06/88158 • © 2026 Luciana Telles Ferri. Todos os direitos reservados.</p>

          <div className="flex flex-col items-center gap-2 mt-8 mb-4">
            <div className="flex justify-center gap-6 text-[10px] font-medium text-muted-foreground">
              <Link href="/privacidade" className="hover:text-primary transition-colors">Política de Privacidade</Link>
              <Link href="/cookies" className="hover:text-primary transition-colors">Aviso de Cookies</Link>
            </div>
            <a
              href="https://www.instagram.com/vempreender.ia/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] text-muted-foreground/50 hover:text-primary transition-all flex items-center gap-1"
            >
              Desenvolvido com carinho por <span className="font-bold border-b border-primary/20">Vempreender</span>
            </a>
          </div>
        </footer>
      </div>

      {/* <FloatingChat /> */}
      <BackToTop />
    </>
  );
}