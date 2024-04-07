import { Address } from '../address';
import { Product } from '../product';

export interface User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    addresses: Address[];
    wishlist: Product[];
    emailVerified: boolean;
    isStaff: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
