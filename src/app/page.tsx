'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    Sparkles,
    Heart,
    Sun,
    ArrowRight,
    Award,
    BookOpen,
    PlayCircle,
    Phone,
    MessageCircle,
    Menu,
    X,
} from "lucide-react";
import { LucianaLogo } from "@/components/luciana-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const heroImage = PlaceHolderImages.find(p => p.id === 'hero-portrait');
const vlogThumbOncologia = PlaceHolderImages.find(p => p.id === 'vlog-oncologia');
const vlogThumbPaliativos = PlaceHolderImages.find(p => p.id === 'vlog-paliativos');
const vlogThumbLuto = PlaceHolderImages.find(p => p.id === 'vlog-luto');
const vlogThumbReflexao = PlaceHolderImages.find(p => p.id === 'vlog-reflexao');

export default function Home() {
    const [activeTab, setActiveTab] = useState('home');
    const [vlogFilter, setVlogFilter] = useState('todos');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        setIsMenuOpen(false);
    }, [activeTab]);

    const vlogItems = [
        { id: 1, title: "Acolhimento no Diagnóstico", category: "oncologia", desc: "Como lidar com as primeiras notícias.", thumb: vlogThumbOncologia?.imageUrl, hint: vlogThumbOncologia?.imageHint },
        { id: 2, title: "O que são Cuidados Paliativos?", category: "paliativos", desc: "Desmistificando o conceito de cuidado.", thumb: vlogThumbPaliativos?.imageUrl, hint: vlogThumbPaliativos?.imageHint },
        { id: 3, title: "Vivenciando o Luto", category: "luto", desc: "Respeitando o tempo de cada dor.", thumb: vlogThumbLuto?.imageUrl, hint: vlogThumbLuto?.imageHint },
        { id: 4, title: "Saúde Mental do Cuidador", category: "reflexão", desc: "Quem cuida também precisa de amparo.", thumb: vlogThumbReflexao?.imageUrl, hint: vlogThumbReflexao?.imageHint },
    ];

    const blogPosts = [
        { id: 1, title: "Comunicação Difícil na Saúde", summary: "Como falar sobre verdades dolorosas com empatia.", tag: "Comunicação" },
        { id: 2, title: "Dilemas Éticos no Fim da Vida", summary: "Reflexões sobre autonomia e dignidade do paciente.", tag: "Ética" },
        { id: 3, title: "O Luto Não é uma Doença", summary: "Entendendo os processos naturais de despedida.", tag: "Luto" },
        { id: 4, title: "Saúde Emocional e Câncer", summary: "O papel da psicologia na jornada do tratamento.", tag: "Saúde" },
    ];

    const NavLink = ({ id, label }: {id: string, label: string}) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 font-medium transition-all duration-300 relative group ${activeTab === id ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
        >
            {label}
            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 ${activeTab === id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}`}></span>
        </button>
    );
    
    const MobileNavMenu = () => (
      <div className={`absolute top-full left-0 w-full bg-white/80 backdrop-blur-lg lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="flex flex-col items-center space-y-4 py-8">
            <NavLink id="home" label="Início" />
            <NavLink id="trajetoria" label="Trajetória" />
            <NavLink id="vlog" label="Vlog" />
            <NavLink id="blog" label="Blog" />
            <Button onClick={() => setActiveTab('contato')} className="mt-4" size="lg">Agendar Consulta</Button>
        </div>
      </div>
    );

    return (
        <div className="min-h-screen">
            <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/60 backdrop-blur-xl shadow-sm py-2' : 'bg-transparent py-4'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
                            <LucianaLogo className="w-10 h-10 md:w-12 md:h-12 transition-transform duration-500 group-hover:rotate-12" />
                            <div className="flex flex-col">
                                <span className="text-4xl md:text-5xl font-allison text-foreground leading-none pt-2">luciana telles</span>
                                <span className="text-[9px] md:text-[11px] uppercase tracking-[0.15em] text-sage-600 font-bold mt-1">Psicologia Clínica & Onco-Hematologia</span>
                            </div>
                        </div>
                        <div className="hidden lg:flex items-center space-x-2">
                            <NavLink id="home" label="Início" />
                            <NavLink id="trajetoria" label="Trajetória" />
                            <NavLink id="vlog" label="Vlog" />
                            <NavLink id="blog" label="Blog" />
                            <Button onClick={() => setActiveTab('contato')} className="ml-6 rounded-full px-7 py-3 font-bold" size="lg">Agendar Consulta</Button>
                        </div>
                        <div className="lg:hidden">
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
                        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-4">
                            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-muted/50 rounded-full blur-3xl opacity-60"></div>
                            <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">
                                <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
                                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-muted text-muted-foreground rounded-full text-sm font-bold uppercase tracking-widest animate-bounce-slow">
                                        <Sparkles size={16} /> Seja Gentil com Você!
                                    </div>
                                    <h1 className="text-5xl md:text-7xl font-headline text-gray-900 leading-tight">
                                        Acolher o <span className="text-primary">desafio</span> com dignidade.
                                    </h1>
                                    <p className="text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 font-medium">
                                        Psicóloga dedicada a transformar momentos de transição em processos de suporte e cuidado humanizado.
                                    </p>
                                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                        <Button onClick={() => setActiveTab('contato')} size="lg" className="px-10 py-5 text-lg rounded-2xl h-auto">Agendar Consulta</Button>
                                        <Button onClick={() => setActiveTab('trajetoria')} variant="outline" size="lg" className="px-10 py-5 text-lg rounded-2xl h-auto text-muted-foreground">Ver Trajetória</Button>
                                    </div>
                                </div>
                                <div className="lg:w-1/2 relative">
                                    <div className="aspect-[4/5] bg-secondary rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white animate-float flex items-center justify-center">
                                       {heroImage && <Image src={heroImage.imageUrl} alt={heroImage.description} width={400} height={500} data-ai-hint={heroImage.imageHint || ''} className="object-cover w-full h-full" />}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="py-24 bg-secondary/50 px-4">
                            <div className="max-w-7xl mx-auto text-center mb-16">
                                <h2 className="text-4xl font-headline mb-4">Temas Centrais</h2>
                                <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
                            </div>
                            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
                                {[
                                    { title: "Psico-Oncologia", icon: Heart, color: "bg-rose-500", desc: "Acompanhamento no diagnóstico e tratamento do câncer." },
                                    { title: "Cuidados Paliativos", icon: Sun, color: "bg-amber-500", desc: "Qualidade de vida e manejo emocional de doenças graves." },
                                    { title: "Clínica do Luto", icon: Sparkles, color: "bg-indigo-500", desc: "Acolhimento de perdas e processos de despedida." }
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-muted hover:shadow-2xl transition-all group">
                                        <div className={`w-14 h-14 ${item.color} text-white rounded-2xl flex items-center justify-center mb-6`}>
                                            <item.icon size={28} />
                                        </div>
                                        <h3 className="text-2xl font-headline mb-4">{item.title}</h3>
                                        <p className="text-gray-600 mb-6">{item.desc}</p>
                                        <button onClick={() => setActiveTab('contato')} className="font-bold text-primary flex items-center gap-2">Saiba mais <ArrowRight size={18} /></button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="py-24 bg-foreground text-white px-4">
                            <div className="max-w-7xl mx-auto text-center mb-16">
                                <h2 className="text-4xl font-headline mb-4">Eventos e Palestras 2025</h2>
                                <p className="text-muted">Presença ativa nos principais congressos nacionais.</p>
                            </div>
                            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    {[
                                        "12º Congresso Todos Juntos Contra o Câncer (TJCC)",
                                        "SINTOMA 2025 – Simpósio Internacional",
                                        "Encontro Humanização Ubatuba",
                                        "3º Simpósio Câncer Cabeça e Pescoço"
                                    ].map((e, i) => (
                                        <div key={i} className="flex items-center gap-4 p-5 bg-white/10 rounded-2xl border border-white/5">
                                            <Award className="text-accent" />
                                            <span className="font-bold">{e}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10">
                                    <h3 className="text-2xl font-headline mb-6 italic text-accent">Colaborações Ativas</h3>
                                    <p className="opacity-80">• Movimento “Unidos pelo Único” (2025-2027).</p>
                                    <p className="opacity-80">• Parcerias com a Abrale.</p>
                                    <p className="opacity-80">• Lives com a Ophicina de Cuidados Paliativos.</p>
                                </div>
                            </div>
                        </section>
                    </>
                )}

                {activeTab === 'trajetoria' && (
                    <section className="pt-40 pb-32 px-4 max-w-4xl mx-auto">
                        <h2 className="text-4xl font-headline text-center mb-12">Trajetória Profissional</h2>
                        <div className="space-y-12">
                            <div className="p-8 bg-secondary border-l-8 border-primary rounded-3xl">
                                <h3 className="text-2xl font-bold text-muted-foreground mb-4">Experiência</h3>
                                <p className="mb-4"><strong>Psicóloga Clínica na Abrale:</strong> Foco em onco-hematologia.</p>
                                <p className="mb-4"><strong>Instituto de Imunologia e Oncologia:</strong> Psico-oncologista.</p>
                                <p><strong>Rede Nacional de Tanatologia:</strong> Docente.</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                {["Mackenzie (Psicologia)", "Espec. Psico-Oncologia", "Espec. Cuidados Paliativos", "Aperfeiçoamento em Luto"].map((edu, i) => (
                                    <div key={i} className="p-5 border border-border/50 rounded-2xl flex items-center gap-3 bg-white">
                                        <BookOpen size={20} className="text-sage-600" />
                                        <span className="font-medium text-gray-700">{edu}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === 'vlog' && (
                    <section className="pt-40 pb-32 px-4 text-center">
                        <h2 className="text-4xl font-headline mb-8">Vlog: Diálogos Abertos</h2>
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            {['todos', 'oncologia', 'paliativos', 'luto', 'reflexão'].map(cat => (
                                <button key={cat} onClick={() => setVlogFilter(cat)} className={`px-6 py-2 rounded-full capitalize transition-all ${vlogFilter === cat ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary text-gray-600'}`}>{cat}</button>
                            ))}
                        </div>
                        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {vlogItems.filter(v => v.category === vlogFilter || vlogFilter === 'todos').map(item => (
                                <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-muted text-left">
                                    <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                                      {item.thumb ? (
                                        <Image src={item.thumb} alt={item.title} fill={true} style={{objectFit:"cover"}} data-ai-hint={item.hint} />
                                      ) : (
                                        <PlayCircle size={48} className="text-primary/50" />
                                      )}
                                      <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 rounded-full text-[10px] font-bold uppercase text-primary z-10">{item.category}</span>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="text-xl font-headline font-bold mb-2">{item.title}</h4>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === 'blog' && (
                    <section className="pt-40 pb-32 px-4 max-w-7xl mx-auto">
                        <h2 className="text-4xl font-headline text-center mb-12">Escritas do Cuidar</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {blogPosts.map(post => (
                                <article key={post.id} className="bg-secondary p-10 rounded-[2.5rem] border border-muted hover:bg-white transition-all group">
                                    <span className="text-[10px] font-bold uppercase text-primary">{post.tag}</span>
                                    <h3 className="text-2xl font-headline font-bold mt-4 mb-4 group-hover:text-primary">{post.title}</h3>
                                    <p className="text-gray-600 mb-8">{post.summary}</p>
                                    <button className="font-bold flex items-center gap-2 text-muted-foreground">Ler completo <ArrowRight size={18} /></button>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === 'contato' && (
                    <section className="pt-40 pb-32 px-4 max-w-7xl mx-auto text-center">
                        <h2 className="text-4xl font-headline mb-12">Canais de Contato</h2>
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-muted flex items-center gap-6 text-left">
                                    <div className="p-4 bg-secondary text-primary rounded-2xl"><Phone size={30} /></div>
                                    <div><p className="text-xs font-bold text-gray-400">Atendimento</p><p className="text-xl font-bold">(11) 3149-5190</p></div>
                                </div>
                                <div className="bg-primary p-8 rounded-[2rem] shadow-xl text-primary-foreground flex items-center gap-6 text-left">
                                    <div className="p-4 bg-white/20 rounded-2xl"><MessageCircle size={30} /></div>
                                    <div><p className="text-xs font-bold opacity-70 uppercase">WhatsApp / 0800</p><p className="text-xl font-bold">0800-773-9973</p></div>
                                </div>
                                <p className="text-gray-400 mt-8">Rua Paulistânia, 661, Sumarezinho, São Paulo – SP.</p>
                            </div>
                            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-muted">
                                <h3 className="text-2xl font-headline mb-6 text-foreground">Mensagem Direta</h3>
                                <Input type="text" placeholder="Nome" className="mb-4 rounded-2xl" />
                                <Textarea placeholder="Sua mensagem" rows={4} className="mb-4 rounded-2xl"></Textarea>
                                <Button className="w-full rounded-2xl p-5 h-auto" size="lg">Enviar</Button>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <footer className="py-12 border-t border-muted text-center bg-white">
                <LucianaLogo className="mx-auto mb-4 w-12 h-12" />
                <p className="font-allison text-foreground text-4xl">luciana telles</p>
                <p className="text-xs text-gray-400 mt-4 italic">CRP 06/XXXXXX • © 2025 Luciana Telles Ferri. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}
