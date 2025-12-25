import {Comment, User, Address} from "../types/object";
const GHN_TOKEN = "28cdfced-3b05-11f0-baf0-164baeb3f2fd";
const GHN_BASE = "https://online-gateway.ghn.vn/shiip/public-api/master-data";

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
    getCommentByProductId: async (detailProductId: string,startIndex:number): Promise<any> => {
        const response = await fetch(`${baseUrl}/comments?detailProductId=${detailProductId}&_sort=dateComment&_order=desc&_start=${startIndex}&_end=${startIndex+4}&_expand=user`)
        return response.json();
    },
    getTotalCommentsByProductId: async (detailProductId: string): Promise<any> => {
        const response = await fetch(`${baseUrl}/comments?detailProductId=${detailProductId}`)
        return response.json();
    },
    deleteCommentById: async (commentId: string): Promise<any> => {
        const response = await fetch(`${baseUrl}/comments/${commentId}`,{
            method: "DELETE"
        });
        return response.json();
    },
    postComment: async (userId:string,detailProductId:string,rateStar:number,comment:string,dateComment:string): Promise<any> => {
        const response = await fetch(`${baseUrl}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId,
                detailProductId,
                rateStar,
                comment,
                dateComment,
            })
        })
        return response.json();
    },

    // api search
    searchProducts: async (keyword: string) => {
        const res = await fetch(
            `${baseUrl}/products?name_like=${encodeURIComponent(keyword)}`
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
    },

    // ===== PROFILE =====
    getUserById: async (id: string) => {
        const res = await fetch(`${baseUrl}/users/${id}`);
        return res.json();
    },

    updateProfile: async (id: string, data: any) => {
        const res = await fetch(`${baseUrl}/users/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return res.json();
    },


    // Change Password
    changePassword: async (
        userId: string,
        currentPassword: string,
        newPassword: string
    ) => {
        const res = await fetch(`${baseUrl}/users/${userId}`);

        if (!res.ok) {
            throw new Error("Không tìm thấy người dùng");
        }

        const user = await res.json();

        if (user.password !== currentPassword) {
            throw new Error("Mật khẩu hiện tại không đúng");
        }

        await fetch(`${baseUrl}/users/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password: newPassword,
            }),
        });

        return true;
    },

    //Address:
    getAddressesByUser: async (userId: string): Promise<Address[]> => {
        const res = await fetch(
            `http://localhost:3001/addresses?userId=${userId}`
        );
        return res.json();
    },
    //Them dia chi
    addAddress: async (
        address: Omit<Address, "id">
    ): Promise<Address> => {
        const res = await fetch("http://localhost:3001/addresses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(address),
        });
        return res.json();
    },
    //Xoa dia chỉ
    deleteAddress: async (id: number): Promise<void> => {
        await fetch(`http://localhost:3001/addresses/${id}`, {
            method: "DELETE",
        });
    },
    //Cap nhat dia chi
    updateAddress: async (id: number, data: any) => {
        const res = await fetch(`http://localhost:3001/addresses/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return res.json();
    },
    // ===== Địa chỉ GHN =====
    getProvinces: async () => {
        const res = await fetch(`${GHN_BASE}/province`, {
            headers: { Token: GHN_TOKEN }
        });
        const data = await res.json();
        return data.data.map((p: any) => ({
            code: p.ProvinceID,
            name: p.ProvinceName
        }));
    },

    getDistrictsByProvince: async (provinceCode: string) => {
        const res = await fetch(`${GHN_BASE}/district?province_id=${provinceCode}`, {
            headers: { Token: GHN_TOKEN }
        });
        const data = await res.json();
        return data.data.map((d: any) => ({
            code: d.DistrictID,
            name: d.DistrictName
        }));
    },

    getWardsByDistrict: async (districtCode: string) => {
        const res = await fetch(`${GHN_BASE}/ward?district_id=${districtCode}`, {
            headers: { Token: GHN_TOKEN }
        });
        const data = await res.json();
        return data.data.map((w: any) => ({
            code: w.WardCode,
            name: w.WardName
        }));
    }
}
