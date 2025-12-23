import {User} from "../types/object";

const baseUrl = "http://localhost:3001";

export const api ={
    getCategories: async (): Promise<any> => {
        const response = await fetch(`${baseUrl}/categories`)
        return response.json();
    },
    getProducts: async (): Promise<any> => {
        const response = await fetch(`${baseUrl}/products`)
        return response.json();
    },
    getProductByCategory: async (categoryId: string,start:number): Promise<any> => {
        const response = await fetch(`${baseUrl}/products?categoryId=${categoryId}&_start=${start}&_end=${start+8}`)
       return response.json();
    },
    getProductRecommend: async (categoryId: string): Promise<any> => {
        const response = await fetch(`${baseUrl}/products?categoryId=${categoryId}`)
        return response.json();
    },

    getTotalPage: async (categoryId: string): Promise<any> => {
        const response = await fetch(`${baseUrl}/products?categoryId=${categoryId}`)
        return response.json();
    },
    getProductAndDetailById: async (productId: string): Promise<any> => {
        const response = await fetch(`${baseUrl}/products/${productId}?_embed=detailProducts`)
        return response.json();
    },

    // api search
    searchProducts: async (keyword: string) => {
        const res = await fetch(
            `${baseUrl}/products?name=${encodeURIComponent(keyword)}`
        );
        return res.json();
    },

    login: async (
        username: string,
        password: string
    ): Promise<Omit<User, "password">> => {
        const response = await fetch(
            `${baseUrl}/users?username=${username}&password=${password}`
        );

        const users: User[] = await response.json();

        if (users.length === 0) {
            throw new Error("Sai tài khoản hoặc mật khẩu");
        }
        const { password: _, ...userWithoutPassword } = users[0];
        return userWithoutPassword;
    },

    register: async (
        username: string,
        password: string,
        phone: string
    ): Promise<Omit<User, "password">> => {

        const checkRes = await fetch(
            `${baseUrl}/users?username=${username}`
        );
        const existed = await checkRes.json();

        if (existed.length > 0) {
            throw new Error("Tài khoản đã tồn tại");
        }
        const res = await fetch(`${baseUrl}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                password,
                phone,
                fullName: username,
                role: "USER"
            })
        });

        const newUser: User = await res.json();
        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }
}
