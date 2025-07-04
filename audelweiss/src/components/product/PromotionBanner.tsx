'use client';

import { useEffect, useState } from 'react';
import { Promotion, fetchProductPromotions, formatPromotionMessage, isPromotionApplicable, calculatePromotionSavings } from '@/services/promotion';

interface PromotionBannerProps {
  productId: number;
  price: number;
  quantity: number;
}

export default function PromotionBanner({ productId, price, quantity }: PromotionBannerProps) {
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

  const applicablePromotions = promotions.filter(promotion =>
    isPromotionApplicable(promotion, quantity)
  );

  if (applicablePromotions.length === 0) {
    return null;
  }

  const bestPromotion = applicablePromotions.sort((a, b) => b.priority - a.priority)[0];
  const savings = calculatePromotionSavings(bestPromotion, quantity, price);

  return (
    <div className="bg-gradient-to-r from-secondary to-secondary-focus border border-primary rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-semibold text-secondary-content text-sm">
              {bestPromotion.displayMessage || formatPromotionMessage(bestPromotion)}
            </p>
            {savings > 0 && (
              <p className="text-primary text-xs font-medium">
                Économisez {savings.toFixed(2)}€
              </p>
            )}
          </div>
        </div>
        
        {quantity < bestPromotion.buyQuantity && (
          <div className="text-right">
            <p className="text-xs text-neutral">
              Plus que {bestPromotion.buyQuantity - quantity} pour activer
            </p>
            <div className="w-16 h-2 bg-base-300 rounded-full mt-1">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${Math.min((quantity / bestPromotion.buyQuantity) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 