import React  from "react";
import {useState,useEffect} from "react";
import "../styles/styles.css"
import {NavLink, useSearchParams} from "react-router-dom";
import {Category} from "../types/object";
import {api} from "../services/api";
import ItemMenu from "../components/item-menu";
import IconScroll from "../components/icon-scroll";
import {changeProducts} from "../redux/ProductSlice";
import {RootState} from "../redux/Store";
import {useSelector,useDispatch} from "react-redux";

function Menu(){
    const [active, setActive] = useState("Món đặc biệt");
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchParams] = useSearchParams();
    const currentCategory = searchParams.get('category');
    const dispatch = useDispatch();
    const products = useSelector( (state: RootState) => state.changeProduct.products)
    const fetchCategories = async () => {
        try {
            const categories = await api.getCategories();
            setCategories(categories);
        }catch {
            console.log("Error getting categories from API");
        }
    }
    async function changeProductByCategory(nameCategory: string){
        const products = await api.getProductByCategory(nameCategory);
        dispatch(changeProducts(products));
    }
    async function getProducts(){
        const products = await api.getProducts();
        dispatch(changeProducts(products));
    }
    useEffect(() => {
        fetchCategories();
        getProducts();
    },[])
    return (
        <>
            <IconScroll/>
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
                        <div className={"col"}></div>
                            {categories.map(category => (
                                    <div className={`menu-item ${active===category.nameCategory? "active" : ""}`} key={category.id}>
                                        <h3 className={"title-item"} onClick={() =>{
                                            changeProductByCategory(category.nameCategory);
                                            setActive(category.nameCategory)
                                        }
                                        }
                                            >{category.nameCategory}
                                        </h3>
                                        <div className={"col"}></div>
                                    </div>
                            ))}

                    </div>
                </div>
                <div className={"list-item-menu"}>
                    {products.map(product => (
                        <ItemMenu key={product.id} product={product} />
                    ))}
                </div>
            </div>



        </>
    )
}

export default Menu