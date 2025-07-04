'use client';

import { useEffect, useState } from 'react';
import { Promotion, fetchProductPromotions, formatPromotionMessage, isPromotionApplicable, calculatePromotionSavings } from '@/services/promotion';

interface ProductPromotionBannerProps {
  productId: number;
  price: number;
}

export default function ProductPromotionBanner({ productId, price }: ProductPromotionBannerProps) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const productPromotions = await fetchProductPromotions(productId);
        setPromotions(productPromotions);
      } catch (error) {
        console.error('Erreur lors du chargement des promotions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPromotions();
  }, [productId]);

  if (loading) {
    return null;
  }

  const activePromotions = promotions.filter(promotion => promotion.isActive);

  if (activePromotions.length === 0) {
    return null;
  }

  const bestPromotion = activePromotions.sort((a, b) => b.priority - a.priority)[0];
  const savings = calculatePromotionSavings(bestPromotion, bestPromotion.buyQuantity, price);

  return (
    <div className="bg-primary text-primary-content px-4 py-3 rounded-lg mb-6">
      <div className="flex items-center justify-between">
        <span className="text-secondary font-medium">
          {bestPromotion.displayMessage || formatPromotionMessage(bestPromotion)}
        </span>
        <span className="text-xs opacity-90">
          {bestPromotion.buyQuantity}+
        </span>
      </div>
    </div>
  );
} 