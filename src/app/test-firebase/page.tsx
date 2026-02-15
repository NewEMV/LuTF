'use client';
import { useEffect, useState } from 'react';
import { auth, db, storage } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';

export default function TestFirebase() {
    const [status, setStatus] = useState({
        auth: '⏳ Testando...',
        firestore: '⏳ Testando...',
        storage: '⏳ Testando...',
    });

    useEffect(() => {
        const testFirebase = async () => {
            // Teste Auth
            try {
                if (auth) {
                    setStatus(prev => ({ ...prev, auth: '✅ Authentication configurado!' }));
                }
            } catch (error: any) {
                setStatus(prev => ({ ...prev, auth: `❌ Erro Auth: ${error.message}` }));
            }

            // Teste Firestore
            try {
                const testRef = collection(db, 'users');
                await getDocs(testRef);
                setStatus(prev => ({ ...prev, firestore: '✅ Firestore conectado!' }));
            } catch (error: any) {
                setStatus(prev => ({ ...prev, firestore: `❌ Erro Firestore: ${error.message}` }));
            }

            // Teste Storage
            try {
                if (storage) {
                    setStatus(prev => ({ ...prev, storage: '✅ Storage configurado!' }));
                }
            } catch (error: any) {
                setStatus(prev => ({ ...prev, storage: `❌ Erro Storage: ${error.message}` }));
            }
        };

        testFirebase();
    }, []);

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-2">🔥 Teste Firebase</h1>
                <p className="text-muted-foreground mb-8">Verificando conexão com os serviços do Firebase</p>

                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                        <span className="font-semibold">Authentication:</span>
                        <span className="text-sm">{status.auth}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                        <span className="font-semibold">Firestore Database:</span>
                        <span className="text-sm">{status.firestore}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                        <span className="font-semibold">Storage:</span>
                        <span className="text-sm">{status.storage}</span>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                        ℹ️ Se todos os status estiverem com ✅, o Firebase está configurado corretamente!
                    </p>
                </div>

                <Button
                    onClick={() => window.location.href = '/'}
                    className="mt-6"
                    variant="outline"
                >
                    ← Voltar para Home
                </Button>
            </div>
        </div>
    );
}
