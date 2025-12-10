import React from "react";
import "../styles/styles.css"
import {useEffect,useState} from "react";
import {api} from  "../services/api"
import {Product} from "../types/object";
function ItemMenu(){
    const [products, setProducts] = useState<Product[]>([]);
    const fetchProducts = async () =>{
        try {
            const products = await api.getProducts();
            setProducts(products);
        }catch {
            console.log("Error getting products from API");
        }
    }
    useEffect(() =>{
        fetchProducts()
    })
    return (
        <>
            {products.map((product) => (
                <>
                    <div key={product.id} className={"item-menu"}>
                        <img className={"imgItem-menu"} src={product.img} alt="food"></img>
                        <div className={"title-item-menu"}>{product.name}</div>
                        {/*<div>Cơm, trứng, hành lá, cà rốt</div>*/}
                        <div className={"flex-row"}>
                            <div className={"price-menu"}>{product.price}đ</div>
                            <button className={"add-cart"}>Thêm vào giỏ</button>
                        </div>
                    </div>
                </>
            ))}
        </>
    )
}
export default ItemMenu;