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
    getProductByCategory: async (categoryId: number,start:number): Promise<any> => {
        const response = await fetch(`${baseUrl}/products?categoryId=${categoryId}&_start=${start}&_end=${start+8}`)
       return response.json();
    },

    getTotalPage: async (categoryId: number): Promise<any> => {
        const response = await fetch(`${baseUrl}/products?categoryId=${categoryId}`)
        return response.json();
    },
    getDetailProductById: async (): Promise<any> => {
        const response = await fetch(`${baseUrl}/products?_embed=detailProducts`)
        return response.json();
    }
}
