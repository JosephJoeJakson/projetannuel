"use client";

import { useState } from "react";
import { postRequest } from "../../../lib/strapi";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    // 🔹 Connexion
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const result = await postRequest("auth/local", { identifier, password });

        if (result?.jwt) {
            localStorage.setItem("jwt", result.jwt);
            localStorage.setItem("user", JSON.stringify(result.user));
            router.push("/dashboard");
        } else {
            setError("Identifiants incorrects.");
        }
    };

    // 🔹 Inscription
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const result = await postRequest("auth/local/register", {
            username,
            email,
            password: registerPassword,
        });

        if (result?.jwt) {
            setSuccess("Compte créé avec succès ! Connecte-toi 🎉");
        } else {
            setError("Erreur lors de l'inscription.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-xl p-10 w-full max-w-3xl flex space-x-6">
                {/* Formulaire Connexion */}
                <div className="w-1/2 p-6 border-r border-[#E8A499]">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Connexion</h2>
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Email ou Nom d'utilisateur"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="border border-[#E8A499] p-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#E8A499] transition"
                        />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-[#E8A499] p-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#E8A499] transition"
                        />
                        <button
                            type="submit"
                            className="bg-[#E8A499] text-white p-3 rounded-lg text-lg hover:bg-[#E8A499] focus:outline-none transition"
                        >
                            Se connecter
                        </button>
                    </form>
                </div>

                {/* Formulaire Inscription */}
                <div className="w-1/2 p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Inscription</h2>
                    <form onSubmit={handleRegister} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Nom d'utilisateur"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border border-[#E8A499] p-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#E8A499] transition"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-[#E8A499] p-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#E8A499] transition"
                        />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            className="border border-[#E8A499] p-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#E8A499] transition"
                        />
                        <button
                            type="submit"
                            className="bg-[#E8A499] text-white p-3 rounded-lg text-lg hover:bg-[#E8A499] focus:outline-none transition"
                        >
                            S'inscrire
                        </button>
                    </form>
                </div>
            </div>

            {/* Messages d'erreur / succès */}
            {error && <p className="text-red-500 mt-6 text-center">{error}</p>}
            {success && <p className="text-green-500 mt-6 text-center">{success}</p>}
        </div>
    );
}
