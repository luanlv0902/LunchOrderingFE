
import {useSearchParams} from "react-router-dom";
import {Comment, User, Address, Order, OrderItem} from "../types/object";


const GHN_TOKEN = "28cdfced-3b05-11f0-baf0-164baeb3f2fd";
const GHN_BASE = "https://online-gateway.ghn.vn/shiip/public-api/master-data";

const baseUrl = "http://localhost:3001";

interface ProductQuery {
    categoryId?: string;
    keyword?: string;
    sortField?: string;
    order?: string;
    page?: number;
}
interface OrderQuery {
    userId: string;
    status?: string;
    sortField?: string;
    order?: string;
}

export const api = {
    getCategories: async (): Promise<any> => {
        const response = await fetch(`${baseUrl}/categories`)
        return response.json();
    },
    getProducts: async (query: ProductQuery) => {
        const params = new URLSearchParams();
        if (query.categoryId && query.categoryId !== "0") {
            params.append("categoryId", query.categoryId);
        }

        if (query.keyword) {
            params.append("name_like", query.keyword);
        }

        if (query.sortField && query.order) {
            params.append("_sort", query.sortField);
            params.append("_order", query.order);
        }

        const page = query.page || 0;
        params.append("_start", String(page));
        params.append("_end", String(page + 8));

        const res = await fetch(`${baseUrl}/products?${params.toString()}`);
        const data = await res.json();


        const totalRes = await fetch(`${baseUrl}/products?${params.toString().replace(/_start=\d+&_end=\d+/, "")}`);
        const total = await totalRes.json();

        return {
            data,
            totalPage: Math.ceil(total.length / 8)
        };
    },
    getProductByCategory: async (categoryId: string, start: number): Promise<any> => {
        const response = await fetch(`${baseUrl}/products?categoryId=${categoryId}&_start=${start}&_end=${start + 8}`)
        return response.json();
    },
    sortProductByCategory: async (categoryId: string, sortField: string, order: string): Promise<any> => {
        const response = await fetch(`${baseUrl}/products?categoryId=${categoryId}&_sort=${sortField}&_order=${order}&_start=0&_end=8`);
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
    getCommentByProductId: async (detailProductId: string, startIndex: number): Promise<any> => {
        const response = await fetch(`${baseUrl}/comments?detailProductId=${detailProductId}&_sort=dateComment&_order=desc&_start=${startIndex}&_end=${startIndex + 4}&_expand=user`)
        return response.json();
    },
    getTotalCommentsByProductId: async (detailProductId: string): Promise<any> => {
        const response = await fetch(`${baseUrl}/comments?detailProductId=${detailProductId}`)
        return response.json();
    },
    deleteCommentById: async (commentId: string): Promise<any> => {
        const response = await fetch(`${baseUrl}/comments/${commentId}`, {
            method: "DELETE"
        });
        return response.json();
    },
    postComment: async (userId: string, detailProductId: string, rateStar: number, comment: string, dateComment: string): Promise<any> => {
        const response = await fetch(`${baseUrl}/comments`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
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
    getAvgRateByProductid: async (productId: string): Promise<any> => {
        const response = await fetch(`${baseUrl}/comments?detailProductId=${productId}`);
        const data: Comment[] = await response.json();
        let total = 0;
        if(data.length === 0) return 0;
        data.forEach((comment:Comment) => {
            total+=comment.rateStar
        })
        return Number((total/data.length).toFixed(1));
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
        const {password: _, ...userWithoutPassword} = users[0];
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
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username,
                password,
                phone,
                fullName: username,
                role: "USER"
            })
        });

        const newUser: User = await res.json();
        const {password: _, ...userWithoutPassword} = newUser;
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
            headers: {"Content-Type": "application/json"},
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
            headers: {"Content-Type": "application/json"},
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
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        });
        return res.json();
    },
    // ===== Địa chỉ GHN =====
    getProvinces: async () => {
        const res = await fetch(`${GHN_BASE}/province`, {
            headers: {Token: GHN_TOKEN}
        });
        const data = await res.json();
        return data.data.map((p: any) => ({
            code: p.ProvinceID,
            name: p.ProvinceName
        }));
    },

    getDistrictsByProvince: async (provinceCode: string) => {
        const res = await fetch(`${GHN_BASE}/district?province_id=${provinceCode}`, {
            headers: {Token: GHN_TOKEN}
        });
        const data = await res.json();
        return data.data.map((d: any) => ({
            code: d.DistrictID,
            name: d.DistrictName
        }));
    },

    getWardsByDistrict: async (districtCode: string) => {
        const res = await fetch(`${GHN_BASE}/ward?district_id=${districtCode}`, {
            headers: {Token: GHN_TOKEN}
        });
        const data = await res.json();
        return data.data.map((w: any) => ({
            code: w.WardCode,
            name: w.WardName
        }));
    },

    // ===== VOUCHER =====
    // tìm voucher theo mã
    getVoucherByCode: async (code: string) => {
        const res = await fetch(
            `${baseUrl}/vouchers?code=${code}`
        );
        return res.json();
    },

    // lấy voucher của user
    getUserVouchers: async (userId: string) => {
        const res = await fetch(
            `${baseUrl}/userVouchers?userId=${userId}`
        );
        return res.json();
    },

    // lưu voucher cho user
    addUserVoucher: async (data: any) => {
        const res = await fetch(`${baseUrl}/userVouchers`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
        return res.json();
    },

    // đánh dấu voucher đã dùng
    useVoucher: async (id: number) => {
        const res = await fetch(`${baseUrl}/userVouchers/${id}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                used: true,
                usedAt: new Date().toISOString()
            })
        });
        return res.json();
    },

    getUserVouchersWithDetail: async (userId: string) => {
        const res = await fetch(
            `${baseUrl}/userVouchers?userId=${userId}&_expand=voucher`
        );
        return res.json();
    },

    deleteUserVoucher: async (id: number): Promise<void> => {
        await fetch(`${baseUrl}/userVouchers/${id}`, {
            method: "DELETE",
        });
    },

    getAllUserVouchers: async () => {
        const res = await fetch(`${baseUrl}/userVouchers`);
        return res.json();
    },

    // Lấy voucher mới / đang quảng cáo
    getNewVouchers: async () => {
        const res = await fetch(`${baseUrl}/vouchers?active=true&_sort=createdAt&_order=desc`);
        return res.json();
    },

    createOrder: async (
        order: Omit<Order, "id" | "orderItems" | "voucher" | "address">
    ): Promise<Order> => {
        const res = await fetch(`${baseUrl}/orders`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(order),
        });

        if (!res.ok) {
            throw new Error("Không thể tạo đơn hàng");
        }

        return res.json();
    },

    getOrderByUserId: async (query: OrderQuery): Promise<Order[]> => {
        if (!query.userId) {
            throw new Error("userId is required");
        }

        const params = new URLSearchParams();
        params.append("userId", query.userId);

        if (query.status) {
            params.append("status", query.status);
        }

        if (query.sortField && query.order) {
            params.append("_sort", query.sortField);
            params.append("_order", query.order);
        }

        params.append("_embed", "orderItems");
        params.append("_expand", "voucher");
        params.append("_expand", "address");

        const res = await fetch(`${baseUrl}/orders?${params.toString()}`);

        if (!res.ok) {
            throw new Error("Không thể lấy đơn hàng");
        }

        return res.json();
    },

    getOrderItemByOrderId: async (orderId: string) => {
        const res = await fetch(`${baseUrl}/orderItems?orderId=${orderId}&_expand=product`, {})
        return res.json();
    },
    cancelOrder: async (orderId: string) => {
        const getRes = await fetch(`${baseUrl}/orders/${orderId}`);

        const order = await getRes.json();

        // console.log(order.status);
        if (order.status==="PENDING") {
            await fetch(`${baseUrl}/orders/${orderId}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: "CANCEL"
                })
            });
        }

        return {
            success: true,
            message: "Đơn hàng đã được hủy thành công",
            orderId,
            previousStatus: order.status
        };
    },
    createOrderItem: async (item: Omit<OrderItem, "id">) => {
        const res = await fetch(`${baseUrl}/orderItems`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(item),
        });
        return res.json();
    },

}
