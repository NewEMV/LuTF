'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  delay?: number;
  duration?: number;
  className?: string;
}

export function ScrollReveal({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 800,
  className = '' 
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const getInitialTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(60px)';
      case 'down': return 'translateY(-60px)';
      case 'left': return 'translateX(60px)';
      case 'right': return 'translateX(-60px)';
      default: return 'none';
    }
  };

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${className}`}
      style={{
        opacity: 0,
        transform: getInitialTransform(),
        transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
      <style jsx>{`
        .scroll-reveal.revealed {
          opacity: 1 !important;
          transform: translateY(0) translateX(0) !important;
        }
      `}</style>
    </div>
  );
}
