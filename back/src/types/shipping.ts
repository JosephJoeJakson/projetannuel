export interface ShippingType {
  id: number;
  name: string;
  description?: string;
  price: number;
  estimatedDays: number;
  isActive: boolean;
  minOrderAmount?: number;
  maxWeight?: number;
  freeShippingThreshold?: number;
  priority: number;
  icon?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ShippingOption extends ShippingType {
  finalPrice: number;
  isFree: boolean;
}

export interface ShippingValidation {
  isValid: boolean;
  reason?: string;
}

export interface ShippingCalculationParams {
  orderAmount: number;
  weight?: number;
}

export interface ShippingCalculationResult {
  data: ShippingOption[];
} 