import React from "react";
import { Product } from "../types/object";
import "../styles/styles.css";

interface ItemMenuProps {
    product: Product;
}

function ItemMenu({ product }: ItemMenuProps) {
    return (
        <div className={"item-menu"}>
            <img
                className={"imgItem-menu"}
                src={product.img}
                alt={product.name}
            />
            <div className={"title-item-menu"}>{product.name}</div>
            <div className={"flex-row"}>
                <div className={"price-menu"}>
                    {product.price}đ
                </div>
                <button className={"add-cart"}>Thêm vào giỏ</button>
            </div>
        </div>
    );
}

export default ItemMenu;