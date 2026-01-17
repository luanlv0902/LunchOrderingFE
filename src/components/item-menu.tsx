import React, { useContext } from "react";
import { Product } from "../types/object";
import "../styles/styles.css";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { formatPrice } from "./formatPrice";
import { CartContext } from "./CartContext";

interface ItemMenuProps {
    product: Product;
}

function ItemMenu({ product }: ItemMenuProps) {
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();

    function addToCartContext(product: Product) {
        const userId = localStorage.getItem("userId");

        if (userId) {
            addToCart(product);
            return;
        }

        // 🔥 CHÌA KHÓA Ở ĐÂY
        navigate("/login", {
            state: {
                from: location.pathname + location.search,
                pendingProduct: product,
            },
        });
    }

    return (
        <div className="item-menu">
            <NavLink to={`/product/${product.id}`}>
                <img
                    className="imgItem-menu"
                    src={product.img}
                    alt={product.name}
                />
            </NavLink>

            <div className="title-item-menu">{product.name}</div>

            <div className="flex-row">
                <div className="price-menu">
                    {formatPrice(product?.price ?? 0)}
                </div>

                <button
                    className="add-cart"
                    onClick={() => addToCartContext(product)}
                >
                    Thêm vào giỏ
                </button>
            </div>
        </div>
    );
}

export default ItemMenu;