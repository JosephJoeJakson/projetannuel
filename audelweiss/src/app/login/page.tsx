'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, isLoggedIn } = useAuth();
    
    const redirectPath = searchParams.get('redirect') || '/dashboard';

    useEffect(() => {
        if (isLoggedIn) {
            router.push(redirectPath);
        }
    }, [isLoggedIn, router, redirectPath]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!identifier || !password) {
            setError("Veuillez remplir tous les champs.");
            return;
        }

        try {
            await login(identifier, password);
            // La redirection est maintenant gérée par le useEffect
        } catch (err: any) {
            setError(err.message || "Identifiants incorrects. Veuillez réessayer.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Connexion</h2>
                
                {error && <p className="text-red-500 mb-4 text-center bg-red-100 p-3 rounded-lg">{error}</p>}
                
                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <input
                        type="text"
                        placeholder="Email ou Nom d'utilisateur"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="border border-gray-300 p-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#E8A499] transition"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-300 p-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#E8A499] transition"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-[#E8A499] text-white p-3 rounded-lg text-lg font-semibold hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E8A499] transition"
                    >
                        Se connecter
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-600">
                    Pas encore de compte ?{" "}
                    <Link href="/register" className="text-[#E8A499] hover:underline font-semibold">
                        Inscrivez-vous ici
                    </Link>
                </p>
            </div>
        </div>
    );
}
