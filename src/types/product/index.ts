export interface ProductVariant {
    size: string;
    price: number;
    isAvailable: boolean;
    sizeMetadata?: { label: string; value: string }[];
}

export interface Product {
    id: string;
    title: string;
    description: string;
    slug: string;
    code: string;
    isAvailable: boolean;
    isNew: boolean;
    images: string[];
    variants: ProductVariant[];
    createdAt: Date;
    updatedAt: Date;
    userId?: string | null;
    collectionId?: string | null;
    isCustomizable?: boolean;
}
