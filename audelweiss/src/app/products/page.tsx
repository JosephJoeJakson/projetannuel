'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types/product';
import {fetchProducts, fetchCategories, fetchCategoryIdBySlug} from '@/services/product';
import SectionTitle from '@/components/common/SectionTitle';
import ProductGrid from '@/components/product/ProductGrid';
import ProductSidebarFilters from '@/components/product/ProductSidebarFilters';
import ActiveFilters from "@/components/product/ActiveFilters";
import Pagination from '@/components/common/Pagination';

export default function Home() {
    const searchParams = useSearchParams();
    const categorySlug = searchParams.get('category') ?? '';
    const hasDiscountParam = searchParams.get('hasDiscount') === 'true';
    const isNewParam = searchParams.get('isNew') === 'true';

    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [isNewFilter, setIsNewFilter] = useState(isNewParam);
    const [hasDiscountFilter, setHasDiscountFilter] = useState(hasDiscountParam);

    const ITEMS_PER_PAGE = 30;

    useEffect(() => {
        fetchProducts().then((data) => {
            setProducts(data);
            setFilteredProducts(data);
        });
        fetchCategories().then(setCategories);
    }, []);

    useEffect(() => {
        if (categorySlug) {
            fetchCategoryIdBySlug(categorySlug).then((id) => {
                if (id) {
                    setSelectedCategory(id);
                }
            });
        }
    }, [categorySlug]);

    useEffect(() => {
        const hasDiscountParam = searchParams.get('hasDiscount') === 'true';
        const isNewParam = searchParams.get('isNew') === 'true';
        const categorySlugParam = searchParams.get('category');
        
        setSearchQuery('');
        setPriceRange({ min: 0, max: 500 });
        setSelectedRating(null);
        setCurrentPage(1);
        
        if (hasDiscountParam) {
            setHasDiscountFilter(true);
            setIsNewFilter(false);
            setSelectedCategory(null);
        } else if (isNewParam) {
            setHasDiscountFilter(false);
            setIsNewFilter(true);
            setSelectedCategory(null);
        } else if (categorySlugParam) {
            setHasDiscountFilter(false);
            setIsNewFilter(false);
        } else {
            setHasDiscountFilter(false);
            setIsNewFilter(false);
            setSelectedCategory(null);
        }
    }, [searchParams]);

    useEffect(() => {
        let filtered = [...products];

        if (searchQuery) {
            const lower = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.name.toLowerCase().includes(lower) ||
                    p.description?.toLowerCase().includes(lower) ||
                    p.shortDescription?.toLowerCase().includes(lower)
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(
                (p) => p.category?.id === selectedCategory
            );
        }

        filtered = filtered.filter(
            (p) => p.price >= priceRange.min && p.price <= priceRange.max
        );

        if (selectedRating) {
            filtered = filtered.filter((p) => {
                const ratings = p.product_reviews?.map((r) => r.rating) || [];
                if (ratings.length === 0) return false;
                const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                return avg >= selectedRating;
            });
        }

        if (isNewFilter) {
            filtered = filtered.filter((p) => p.isNew === true);
        }

        if (hasDiscountFilter) {
            filtered = filtered.filter((p) => (p.discountPercentage || 0) > 0);
        }

        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, products, priceRange, selectedRating, isNewFilter, hasDiscountFilter]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="max-w-7xl mx-auto px-4 py-8">
            <SectionTitle>Nos produits</SectionTitle>
            <div className="grid md:grid-cols-[250px_1fr] gap-6 mt-6">
                <ProductSidebarFilters
                    onApply={({ query, categoryId, minPrice, maxPrice, rating, isNew, hasDiscount }) => {
                        setSearchQuery(query);
                        setSelectedCategory(categoryId);
                        setPriceRange({ min: minPrice, max: maxPrice });
                        setSelectedRating(rating);
                        setIsNewFilter(isNew);
                        setHasDiscountFilter(hasDiscount);
                    }}
                    onReset={() => {
                        setSearchQuery('');
                        setSelectedCategory(null);
                        setPriceRange({ min: 0, max: 500 });
                        setSelectedRating(null);
                        setIsNewFilter(false);
                        setHasDiscountFilter(false);
                    }}
                />

                <div>
                    <ActiveFilters
                        query={searchQuery}
                        category={categories.find(c => c.id === selectedCategory) || null}
                        minPrice={priceRange.min}
                        maxPrice={priceRange.max}
                        rating={selectedRating}
                        isNew={isNewFilter}
                        hasDiscount={hasDiscountFilter}
                        onRemove={(type) => {
                            if (type === 'query') setSearchQuery('');
                            if (type === 'category') setSelectedCategory(null);
                            if (type === 'price') setPriceRange({ min: 0, max: 500 });
                            if (type === 'rating') setSelectedRating(null);
                            if (type === 'isNew') setIsNewFilter(false);
                            if (type === 'hasDiscount') setHasDiscountFilter(false);
                        }}
                    />

                    {currentProducts.length > 0 ? (
                        <>
                            <div className="mb-4 text-sm text-gray-600">
                                Affichage de {startIndex + 1} à {Math.min(endIndex, filteredProducts.length)} sur {filteredProducts.length} produits
                            </div>
                            <ProductGrid products={currentProducts} />
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-semibold mb-4">Oups ! Pas de produit dispo</h2>
                            <p className="text-gray-600 max-w-lg mx-auto">
                                Il n'y a visiblement pas de produit qui correspond à ce que tu cherches.<br />
                                N'hésite pas à me contacter afin de voir la possibilité d'une création sur mesure 🌻
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
