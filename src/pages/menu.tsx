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
import order from "./order";


function Menu() {
    const [active, setActive] = useState("Món nổi bật");
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [pageCount, setPageCount] = useState(1);

    const [searchParams, setSearchParams] = useSearchParams();

    const query = {
        categoryId: searchParams.get("category") || "",
        keyword: searchParams.get("search") || "",
        sortField: searchParams.get("sort") || "",
        order: searchParams.get("order") || "",
        page: Number(searchParams.get("page") || 0),
    };


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
    function onChangeOption(e: React.ChangeEvent<HTMLSelectElement>) {
        const [field, order] = e.target.value.split("-");

        setSearchParams(prev => {
            if (field === "id") {
                prev.delete("sort");
                prev.delete("order");
            } else {
                prev.set("sort", field);
                prev.set("order", order);
            }
            prev.set("page", "0");
            return prev;
        });
    }

    function changeProductByCategory(categoryId: string) {
        setSearchParams(prev => {
            prev.set("category", categoryId);
            prev.set("page", "0");
            return prev;
        });
    }


    async function getProducts() {
        const res = await api.getProducts(query);
        // dispatch(changeProducts(products));
        console.log(res);
        setProducts(res.data);
        setPageCount(res.totalPage);
    }
    async function getProductsByCategory(categoryId: string) {
        const res= await api.getProductByCategory(categoryId,0);
        setProducts(res);
    }

    function handlePageClick(event: { selected: number }) {
        setSearchParams(prev => {
            prev.set("page", String(event.selected));
            return prev;
        });
    }


    //search product
    // async function searchProducts() {
    //     const res = await api.searchProducts(keyword);
    //     setProducts(res);
    //     // setPageCount(1);
    // }
    useEffect(() => {
        if (searchParams.toString() === "") {
            setSearchParams(prev => {
                prev.set("category", "1");
                prev.set("page", "0");
                return prev;
            }, { replace: true });
            return;
        }
        getProducts();

    }, [searchParams, setSearchParams]);


    useEffect(() => {
        fetchCategories();
    }, []);

    // search or load all
    // useEffect(() => {
    //     // if (keyword.trim()) {
    //     //     searchProducts();
    //     // } else {
    //     //     getProducts();
    //     // }
    //     setQuery(prev => ({
    //         ...prev,
    //         keyword,
    //         page: 0
    //     }));
    //     setIsReady(true);
    // }, [keyword]);

    return (
        <>
            {/*<IconScroll/>*/}
            <div className={"container-menu"}>
                <div className={"header-menu"}>
                    <div className="filter-menu">
                        <div className="menu-left"></div>

                        <h1 className="title-menu">ALL MENUS</h1>

                        <div className="filter-menu-search">
                            <div className="title-sort">Sắp xếp theo</div>
                            <select className="sort-order" onChange={onChangeOption}>
                                <option value="id-asc">Mặc định</option>
                                <option value="price-asc">Giá tăng dần</option>
                                <option value="price-desc">Giá giảm dần</option>
                            </select>
                        </div>
                    </div>

                    <div className={"menu"}>
                        <div className={"col"}></div>
                        {categories.map(category => (
                            <div className={`menu-item ${active === category.nameCategory ? "active" : ""}`}
                                 key={category.id}>
                                <h3 className={"title-item"} onClick={() => {
                                    changeProductByCategory(category.id);
                                    setActive(category.nameCategory);
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