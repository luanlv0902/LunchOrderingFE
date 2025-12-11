import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Product} from "../types/object";

interface ProductState{
    products: Product[];
}
const initialState: ProductState = {
    products: [],
}
const productSlice = createSlice({
    name: 'changeProduct',
    initialState,
    reducers:{
        changeProducts: (state, action: PayloadAction<Product[]>) => {
            state.products = action.payload;
        }
    }
})
export const {changeProducts} = productSlice.actions;
export default productSlice.reducer;

