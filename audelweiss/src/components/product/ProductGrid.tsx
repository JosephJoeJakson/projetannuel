import { Product } from '@/types/product';
import ProductCard from "@/components/product/ProductCard";

interface ProductGridProps {
    products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
    return (
        <div className="products__grid">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
