'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();
    const { register, isLoggedIn } = useAuth();

    useEffect(() => {
        if (isLoggedIn) {
            router.push("/");
        }
    }, [isLoggedIn, router]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!username || !email || !password) {
            setError("Veuillez remplir tous les champs.");
            return;
        }

        try {
            await register(username, email, password);
            setSuccess("Compte créé avec succès ! Vous pouvez maintenant vous connecter. 🎉");
            setUsername('');
            setEmail('');
            setPassword('');
        } catch (err: any) {
            setError(err.message || "Erreur lors de l'inscription. L'email ou le nom d'utilisateur est peut-être déjà pris.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Inscription</h2>
                
                {success && <p className="text-green-500 mb-4 text-center bg-green-100 p-3 rounded-lg">{success}</p>}
                {error && <p className="text-red-500 mb-4 text-center bg-red-100 p-3 rounded-lg">{error}</p>}

                <form onSubmit={handleRegister} className="flex flex-col gap-5">
                    <input
                        type="text"
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border border-gray-300 p-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#E8A499] transition"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        S'inscrire
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-600">
                    Déjà un compte ?{" "}
                    <Link href="/login" className="text-[#E8A499] hover:underline font-semibold">
                        Connectez-vous ici
                    </Link>
                </p>
            </div>
        </div>
    );
} 