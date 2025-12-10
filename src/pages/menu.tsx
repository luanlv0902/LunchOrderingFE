import React  from "react";
import {useState,useEffect} from "react";
import "../styles/styles.css"

import {Category} from "../types/object";
import {api} from "../services/api";
import ItemMenu from "../components/item-menu";

function Menu(){
    const [categories, setCategories] = useState<Category[]>([]);

    const fetchCategories = async () => {
        try {
            const categories = await api.getCategories();
            setCategories(categories);
        }catch {
            console.log("Error getting categories from API");
        }
    }
    useEffect(() => {
        fetchCategories();
    })
    return (
        <>
            <div className={"container-menu"}>
                <div className={"header-menu"}>
                   <div className={"filter-menu"}>
                       <h1 className={"title-menu"}>ALL MENUS</h1>
                       <div className={"filter-order"}>
                           <input type="text" placeholder={"Tìm kiếm"} className={"search-order"}/>
                           <div className={"filter-menu-search"}>
                               <div className={"title-sort"}>Sắp xếp theo</div>
                               <select name="sort" id="sortOrder" className={"sort-order"}>
                                   <option >Mặc định</option>
                                   <option>Giá tăng dần</option>
                                   <option>Giá giảm dần</option>
                               </select>
                           </div>
                       </div>
                   </div>
                    <div className={"menu"}>
                        {/*<h3 className={"menu-item"}>MÓN CƠM</h3>*/}
                        {/*<div className={"col"}></div>*/}
                        {/*<h3 className={"menu-item"}>MÓN CHAY</h3>*/}
                        {/*<div className={"col"}></div>*/}
                        {/*<h3 className={"menu-item"}>MÓN CÁ</h3>*/}
                        {/*<div className={"col"}></div>*/}
                        {/*<h3 className={"menu-item"}>MÓN THỊT</h3>*/}
                        {/*<div className={"col"}></div>*/}
                        {/*<h3 className={"menu-item"}>MÓN RAU</h3>*/}
                        {/*<div className={"col"}></div>*/}
                        {/*<h3 className={"menu-item"}>MÓN CANH</h3>*/}
                        {/*<div className={"col"}></div>*/}
                        {/*<h3 className={"menu-item"}>MÓN ĐẶC BIỆT</h3>*/}
                        {/*<div className={"col"}></div>*/}
                        {/*<h3 className={"menu-item"}>MÓN TRÁNG MIỆNG</h3>*/}
                        <div className={"col"}></div>
                        {categories.map(category => (
                            <>
                                <h3 className={"menu-item"}>{category.nameCategory}</h3>
                                <div className={"col"}></div>
                            </>
                        ))}

                    </div>
                </div>
                <div className={"list-item-menu"}>
                   <ItemMenu />
                </div>
            </div>



        </>
    )
}

export default Menu