'use client';

import { useEffect, useState } from 'react';

export function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 30;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Loader content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo animation */}
        <div className="relative">
          {/* Rotating ring */}
          <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          
          {/* Inner circle */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl">
            <span className="text-3xl font-allison text-white">LT</span>
          </div>

          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        </div>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Loading text */}
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground animate-pulse">
            Preparando seu acolhimento...
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </div>
  );
}

// Loader alternativo minimalista
export function SimpleLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-sm flex items-center justify-center">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-primary"
            style={{
              animation: 'bounce 1.4s infinite ease-in-out',
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
