export interface ProductVariant {
    size: string;
    quantity: number;
    price: number;
    isAvailable: boolean;
}

export interface Product {
    id: string;
    title: string;
    description: string;
    slug: string;
    code: string;
    isAvailable: boolean;
    images: string[];
    variants: ProductVariant[];
    createdAt: Date;
    updatedAt: Date;
    userId?: string | null;
    collectionId?: string | null;
}
