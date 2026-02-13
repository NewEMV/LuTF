'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Maria Silva',
    role: 'Paciente Oncológica',
    content: 'O acolhimento da Dra. Luciana foi fundamental no meu tratamento. Ela me ajudou a encontrar força onde eu pensava não haver mais.',
  },
  {
    id: 2,
    name: 'João Santos',
    role: 'Familiar em Luto',
    content: 'O processo de perder minha mãe foi menos doloroso graças ao suporte da psicóloga. Ela nos ensinou a honrar a memória com amor.',
  },
  {
    id: 3,
    name: 'Ana Paula',
    role: 'Cuidadora',
    content: 'Aprendi que cuidar de mim também é cuidar de quem amo. A terapia me devolveu o equilíbrio emocional que eu precisava.',
  },
];

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-br from-secondary via-background to-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-headline mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Histórias de Acolhimento
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="relative">
          {/* Quote icon */}
          <Quote className="absolute -top-6 -left-4 w-20 h-20 text-primary/10 z-0" />

          {/* Testimonial card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-12 md:p-16 shadow-2xl border border-primary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-2xl" />
            
            <div 
              key={current}
              className="relative z-10"
              style={{
                animation: 'slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 italic font-light">
                "{testimonials[current].content}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {testimonials[current].name[0]}
                </div>
                <div>
                  <p className="font-bold text-lg text-foreground">{testimonials[current].name}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 group border border-primary/20"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6 text-primary group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* Indicators */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    idx === current
                      ? 'w-8 h-3 bg-gradient-to-r from-primary to-accent'
                      : 'w-3 h-3 bg-gray-300 hover:bg-primary/50'
                  }`}
                  aria-label={`Ir para depoimento ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 group border border-primary/20"
              aria-label="Próximo"
            >
              <ChevronRight className="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
