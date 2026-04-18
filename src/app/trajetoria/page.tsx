'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, BookOpen, Loader2 } from "lucide-react";
import { ScrollReveal } from '@/components/scroll-reveal';
import { getTrajectory } from '@/lib/trajectory';
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { TrajectoryItem } from '@/types/trajectory';
import { PageLoader } from '@/components/page-loader';

const heroImage = PlaceHolderImages.find(p => p.id === 'hero-portrait');
const vlogThumbOncologia = PlaceHolderImages.find(p => p.id === 'vlog-oncologia');
const vlogThumbPaliativos = PlaceHolderImages.find(p => p.id === 'vlog-paliativos');
const vlogThumbReflexao = PlaceHolderImages.find(p => p.id === 'vlog-reflexao');

export default function TrajetoriaPage() {
  const [realTrajectory, setRealTrajectory] = useState<TrajectoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTraj, setCurrentTraj] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getTrajectory();
        setRealTrajectory(data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredTrajectory = realTrajectory.filter(t => t.imageUrl && t.title !== 'Nova Etapa');

  const trajectoryGallery = filteredTrajectory.length > 0
    ? filteredTrajectory.map(t => ({ url: t.imageUrl, title: t.title, desc: t.description, position: t.imagePosition || 'center' }))
    : [
      { url: heroImage?.imageUrl, title: "Atendimento Clínico", desc: "Suporte especializado.", position: 'center' },
      { url: vlogThumbOncologia?.imageUrl, title: "Psico-Oncologia", desc: "Acompanhamento no tratamento.", position: 'center' },
      { url: vlogThumbPaliativos?.imageUrl, title: "Cuidados Paliativos", desc: "Dignidade e presença.", position: 'center' },
      { url: vlogThumbReflexao?.imageUrl, title: "Docência e Palestras", desc: "Compartilhando conhecimento.", position: 'center' },
    ];

  const nextTraj = () => setCurrentTraj((prev) => (prev + 1) % trajectoryGallery.length);
  const prevTraj = () => setCurrentTraj((prev) => (prev - 1 + trajectoryGallery.length) % trajectoryGallery.length);

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <main className="pt-32 px-4 max-w-4xl mx-auto">
        <ScrollReveal direction="up">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-center mb-12">Trajetória Profissional</h1>
        </ScrollReveal>

        <div className="space-y-12">
          <ScrollReveal direction="up">
            <div className="space-y-0">
              <div className="relative aspect-video md:aspect-[21/9] rounded-t-[3rem] overflow-hidden shadow-2xl border-8 border-b-0 border-background bg-muted">
                {trajectoryGallery[currentTraj]?.url && (
                  <Image
                    src={trajectoryGallery[currentTraj].url!}
                    alt={trajectoryGallery[currentTraj].title}
                    fill
                    className="object-cover transition-all duration-700 ease-in-out"
                    style={{ objectPosition: trajectoryGallery[currentTraj].position }}
                    key={currentTraj}
                  />
                )}
                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 z-10">
                  <button onClick={prevTraj} className="w-12 h-12 rounded-full glass flex items-center justify-center text-primary hover:scale-110 transition-all">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={nextTraj} className="w-12 h-12 rounded-full glass flex items-center justify-center text-primary hover:scale-110 transition-all">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
              <div className="bg-card border-8 border-t-0 border-background rounded-b-[3rem] px-8 py-6 shadow-2xl">
                <h4 className="text-2xl font-bold text-foreground">{trajectoryGallery[currentTraj]?.title}</h4>
                {trajectoryGallery[currentTraj]?.desc && (
                  <p className="text-muted-foreground mt-2">{trajectoryGallery[currentTraj].desc}</p>
                )}
                <div className="flex gap-2 mt-4">
                  {trajectoryGallery.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentTraj(idx)}
                      className={`h-1.5 rounded-full transition-all ${idx === currentTraj ? 'w-6 bg-primary' : 'w-1.5 bg-border'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <div className="p-8 bg-secondary border-l-8 border-primary rounded-3xl hover-lift">
              <h3 className="text-2xl font-bold text-muted-foreground mb-4">Experiência</h3>
              <p className="mb-2 font-bold">Psicóloga Clínica:</p>
              <p className="mb-2"><strong>Abrale:</strong> Foco em onco-hematologia e Cuidados Paliativos</p>
              <p className="mb-2"><strong>Residencial Sênior Leger:</strong> Foco na saúde do idoso em Instituições.</p>
              <p className="mb-4"><strong>Consultório Particular:</strong> Cuidado em saúde mental em fases de transição.</p>
              <p className="mb-2 font-bold">Docente/Tutora/Palestrante:</p>
              <p>Foco em tutoria e docência em psico-oncologia; mercado de trabalho & adoecimento; luto; comunicação em saúde e inteligência emocional.</p>
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
      </main>
    </div>
  );
}
