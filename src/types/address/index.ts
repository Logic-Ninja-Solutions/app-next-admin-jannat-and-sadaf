export interface Address {
    id: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    firstName: string;
    lastName: string;
    contactNumber: string;
    zipCode: string;
    isDefault?: boolean | null;
    userId?: string | null;
}
