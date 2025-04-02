import { notFound } from 'next/navigation';
import {fetchProductById} from "@/services/product";
import Link from "next/link";

interface Props {
    params: { id: string };
}

export default async function ProductPage({ params }: Props) {
    const product = await fetchProductById(params.id);
    if (!product) return notFound();

    const image = product.picture?.[0];
    const imageUrl = image ? `http://localhost:3090${image.url}` : '';

    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
            <Link href="/" className="text-secondary hover:underline mb-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 inline-block mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 19l-7-7 7-7" />
                </svg>
                Retour à la liste des produits
            </Link>
            <div className="grid md:grid-cols-2 gap-8 items-start mt-4">
                <div>
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt={image.alternativeText || ''}
                            className="w-full rounded-lg shadow"
                        />
                    )}
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-primary mb-2">{product.name}</h1>
                    <p className="text-secondary text-xl font-semibold mb-4">{product.price} €</p>
                    <p className="text-gray-700 mb-6">{product.description}</p>
                    <button className="bg-secondary text-white px-4 py-2 rounded hover:opacity-90 transition">
                        Ajouter au panier
                    </button>
                </div>
            </div>
        </main>
    );
}
