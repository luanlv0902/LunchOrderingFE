const baseUrl = "http://localhost:3001";

export const api ={
    getCategories: async (): Promise<any> => {
        const response = await fetch(`${baseUrl}/categories`)
        return response.json();
    },
    getProducts: async (): Promise<any> => {
        const response = await fetch(`${baseUrl}/products`)
        return response.json();
    }
}
