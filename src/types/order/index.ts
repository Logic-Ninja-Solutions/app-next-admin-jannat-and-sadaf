import { Address } from '../address';
import { ProductVariant } from '../product';
import { User } from '../user';

export interface FrontSizes {
    'Neck Depth'?: string;
    'Sleeve Length'?: string;
    'Shirt Length'?: string;
    'Bust Circumference'?: string;
    Waist?: string;
    'Hip Circumference'?: string;
    'Thigh Circumference'?: string;
    'Knee Circumference'?: string;
    'Calf Circumference'?: string;
    Ankle?: string;
  }

  export interface BackSizes {
    'Back Neck Depth'?: string;
    'Cross Shoulder'?: string;
    'Trouser Length'?: string;
    Armhole?: string;
    Bicep?: string;
  }

  export type CustomSizes = FrontSizes & BackSizes;

  export type CustomSizePreference = 'custom' | 'callback';

  export interface CartItem {
    itemID: string;
    slug: string;
    title: string;
    image: string;
    variant: ProductVariant;
    quantity: number;
    customSizeData: CustomSizes;
    customSizePreference: CustomSizePreference;
  }

export interface Order {
    id: string;
    orderNumber: string;
    items: CartItem[];
    shippingPrice: number;
    paymentMethod: string;
    totalPrice: number;
    address: Address;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    userId?: string | null;
    addressId: string;
    user?: User;
}
