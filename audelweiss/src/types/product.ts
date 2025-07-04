export interface Product {
    id: number;
    name: string;
    shortDescription: string;
    description: string;
    price: number;
    technical_features?: { label: string; value: string }[];
    additional_info?: { label: string; value: string }[];
    category?: Category;
    main_picture?: Media;
    main_picture_description?: string;
    secondary_pictures?: Media[];
    product_reviews?: ProductReview[];
    discountPercentage?: number;
    isNew?: boolean;
    promoEndDate?: string;
    variations?: ProductVariation[];
}

export interface Category {
    id: number;
    name: string;
}

export interface Media {
    id: number;
    url: string;
    alternativeText?: string;
    formats?: {
        thumbnail?: { url: string };
        small?: { url: string };
        medium?: { url: string };
        large?: { url: string };
    };
}

export interface Option {
    id: number;
    name: string;
}

export interface OptionValue {
    id: number;
    name: string;
    priceImpact?: number;
    hexColor?: string;
    image?: Media;
    option: Option;
}

export type ProductVariation = {
    id: number;
    options: { option: string; values: string[] }[];
    price?: number;
    stock?: number;
    sku?: string;
};

export interface ProductReview {
    id: number;
    rating: number;
    content: string;
    publishedDate: string;
    users_permissions_user: {
        id: number;
        username: string;
        email: string;
    };
}

