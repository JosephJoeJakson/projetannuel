import { notFound } from 'next/navigation';
import { fetchProductById } from '@/services/product';
import ProductView from '@/components/product/ProductView';

interface Props {
    params: { id: string };
}

export default async function ProductPage({ params }: Props) {
    const product = await fetchProductById(params.id);
    if (!product) return notFound();
    console.log(product);
    const allImages = [
        ...(product.main_picture ? [product.main_picture] : []),
        ...(product.secondary_pictures || []),
    ];

    return <ProductView product={product} allImages={allImages} />;
}
