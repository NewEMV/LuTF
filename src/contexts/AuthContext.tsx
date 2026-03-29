'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User as FirebaseUser,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Tipo do usuário com dados completos do Firestore
export interface User {
    uid: string;
    email: string;
    name: string;
    role: 'admin' | 'client';
    status: 'pending' | 'approved' | 'denied';
    phone?: string;
    createdAt?: Date;
}

// Tipo do contexto
interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<User | null>;
    signup: (userData: SignupData) => Promise<void>;
    signInWithGoogle: () => Promise<User | null>;
    resetPassword: (email: string) => Promise<void>;
    logout: () => Promise<void>;
}

// Tipo dos dados de cadastro
export interface SignupData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    password: string;
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
                subject: userData.subject,
                role: 'client',
                status: 'pending',
                createdAt: serverTimestamp(),
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

    // Google Sign-In
    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Verificar se o usuário já existe no Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            
            if (!userDoc.exists()) {
                // Se não existir, cria o cadastro inicial
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName || 'Usuário Google',
                    email: user.email,
                    role: 'client',
                    status: 'pending', // Fica pendente de aprovação, assim como no email/senha
                    createdAt: serverTimestamp(),
                });
                
                // O estado onAuthStateChanged detectará a mudança e chamará fetchUserData,
                // que pode ainda não encontrar os dados ou re-iniciar. 
                // Após o signup via Google, idealmente fazemos logout até ser aprovado, 
                // ou apenas retornamos os dados gerados temporários:
                await signOut(auth);
                setUser(null);
                throw new Error('Cadastro realizado com sucesso! Aguarde a aprovação inicial.');
            }

            const userData = await fetchUserData(user);
            setUser(userData);
            return userData;
        } catch (error: any) {
            console.error('Erro no login com Google:', error);
            if (error.message.includes('Aguarde a aprovação')) {
                throw new Error('Seu cadastro está aguardando aprovação.');
            } else if (error.code === 'auth/popup-closed-by-user') {
                throw new Error('O login foi cancelado.');
            } else {
                throw new Error('Erro ao fazer login com o Google.');
            }
        }
    };

    // Recuperação de Senha
    const resetPassword = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error: any) {
            console.error('Erro na recuperação de senha:', error);
            if (error.code === 'auth/user-not-found') {
                throw new Error('Usuário não encontrado');
            } else if (error.code === 'auth/invalid-email') {
                throw new Error('Email inválido');
            } else {
                throw new Error('Erro ao enviar email de recuperação');
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
        signInWithGoogle,
        resetPassword,
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
