import { Product } from '@/types/product';
import Link from 'next/link';

export default function ProductCard({ product }: { product: Product }) {
    const image = product.picture?.[0];
    const imageUrl = image ? `http://localhost:3090${image.url}` : '';

    return (
        <div className="border rounded-lg p-4 shadow hover:shadow-md transition flex flex-col justify-between">
            <div>
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={image.alternativeText || ''}
                        className="w-full h-48 object-cover rounded mb-4"
                    />
                )}
                <h3 className="text-lg font-bold text-red-500">{product.name}</h3>
                <p className="text-gray-700">{product.shortDescription}</p>
                <p className="mt-2 font-semibold text-indigo-600">{product.price} €</p>
            </div>

            <div className="mt-4">
                <Link href={`/products/${product.id}`}>
                    <button className="w-full bg-secondary text-white py-2 px-4 rounded hover:opacity-90 transition">
                        Voir le produit
                    </button>
                </Link>
            </div>
        </div>
    );
}
