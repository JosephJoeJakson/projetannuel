'use client';

import Link from 'next/link';
import { Product } from '@/types/product';

interface Props {
    products: Product[];
}

export default function RelatedProducts({ products }: Props) {
    if (!products.length) return null;

    return (
        <section className="mt-16">
            <h2 className="text-xl font-semibold mb-6 text-primary">Vous aimerez aussi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="block border rounded-lg p-4 hover:shadow transition"
                    >
                        <img
                            src={`http://localhost:3090${product.main_picture?.formats?.thumbnail?.url || product.main_picture?.url}`}
                            alt={product.main_picture?.alternativeText || product.name}
                            className="w-full h-40 object-cover mb-2 rounded"
                        />
                        <h3 className="text-sm font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-sm text-secondary">{product.price} €</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
