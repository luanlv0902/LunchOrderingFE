import React from "react";
import {useState, useEffect} from "react";
import "../styles/styles.css"
// import { useSearchParams} from "react-router-dom";
import {Category, Product} from "../types/object";
import {api} from "../services/api";
import ItemMenu from "../components/item-menu";
import IconScroll from "../components/icon-scroll";
// import {changeProducts} from "../redux/ProductSlice";
// import {RootState} from "../redux/Store";
// import {useSelector,useDispatch} from "react-redux";
import Paginate from "../components/paginate";
import {useSearchParams} from "react-router-dom";


function Menu() {
    const [active, setActive] = useState("Món đặc biệt");
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [pageCount, setPageCount] = useState(1);
    const [startIndex, setStartIndex] = useState(0);
    const [categoryId, setCategoryId] = useState("0");
    const [activePage, setActivePage] = useState(true);
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("search") || "";
    const limit = 8
    // const [searchParams] = useSearchParams();
    // const currentCategory = searchParams.get('category');
    // const dispatch = useDispatch();
    // const products = useSelector( (state: RootState) => state.changeProduct.products)
    const fetchCategories = async () => {
        try {
            const categories = await api.getCategories();
            setCategories(categories);
        } catch {
            console.log("Error getting categories from API");
        }
    }

    async function changeProductByCategory(categoryId: string, page: number) {
        const res = await api.getProductByCategory(categoryId, page);
        const totalPage = await api.getTotalPage(categoryId);
        // dispatch(changeProducts(products));
        setCategoryId(categoryId);
        setProducts(res);
        setPageCount(Math.ceil(totalPage.length / limit));
        console.log(res);
        console.log(page);
    }

    async function getProducts() {
        const products = await api.getProducts();
        // dispatch(changeProducts(products));
        setProducts(products);
    }

    function handlePageClick(event: { selected: number }) {
        const newStartIndex = event.selected * limit;
        setStartIndex(newStartIndex);
        changeProductByCategory(categoryId, newStartIndex);
        console.log("New Start Index:", newStartIndex);
    }

    //search product
    async function searchProducts() {
        const res = await api.searchProducts(keyword);
        setProducts(res);
        setPageCount(1);
    }

    // load categories
    useEffect(() => {
        fetchCategories();
    }, []);

    // search or load all
    useEffect(() => {
        if (keyword.trim()) {
            searchProducts();
        } else {
            getProducts();
        }
    }, [keyword]);

    return (
        <>
            {/*<IconScroll/>*/}
            <div className={"container-menu"}>
                <div className={"header-menu"}>
                    <div className={"filter-menu"}>
                        <h1 className={"title-menu"}>ALL MENUS</h1>
                        <div className={"filter-order"}>
                            <input type="text" placeholder={"Tìm kiếm"} className={"search-order"}/>
                            <div className={"filter-menu-search"}>
                                <div className={"title-sort"}>Sắp xếp theo</div>
                                <select name="sort" id="sortOrder" className={"sort-order"}>
                                    <option>Mặc định</option>
                                    <option>Giá tăng dần</option>
                                    <option>Giá giảm dần</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className={"menu"}>
                        <div className={"col"}></div>
                        {categories.map(category => (
                            <div className={`menu-item ${active === category.nameCategory ? "active" : ""}`}
                                 key={category.id}>
                                <h3 className={"title-item"} onClick={() => {
                                    changeProductByCategory(category.id, startIndex);
                                    setActive(category.nameCategory);
                                    setStartIndex(0);
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
                        <ItemMenu key={product.id} product={product}/>
                    ))}
                </div>

            </div>

            <Paginate pageCount={pageCount} onPageChange={handlePageClick}/>
            {/*<ReactPaginate*/}
            {/*    containerClassName="pagination"*/}

            {/*    pageClassName=""*/}
            {/*    pageLinkClassName=""*/}

            {/*    previousClassName="previous"*/}
            {/*    previousLinkClassName=""*/}

            {/*    nextClassName="next"*/}
            {/*    nextLinkClassName=""*/}

            {/*    breakClassName="break"*/}
            {/*    breakLinkClassName=""*/}

            {/*    activeClassName="active"*/}
            {/*    disabledClassName="disabled"*/}
            {/*    previousLabel="<"*/}
            {/*    nextLabel=">"*/}
            {/*    breakLabel="..."*/}
            {/*    onPageChange={handlePageClick}*/}
            {/*    pageRangeDisplayed={5}*/}
            {/*    pageCount={pageCount}*/}
            {/*    renderOnZeroPageCount={null}*/}
            {/*/>*/}
        </>
    )
}

export default Menu