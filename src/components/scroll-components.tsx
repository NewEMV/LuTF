'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollPx / winHeightPx) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary via-accent to-primary z-[9999] transition-all duration-150"
      style={{ width: `${scrollProgress}%` }}
    />
  );
}

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-24 left-6 z-40 w-14 h-14 rounded-full bg-white shadow-2xl border-2 border-primary/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-3xl group ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
      aria-label="Voltar ao topo"
    >
      <ArrowUp className="w-6 h-6 text-primary group-hover:-translate-y-1 transition-transform" />
      
      {/* Animated ring */}
      <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20" />
    </button>
  );
}
