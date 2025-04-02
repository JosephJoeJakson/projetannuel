export interface Product {
    id: number;
    name: string;
    description: string;
    shortDescription: string;
    price: number;
    picture: {
        url: string;
        alternativeText?: string;
    }[];
    category?: {
        id: number;
        name: string;
    };
    product_variations: any[];
}
