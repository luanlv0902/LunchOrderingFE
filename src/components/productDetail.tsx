import React, {useEffect, useState} from "react";
import Home from "../pages/home";
import Footer from "./Footer";
import IconScroll from "./icon-scroll";
import {Product} from "../types/object";
import {useParams, useSearchParams} from "react-router-dom";
import {api} from "../services/api";

function ProductDetail() {
    const [product, setProduct] = useState<Product>();
    const {idProduct} = useParams();

    // async function fetchProducts() {
    //     if (idProduct != null) {
    //         const product = await api.getProductById(parseInt(idProduct));
    //         setProduct(product);
    //     }
    //
    // }
    // useEffect(() => {
    //     fetchProducts();
    // },[])
    return (
        <>
            {/*<Home/>*/}
            {/*<Footer/>*/}
            {/*<IconScroll/>*/}
            <div className="productDetail">
                <div className={"pd1"}>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpDz4-GZI5EPxY_2Q-d_HnCANSJ42Cf6EFWg&s" alt="Food" className="productDetailImg"/>
                    <div className={"detail"}>
                        <div className={"nameP"}>${product?.name}</div>
                        <div className={"detailInfor"}>Thành phần: Mỳ, rau thơm, sốt Hàn Quốc</div>
                        <div className={"detailInfor"}>Calories: 400 kcal</div>
                        <div className={"detailInfor"}>Protein: 20 g</div>
                        <div className={"detailInfor"}>Fat: 10 kcal</div>
                        <div className={"detailInfor"}>Carbs: 10 g</div>
                        <div className={"rateAvg"}>
                            4.8
                            <i className="fa-solid fa-star" ></i>

                        </div>
                        <div className={"priceAndCart"}>
                            <div className={"price-detail"}>100.000đ</div>
                            <div className={"add-cart-detail"}>Thêm vào giỏ</div>
                        </div>
                    </div>
                </div>
                <h3>Đánh giá</h3>
                <div className={"pd2"}>

                    {/*<div className={"stars"}>*/}
                    {/*    <div className={"star"}></div>*/}
                    {/*    <div className={"star"}></div>*/}
                    {/*    <div className={"star"}></div>*/}
                    {/*    <div className={"star"}></div>*/}
                    {/*    <div className={"star"}></div>*/}
                    {/*</div>*/}
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
                <div className={"pd3"}>

                </div>
            </div>
        </>
    )
}
export default ProductDetail;