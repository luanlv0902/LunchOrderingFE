import {createContext, useState, useEffect, ReactNode} from "react";
import {Product} from "../types/object";

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    increase: (id: string) => void;
    decrease: (id: string) => void;
    remove: (id: string) => void;
    clearCart: () => void;
    totalPrice: number;
    totalQuantity: number;
}

export const CartContext = createContext<CartContextType>(
    {} as CartContextType
);

export const CartProvider = ({children}: { children: ReactNode }) => {
    const userId = localStorage.getItem("userId");
    const [cart, setCart] = useState<CartItem[]>(() => {
        if (!userId) return [];
        const stored = localStorage.getItem(`cart_${userId}`);
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        if (!userId) return;
        localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    }, [cart, userId]);

    useEffect(() => {
        if (!userId) {
            setCart([]);
            return;
        }
        const stored = localStorage.getItem(`cart_${userId}`);
        setCart(stored ? JSON.parse(stored) : []);
    }, [userId]);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const exist = prev.find(item => item.id === product.id);
            if (exist) {
                return prev.map(item =>
                    item.id === product.id
                        ? {...item, quantity: item.quantity + 1}
                        : item
                );
            }
            return [...prev, {...product, quantity: 1}];
        });
    };

    const increase = (id: string) => {
        setCart(prev =>
            prev.map(item =>
                item.id === id ? {...item, quantity: item.quantity + 1} : item
            )
        );
    };

    const decrease = (id: string) => {
        setCart(prev =>
            prev.map(item =>
                item.id === id
                    ? {...item, quantity: Math.max(1, item.quantity - 1)}
                    : item
            )
        );
    };

    const remove = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => setCart([]);

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                increase,
                decrease,
                remove,
                clearCart,
                totalPrice,
                totalQuantity
            }}
        >
            {children}
        </CartContext.Provider>
    );
};