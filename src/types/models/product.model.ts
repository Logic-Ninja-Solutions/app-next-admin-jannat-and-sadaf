export interface ProductVariant {
  size: string;
  quantity: number;
  price: number;
  isAvailable: boolean;
}

export default interface Product {
  id: number;
  title: string;
  description: string;
  slug: string;
  code: string;
  isAvailable: boolean;
  images: string[];
  variants: ProductVariant[];
}
