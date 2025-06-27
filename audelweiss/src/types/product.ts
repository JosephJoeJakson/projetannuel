export interface Product {
    id: number;
    name: string;
    shortDescription: string;
    description: string;
    price: number;

    category?: Category;
    main_picture?: Media;
    main_picture_description?: string;
    secondary_pictures?: Media[];

    variationCombinations: ProductVariationCombination[];
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

export interface ProductVariationCombination {
    id: number;
    sku?: string;
    price: number;
    stock: number;
    optionValues: OptionValue[];
}
