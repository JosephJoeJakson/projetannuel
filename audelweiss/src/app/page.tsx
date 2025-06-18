'use client';
import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import SectionTitle from '@/components/common/SectionTitle';
import {fetchProducts} from "@/services/product";
import ProductSearch from "@/components/product/ProductSearch";
import ProductGrid from "@/components/product/ProductGrid";

export default function Home() {
<<<<<<< HEAD
  return (
    
    <div>
      test
    </div>
  );
=======
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetchProducts()
            .then((data) => {
                setProducts(data);
                setFilteredProducts(data);
            })
            .catch(console.error);
    }, []);

    const handleSearch = (query: string) => {
        const lower = query.toLowerCase();
        const filtered = products.filter((p) =>
            p.name.toLowerCase().includes(lower) ||
            p.description?.toLowerCase().includes(lower) ||
            p.shortDescription?.toLowerCase().includes(lower)
        );
        setFilteredProducts(filtered);
    };

    return (
        <main className="max-w-6xl mx-auto px-4 py-8">
            <SectionTitle>Nos produits</SectionTitle>
            <ProductSearch onSearch={handleSearch} />
            <ProductGrid products={filteredProducts} />
        </main>
    );
>>>>>>> 1fea016c6d752b6dab430bfc73825ef24092fd4d
}
