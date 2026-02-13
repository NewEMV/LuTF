'use client';

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const quickMessages = [
    'Gostaria de agendar uma consulta',
    'Tenho dúvidas sobre psico-oncologia',
    'Preciso de informações sobre cuidados paliativos',
  ];

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] z-50 transition-all duration-500 ${
          isOpen 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
        }`}
      >
        <div className="bg-white rounded-[2rem] shadow-2xl border border-primary/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Luciana Telles</h3>
                  <p className="text-xs opacity-90">Psicóloga Clínica</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm opacity-90">Como posso ajudar você hoje?</p>
          </div>

          {/* Quick messages */}
          <div className="p-4 bg-secondary/30 space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Mensagens rápidas
            </p>
            {quickMessages.map((msg, idx) => (
              <button
                key={idx}
                onClick={() => setMessage(msg)}
                className="w-full text-left px-4 py-3 bg-white rounded-xl text-sm hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all group"
              >
                <span className="text-gray-700 group-hover:text-primary transition-colors">
                  {msg}
                </span>
              </button>
            ))}
          </div>

          {/* Message input */}
          <div className="p-6 space-y-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="min-h-[100px] rounded-2xl border-2 resize-none"
            />
            <Button
              className="w-full rounded-xl h-12 font-bold text-base shadow-lg"
              onClick={() => {
                // Aqui você pode adicionar lógica de envio
                console.log('Mensagem:', message);
                setMessage('');
              }}
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Mensagem
            </Button>
            <p className="text-xs text-center text-gray-400">
              Responderemos em breve! ✨
            </p>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group ${
          isOpen ? 'rotate-90 scale-90' : 'hover:scale-110'
        }`}
        aria-label="Abrir chat"
      >
        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
        
        {/* Icon */}
        <div className="relative z-10 text-white transition-transform duration-300">
          {isOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
          )}
        </div>

        {/* Badge */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent border-2 border-white flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">1</span>
          </div>
        )}
      </button>

      <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </>
  );
}
