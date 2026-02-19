'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User as FirebaseUser,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Tipo do usuário com dados completos do Firestore
export interface User {
    uid: string;
    email: string;
    name: string;
    role: 'admin' | 'client';
    status: 'pending' | 'approved' | 'denied';
    phone?: string;
    subject?: string;
    createdAt?: Date;
}

// Tipo do contexto
interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<User | null>;
    signup: (userData: SignupData) => Promise<void>;
    logout: () => Promise<void>;
}

// Tipo dos dados de cadastro
export interface SignupData {
    name: string;
    email: string;
    phone: string;
    password: string;
    subject?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Buscar dados completos do usuário no Firestore
    const fetchUserData = async (firebaseUser: FirebaseUser): Promise<User | null> => {
        try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

            if (userDoc.exists()) {
                const data = userDoc.data();
                return {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    name: data.name,
                    role: data.role,
                    status: data.status,
                    phone: data.phone,
                    subject: data.subject,
                    createdAt: data.createdAt?.toDate(),
                };
            }

            return null;
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            return null;
        }
    };

    // Monitorar mudanças no estado de autenticação
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userData = await fetchUserData(firebaseUser);
                setUser(userData);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Login
    const login = async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userData = await fetchUserData(userCredential.user);
            setUser(userData);
            return userData; // Retornar dados do usuário
        } catch (error: any) {
            console.error('Erro no login:', error);

            // Traduzir erros do Firebase
            if (error.code === 'auth/user-not-found') {
                throw new Error('Usuário não encontrado');
            } else if (error.code === 'auth/wrong-password') {
                throw new Error('Senha incorreta');
            } else if (error.code === 'auth/invalid-email') {
                throw new Error('Email inválido');
            } else if (error.code === 'auth/too-many-requests') {
                throw new Error('Muitas tentativas. Tente novamente mais tarde');
            } else {
                throw new Error('Erro ao fazer login');
            }
        }
    };

    // Cadastro
    const signup = async (userData: SignupData) => {
        try {
            // Criar usuário no Authentication
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                userData.email,
                userData.password
            );

            // Criar documento no Firestore
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                subject: userData.subject || '',
                role: 'client',
                status: 'pending',
                createdAt: new Date(),
            });

            // Fazer logout após cadastro (usuário precisa aguardar aprovação)
            await signOut(auth);
            setUser(null);
        } catch (error: any) {
            console.error('Erro no cadastro:', error);

            if (error.code === 'auth/email-already-in-use') {
                throw new Error('Este email já está cadastrado');
            } else if (error.code === 'auth/weak-password') {
                throw new Error('Senha muito fraca. Use pelo menos 6 caracteres');
            } else if (error.code === 'auth/invalid-email') {
                throw new Error('Email inválido');
            } else {
                throw new Error('Erro ao criar conta');
            }
        }
    };

    // Logout
    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            throw new Error('Erro ao fazer logout');
        }
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para usar o contexto
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}
