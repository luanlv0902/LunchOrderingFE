export interface DetailProduct {
    id: string;
    productId: string;
    ingredients: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
}

export interface Product {
    id: string;
    name: string;
    img: string;
    categoryId: string;
    price: number;
    detailProducts?: DetailProduct;
}

export interface Comment {
    id: string;
    userId: string;
    detailProductId: string;
    rateStar: number;
    comment: string;
    dateComment: string
    user?: User;

}

export interface Category {
    id: string;
    nameCategory: string;

}

export interface User {
    id: number;
    username: string;
    password: string;
    fullName: string;
    role: "USER" | "ADMIN";
    phone: string;
    birthday: string;
    gender: "Nam" | "Nữ" | "Khác";
    avatar: string;
}

export interface Address {
    id: number;
    userId: string;
    receiverName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    detail: string;
    isDefault: boolean;
}

export interface Voucher {
    id: number;
    code: string;
    title: string;
    description: string;
    discountType: "PERCENT" | "FIXED" | "FREESHIP";
    discountValue: number;
    maxDiscount?: number;
    minOrder: number;
    expireDate: string;
    quantity: number;
}

export interface UserVoucher {
    id: number;
    userId: string;
    voucherId: number;
    code: string;
    used: boolean;
    usedAt?: string;
    voucher: Voucher;
}

export interface OrderItem {
   id: string;
   productId: string;
   orderId: string;
   quantity: number;
   product?: Product;
}

export interface Order {
    id: string;
    userId: string;
    orderItems?: OrderItem[];
    totalPrice: number;
    discount?: number;
    shippingFee: number;
    finalPrice?: number;
    addressId: number;
    voucherId?: string;
    noteForChef?: string;
    methodPayment: | "CASH" | "BANK" | "MOMO" | "VNPAY";
    status: | "WAITING_PAYMENT" | "PENDING" | "COOKING" | "DELIVERING" | "COMPLETE" | "CANCEL";
    createdAt: string;
    voucher?: Voucher;
    address?: Address;
}
export interface Contact{
    id: string;
    nameClient: string;
    phone: string;
    email: string;
    content: string;
}