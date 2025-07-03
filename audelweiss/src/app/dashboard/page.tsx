'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isLoggedIn, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Chargement...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8">Mon Compte</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <p className="text-lg mb-2">
                    <span className="font-semibold">Nom d'utilisateur :</span> {user.username}
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Email :</span> {user.email}
                </p>
            </div>
        </div>
    );
} 