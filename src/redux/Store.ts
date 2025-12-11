import {configureStore} from "@reduxjs/toolkit";
import counterReducer from "./CounterSlice";
import productSlice from "./ProductSlice";

const store = configureStore({
    reducer: {
        counter: counterReducer,
        changeProduct: productSlice
    }
}) ;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;