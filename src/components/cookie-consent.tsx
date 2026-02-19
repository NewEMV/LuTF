'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Pequeno delay para não aparecer de cara
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[100]"
                >
                    <div className="bg-white dark:bg-gray-900 border border-primary/20 shadow-2xl rounded-[2rem] p-6 backdrop-blur-xl bg-opacity-90 dark:bg-opacity-90">
                        <div className="flex gap-4 items-start">
                            <div className="p-3 bg-primary/10 rounded-2xl text-primary flex-shrink-0">
                                <Cookie size={24} />
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-headline font-bold text-lg">Privacidade e Cookies</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Utilizamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa
                                    <Link href="/cookies" className="text-primary hover:underline ml-1">Política de Cookies</Link>.
                                </p>
                                <div className="flex gap-3 pt-2">
                                    <Button onClick={handleAccept} className="rounded-full px-8 font-bold">
                                        Aceitar
                                    </Button>
                                    <Button variant="ghost" asChild className="rounded-full text-xs">
                                        <Link href="/privacidade">Saber mais</Link>
                                    </Button>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
