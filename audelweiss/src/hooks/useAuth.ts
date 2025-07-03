'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { postRequest } from '../../lib/strapi';

interface User {
    id: number;
    username: string;
    email: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const updateAuthState = useCallback(() => {
        try {
            const token = localStorage.getItem('jwt');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                setUser(JSON.parse(userData));
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Erreur d'authentification:", error);
            setUser(null);
        } finally {
            if (isLoading) setIsLoading(false);
        }
    }, [isLoading]);


    useEffect(() => {
        updateAuthState();
        window.addEventListener('storage', updateAuthState);

        return () => {
            window.removeEventListener('storage', updateAuthState);
        };
    }, [updateAuthState]);

    const login = async (identifier: string, password: string) => {
        const result = await postRequest("auth/local", { identifier, password });

        if (result?.jwt) {
            localStorage.setItem("jwt", result.jwt);
            localStorage.setItem("user", JSON.stringify(result.user));
            updateAuthState();
            return result.user;
        }
        
        throw new Error(result?.error?.message || 'Identifiants incorrects.');
    };

    const register = async (username: string, email: string, password: string) => {
        const result = await postRequest("auth/local/register", {
            username,
            email,
            password,
        });

        if (result?.jwt) {
            return result.user;
        }

        throw new Error(result?.error?.message || "Erreur lors de l'inscription.");
    };

    const logout = useCallback(() => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        updateAuthState();
        router.push('/');
    }, [router, updateAuthState]);

    return {
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        register,
        logout,
    };
}
