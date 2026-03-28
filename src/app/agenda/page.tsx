'use client';
import { ProtectedRoute } from '@/components/protected-route';
import { useEffect } from 'react';

export const dynamic = 'force-dynamic';

export default function AgendaPage() {
    useEffect(() => {
        (function (C, A, L) {
            let p = function (a, ar) { a.q.push(ar); };
            let d = C.document;
            C.Cal = C.Cal || function () {
                let am = arguments;
                let g = function (t, e, i, a) { p(t, [e, i, a]); };
                if (am.length === 0) { g(C.Cal, "root", "p", am); } else { g(C.Cal, am[0], am[1], am[2]); }
            };
            C.Cal.q = C.Cal.q || [];
            let s = d.createElement("script");
            s.src = L;
            s.async = true;
            let n = d.getElementsByTagName("script")[0];
            n?.parentNode?.insertBefore(s, n);
        })(window, btoa, "https://embed.cal.com/embed.js");

        const calInstance = (window as any).Cal;
        if (calInstance) {
            calInstance("init", { origin: "https://cal.com" });
            calInstance("inline", {
                elementOrSelector: "#my-cal-inline",
                calLink: "newton-botuem-calendar/45min",
                layout: "month_view"
            });
            calInstance("ui", { "theme": "light", "styles": { "branding": { "brandColor": "#000000" } }, "hideEventTypeDetails": false, "layout": "month_view" });
        }
    }, []);

    return (
        <ProtectedRoute requireApprovedClient>
            <div className="min-h-screen p-4 md:p-12 bg-background">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-10 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-headline mb-4">Agendar Consulta</h1>
                        <p className="text-muted-foreground text-lg">
                            Escolha um horário para sua sessão. A confirmação será enviada por e-mail.
                        </p>
                    </header>

                    <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-2xl h-[700px]">
                        <div id="my-cal-inline" style={{ width: "100%", height: "100%", overflow: "scroll" }}></div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
