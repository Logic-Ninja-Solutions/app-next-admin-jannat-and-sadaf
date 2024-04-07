import { Address } from '../address';
import { ProductVariant } from '../product';
import { User } from '../user';

export interface CartItem {
    itemID: string;
    slug: string;
    title: string;
    image: string;
    variant: ProductVariant;
    quantity: number;
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
