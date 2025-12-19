import React from "react";
import { Product } from "../types/object";
import "../styles/styles.css";
import {NavLink} from "react-router-dom";
import {formatPrice} from "./formatPrice";

interface ItemMenuProps {
    product: Product;
}

function ItemMenu({ product }: ItemMenuProps) {
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
                    {formatPrice(product?.price??0)}
                </div>
                <button className={"add-cart"}>Thêm vào giỏ</button>
            </div>
        </div>
    );
}

export default ItemMenu;