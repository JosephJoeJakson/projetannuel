export default function MerciPage() {
    return (
        <main className="max-w-3xl mx-auto py-20 px-6 text-center">
            <h1 className="text-3xl font-bold mb-6 text-primary">Merci pour votre commande 🎉</h1>
            <p className="text-gray-700 text-lg mb-8">
                Nous avons bien reçu votre commande. Un email de confirmation vous sera envoyé prochainement.
            </p>

            <a
                href="/"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
                Retour à la boutique
            </a>
        </main>
    );
}
