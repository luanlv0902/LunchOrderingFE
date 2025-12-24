export interface DetailProduct {
    id: string;
    productId: string;
    ingredients: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    quantity: number;
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
