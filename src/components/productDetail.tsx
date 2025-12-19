import React, {useEffect, useState} from "react";
import Home from "../pages/home";
import Footer from "./Footer";
import IconScroll from "./icon-scroll";
import {DetailProduct, Product} from "../types/object";
import {useParams, useSearchParams} from "react-router-dom";
import {api} from "../services/api";
import {formatPrice} from "./formatPrice";
import ReactPaginate from "react-paginate";
import Paginate from "./paginate";

function ProductDetail() {
    const [product, setProduct] = useState<Product>();
    const [detail, setDetail] = useState<DetailProduct>();
    const {idProduct} = useParams();
    const [pageCountProducts, setPageCountProducts] = useState<number>(0);
    const [productRecommend, setProductRecommend] = useState<Product[]>();
    const [startIndex, setStartIndex] = useState(0);
    const limit = 7;
    const categoryId="7";

    async function fetchProductRecommend(categoryId: string,page: number) {
        const res = await api.getProductByCategory(categoryId, page);
        const totalPage = await api.getTotalPage(categoryId);
        setProductRecommend(res);
        setPageCountProducts(Math.ceil(totalPage.length / limit));
        console.log("Product",res);

    }

    function handlePageProductClick(event: { selected: number }) {
        const newStartIndex = event.selected * limit;
        setStartIndex(newStartIndex);
        fetchProductRecommend(categoryId,newStartIndex);
    }

    async function fetchProducts() {
        if (idProduct != null) {
            const res = await api.getProductAndDetailById(idProduct);
            setProduct(res);
            setDetail(res.detailProducts[0]);
            // console.log(res.detailProducts[0]);
        }

    }
    async function handleCommentPage(event: { selected: number }) {

    }
    useEffect(() => {
        fetchProducts();
        fetchProductRecommend(categoryId,pageCountProducts);
    },[])
    return (
        <>
            {/*<Home/>*/}
            {/*<Footer/>*/}
            {/*<IconScroll/>*/}
            <div className="productDetail">
                <div className={"pd1"}>
                    <img src={product?.img} alt="Food" className="productDetailImg"/>
                    <div className={"detail"}>
                        <div className={"nameP"}>{product?.name}</div>
                        <div className={"detailInfor"}>Thành phần: {detail?.ingredients}</div>
                        <div className={"detailInfor"}>Calories: {detail?.calories} kcal</div>
                        <div className={"detailInfor"}>Protein: {detail?.protein} g</div>
                        <div className={"detailInfor"}>Fat: {detail?.fat} kcal</div>
                        <div className={"detailInfor"}>Carbs: {detail?.carbs} g</div>
                        <div className={"rateAvg"}>
                            4.8
                            <i className="fa-solid fa-star" ></i>

                        </div>
                        <div className="price-detail">{
                            formatPrice(product?.price??0)
                        }</div>
                        <div className="priceAndCart">
                            <div className="add-cart-detail">Thêm vào giỏ</div>
                            <div className="buy-now">Mua ngay</div>

                        </div>

                    </div>
                </div>
                <h3>Đánh giá</h3>
                <div className={"pd2"}>
                    <div className={"pd2_1"}>
                        <div className={"commentBlock"}>
                            <div className={"comment-detail"}>
                                <div className={"avatarComment"}>
                                    <img
                                        src="https://s3-api.fpt.vn/fptvn-storage/2025-10-31/1761877304_top-30-mod-minecraft-hay-moi-nhat-2025.jpg"
                                        alt="avatar" className="commentImg"/>
                                    <div className={"nameUser"}>Nguyễn Thiện</div>
                                </div>
                                <div className={"flex-row"}>
                                    <div className={"dateComment"}>12/12/2025</div>
                                    <i className="fa-solid fa-ellipsis-vertical"></i>
                                </div>

                            </div>

                            <div className={"comment-detail"}>

                                <div className={"comment"}>Ngon ơi là ngon!</div>
                                <div><i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                </div>

                            </div>
                        </div>
                        <div className={"commentBlock"}>
                            <div className={"comment-detail"}>
                                <div className={"avatarComment"}>
                                    <img src="https://s3-api.fpt.vn/fptvn-storage/2025-10-31/1761877304_top-30-mod-minecraft-hay-moi-nhat-2025.jpg" alt="avatar" className="commentImg"/>
                                    <div className={"nameUser"}>Nguyễn Thiện</div>
                                </div>
                                <div className={"dateComment"}>12/12/2025</div>

                            </div>
                            <div className={"comment-detail"}>
                                <div className={"comment"}>Ngon ơi là ngon!</div>
                                <div><i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                </div>

                            </div>
                        </div>
                        <div className={"commentBlock"}>
                            <div className={"comment-detail"}>
                                <div className={"avatarComment"}>
                                    <img src="https://s3-api.fpt.vn/fptvn-storage/2025-10-31/1761877304_top-30-mod-minecraft-hay-moi-nhat-2025.jpg" alt="avatar" className="commentImg"/>
                                    <div className={"nameUser"}>Nguyễn Thiện</div>
                                </div>
                                <div className={"dateComment"}>12/12/2025</div>

                            </div>
                            <div className={"comment-detail"}>
                                <div className={"comment"}>Ngon ơi là ngon!</div>
                                <div><i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                </div>

                            </div>
                        </div>
                        <div className={"commentBlock"}>
                            <div className={"comment-detail"}>
                                <div className={"avatarComment"}>
                                    <img src="https://s3-api.fpt.vn/fptvn-storage/2025-10-31/1761877304_top-30-mod-minecraft-hay-moi-nhat-2025.jpg" alt="avatar" className="commentImg"/>
                                    <div className={"nameUser"}>Nguyễn Thiện</div>
                                </div>
                                <div className={"dateComment"}>12/12/2025</div>

                            </div>
                            <div className={"comment-detail"}>
                                <div className={"comment"}>Ngon ơi là ngon!</div>
                                <div><i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                </div>

                            </div>
                        </div>
                        <div className={"commentBlock"}>
                            <div className={"comment-detail"}>
                                <div className={"avatarComment"}>
                                    <img src="https://s3-api.fpt.vn/fptvn-storage/2025-10-31/1761877304_top-30-mod-minecraft-hay-moi-nhat-2025.jpg" alt="avatar" className="commentImg"/>
                                    <div className={"nameUser"}>Nguyễn Thiện</div>
                                </div>
                                <div className={"dateComment"}>12/12/2025</div>

                            </div>
                            <div className={"comment-detail"}>
                                <div className={"comment"}>Ngon ơi là ngon!</div>
                                <div><i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                </div>

                            </div>
                        </div>


                    </div>
                    <Paginate pageCount={5} onPageChange={handleCommentPage}/>
                    <div className={"input-comment-block"}>
                        <input type="text" placeholder={"Bình luận"} className={"input-comment"}/>
                        <div className={"stars"}>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                            <i className="fa-regular fa-star"></i>
                        </div>
                        <i className="fa-solid fa-paper-plane send"></i>
                    </div>
                </div>
                <h1>Gợi ý</h1>
                <div className={"pd3"}>

                    {productRecommend?.map((item: Product, index: number) => {
                        return (
                            <div className={"item-recommend"} key={item.id}>
                                <img src={item.img} alt="img-recommend" className="img-recommend"/>
                                <div>{item.name}</div>
                                <div className={"price-recommend"}>{formatPrice(item.price)}</div>
                                <div className={"add-cart-recommend"}>Thêm vào giỏ</div>
                            </div>
                        )
                    })}



                </div>
                <Paginate pageCount={pageCountProducts} onPageChange={handlePageProductClick}/>
            </div>
        </>
    )
}
export default ProductDetail;