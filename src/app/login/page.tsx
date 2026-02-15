'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SignupModal } from '@/components/signup-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LucianaLogo } from '@/components/luciana-logo';

export const dynamic = 'force-dynamic';

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { login, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSignup, setShowSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        setError('');

        try {
            const userData = await login(data.email, data.password);

            // Redirecionar usando window.location para garantir que funciona com static export
            if (userData) {
                if (userData.role === 'admin') {
                    window.location.href = '/admin';
                } else if (userData.role === 'client') {
                    if (userData.status === 'approved') {
                        window.location.href = '/agenda';
                    } else if (userData.status === 'pending') {
                        setError('Seu cadastro está aguardando aprovação');
                        setLoading(false);
                    } else if (userData.status === 'denied') {
                        setError('Seu cadastro foi negado. Entre em contato para mais informações');
                        setLoading(false);
                    }
                }
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao fazer login');
            setLoading(false);
        }
    };

    // Redirecionar baseado no role e status quando user estiver disponível
    useEffect(() => {
        if (user && !loading) {
            if (user.role === 'admin') {
                router.push('/admin');
            } else if (user.role === 'client') {
                if (user.status === 'approved') {
                    router.push('/agenda');
                } else if (user.status === 'pending') {
                    setError('Seu cadastro está aguardando aprovação');
                } else if (user.status === 'denied') {
                    setError('Seu cadastro foi negado. Entre em contato para mais informações');
                }
            }
        }
    }, [user, loading, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <LucianaLogo className="w-16 h-16 mx-auto mb-4" />
                    </Link>
                    <h1 className="text-4xl font-allison text-foreground mb-2">luciana telles</h1>
                    <p className="text-sm text-muted-foreground">Psicologia Clínica | Psico Oncologia | Cuidados Paliativos | Luto</p>
                </div>

                <div className="bg-card border border-border rounded-3xl p-8 shadow-lg">
                    <h2 className="text-2xl font-headline mb-2">Bem-vinda de volta</h2>
                    <p className="text-muted-foreground mb-6">Entre com suas credenciais</p>

                    {error && (
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                {...register('email')}
                                placeholder="seu@email.com"
                                className="mt-1"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="password">Senha</Label>
                            <div className="relative mt-1">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password')}
                                    placeholder="••••••"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading ? 'Entrando...' : 'Entrar'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Não tem uma conta?{' '}
                            <button
                                onClick={() => setShowSignup(true)}
                                className="text-primary font-semibold hover:underline"
                            >
                                Criar conta
                            </button>
                        </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border text-center">
                        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                            ← Voltar para o site
                        </Link>
                    </div>
                </div>
            </div>

            <SignupModal open={showSignup} onClose={() => setShowSignup(false)} />
        </div>
    );
}
