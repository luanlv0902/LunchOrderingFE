import React from "react";
import {Product} from "../types/object";
import "../styles/styles.css";
import {NavLink, useNavigate} from "react-router-dom";
import {formatPrice} from "./formatPrice";
import {useContext} from "react";
import {CartContext} from "./CartContext";


interface ItemMenuProps {
    product: Product;
}

function ItemMenu({product}: ItemMenuProps) {
    const {addToCart} = useContext(CartContext);
    const navigate = useNavigate();

    function addToCartContext(product: Product) {
        const userId = localStorage.getItem("userId");
        if (userId) {
            addToCart(product);
            return
        }
        navigate("/login");
    }

    return (
        <div className={"item-menu"}>
            <NavLink to={`/product/${product.id}`}>
                <img
                    className={"imgItem-menu"}
                    src={product.img}
                    alt={product.name}
                />
            </NavLink>
            <div className={"title-item-menu"}>{product.name}</div>
            <div className={"flex-row"}>
                <div className={"price-menu"}>
                    {formatPrice(product?.price ?? 0)}
                </div>
                <button className={"add-cart"}
                        onClick={() =>

                            addToCartContext(product)}
                >
                    Thêm vào giỏ
                </button>
            </div>
        </div>
    );
}

export default ItemMenu;