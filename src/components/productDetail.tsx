import React, {useContext, useEffect, useRef, useState} from "react";
import Home from "../pages/home";
import Footer from "./Footer";
import IconScroll from "./icon-scroll";
import {DetailProduct, Product, Comment, User} from "../types/object";
import {useParams, useSearchParams} from "react-router-dom";
import {api} from "../services/api";
import {formatPrice} from "./formatPrice";
import ReactPaginate from "react-paginate";
import Paginate from "./paginate";
import ScrollContainer from "react-indiana-drag-scroll";
import {CartContext} from "./CartContext";

function ProductDetail() {
    const userId = localStorage.getItem("userId");
    const [product, setProduct] = useState<Product>();
    const [comments, setComments] = useState<Comment[]>([]);
    const [pageComment, setPageComment] = useState<number>(0);
    const [startIndex, setStartIndex] = useState(0);
    const [detail, setDetail] = useState<DetailProduct>();
    const {idProduct} = useParams();
    const [pageCountProducts, setPageCountProducts] = useState<number>(0);
    const [productRecommend, setProductRecommend] = useState<Product[]>();
    const {addToCart} = useContext(CartContext);

    const [hoverIndex, setHoverIndex] = useState(0);
    const [commentId, setCommentId] = useState<string>("");
    const [rating, setRating] = useState<number>(0);
    const [hoveredCommentId, setHoveredCommentId] = useState<string | null>(null);
    const [content, setContent] = useState("");
    const categoryId = "7";
    const scrollRef = useRef<HTMLDivElement>(null);


    async function postComment(userId: string, detailId: string, rateStart: number, content: string) {
        console.log("userId ", userId);
        console.log("detailId", detailId);
        console.log("rateStart", rateStart);
        console.log("comment", content);
        if (rateStart === 0 || content === "" || !userId) {
            return;
        }
        const dateComment = new Date().toISOString().split("T")[0];
        const newComment = await api.postComment(userId, detailId, rateStart, content, dateComment);
        getComments(detailId, startIndex);


        // setComments(prev => [newComment, ...prev]);
        setContent("");
        setRating(0)
    }

    async function deleteComment(idComment: string) {
        const comment = await api.deleteCommentById(idComment);
        if (comment) {
            setComments(prevState => prevState.filter((item) => item.id !== idComment));
        }
    }

    function handleClickStart(value: number) {
        setRating(value);
    }

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: -240,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: 240,
                behavior: 'smooth'
            });
        }
    };

    async function getComments(detailId: string, page: number) {
        const res = await api.getCommentByProductId(detailId, page);
        setComments(res);
        // setUser(res.users[0]);
        // console.log(res.users[0]);
        const totalComments = await api.getTotalCommentsByProductId(detailId);
        setPageComment(Math.ceil(totalComments.length / 4));
        // console.log("Total ",totalComments);
    }

    async function fetchProductRecommend(categoryId: string, page: number) {
        const res = await api.getProductRecommend(categoryId);
        const totalPage = await api.getTotalPage(categoryId);
        setProductRecommend(res);
        // setPageCountProducts(Math.ceil(totalPage.length / limit));
        // console.log("Product",res);

    }

    function handlePageCommentClick(event: { selected: number }) {
        const newStartIndex = event.selected * 4;
        setStartIndex(newStartIndex);
        if (idProduct) {
            getComments(idProduct, newStartIndex);
        }

    }

    async function fetchProducts() {
        if (idProduct != null) {
            const res = await api.getProductAndDetailById(idProduct);
            setProduct(res);
            setDetail(res.detailProducts[0]);
            // console.log(res.detailProducts[0]);
        }

    }

    useEffect(() => {
        fetchProducts();
        fetchProductRecommend(categoryId, pageCountProducts);
        if (idProduct) {
            getComments(idProduct, pageComment);
        }

    }, [])

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
                            <i className="fa-solid fa-star"></i>

                        </div>
                        <div className="price-detail">{
                            formatPrice(product?.price ?? 0)
                        }</div>
                        <div className="priceAndCart">
                            <div className="add-cart-detail"
                                 onClick={() => product && addToCart(product)}
                            >Thêm vào giỏ</div>
                            <div className="buy-now">Mua ngay</div>

                        </div>

                    </div>

                    <div className={"pd2"}>
                        <div className={"pd2_1"}>
                            <div className={"rate-title"}>Đánh giá</div>

                            {comments && comments.length === 0 ? (
                                <div className="no-comment">
                                    Không có bình luận nào
                                </div>
                            ) : (
                                comments?.map((comment: Comment, index: number) => (
                                    <div className="commentBlock" key={comment.id ?? index}>
                                        <div className="comment-detail">
                                            <div className="avatarComment">
                                                <img
                                                    src={comment.user?.avatar}
                                                    alt="avatar"
                                                    className="commentImg"
                                                />
                                                <div className="nameUser">
                                                    {comment.user?.fullName}
                                                </div>


                                            </div>

                                            <div className="flex-row">
                                                <div className="dateComment">
                                                    {comment.dateComment}
                                                </div>
                                                <div
                                                    className="comment-actions"
                                                    onMouseEnter={() => setHoveredCommentId(comment.id)}
                                                    onMouseLeave={() => setHoveredCommentId(null)}
                                                >
                                                    {commentId === "" && String(comment.user?.id) === userId && hoveredCommentId !== comment.id && (
                                                        <i className="fa-solid fa-ellipsis-vertical delete-comment"/>
                                                    )}

                                                    {String(comment.user?.id) === userId && hoveredCommentId === comment.id && (
                                                        <button
                                                            className="btn-delete-comment"
                                                            onClick={() => deleteComment(comment.id)}
                                                        >
                                                            Thu hồi
                                                        </button>
                                                    )}
                                                </div>

                                            </div>
                                        </div>

                                        <div className="comment-detail">
                                            <div className="comment">{comment.comment}</div>

                                            <div className="stars">
                                                {Array.from({length: comment.rateStar}).map((_, index) => {
                                                    return (<i className="fa-solid fa-star star" key={index}></i>)
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}

                        </div>
                        <Paginate pageCount={pageComment} onPageChange={handlePageCommentClick}/>
                        <div className={"input-comment-block"}>
                            <input type="text" placeholder={"Bình luận"} className={"input-comment"}
                                   value={content}
                                   onChange={(e) => setContent(e.target.value)}
                            />
                            <div className={"stars-rate"}>
                                {Array.from({length: 5}).map((_, index) => {
                                    const starValue = index + 1;
                                    const isActive = starValue <= (hoverIndex || rating);

                                    return (
                                        <i
                                            key={starValue}
                                            className={`fa-star ${
                                                isActive ? "fa-solid active" : "fa-regular"
                                            }`}
                                            onMouseEnter={() => setHoverIndex(starValue)}
                                            onMouseLeave={() => setHoverIndex(0)}
                                            onClick={() => handleClickStart(starValue)}
                                        />
                                    );
                                })}
                            </div>
                            <i className="fa-solid fa-paper-plane send"
                               onClick={() => postComment(String(userId), typeof idProduct === "string" ? idProduct : "", rating, content)}
                            ></i>
                        </div>
                    </div>

                </div>

                <h1>Gợi ý</h1>
                {/*<div className={"pd3"}>*/}

                {/*    {productRecommend?.map((item: Product, index: number) => {*/}
                {/*        return (*/}
                {/*            <div className={"item-recommend"} key={item.id}>*/}
                {/*                <img src={item.img} alt="img-recommend" className="img-recommend"/>*/}
                {/*                <div>{item.name}</div>*/}
                {/*                <div className={"price-recommend"}>{formatPrice(item.price)}</div>*/}
                {/*                <div className={"add-cart-recommend"}>Thêm vào giỏ</div>*/}
                {/*            </div>*/}
                {/*        )*/}
                {/*    })}*/}


                {/*</div>*/}
                <div className={"recommend"}>
                    <button className="arrow-btn arrow-left btn-left" onClick={scrollLeft}>
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <ScrollContainer
                        innerRef={scrollRef}
                        className="pd3"
                        horizontal={true}
                        vertical={false}
                        hideScrollbars={true}
                        activationDistance={10}
                    >
                        {productRecommend?.map((item: Product, index: number) => {
                            return (
                                <div className={"item-recommend"} key={item.id}>
                                    <img src={item.img} alt="img-recommend" className="img-recommend"/>
                                    <div>{item.name}</div>
                                    <div className={"price-recommend"}>{formatPrice(item.price)}</div>
                                    <div className={"add-cart-recommend"}
                                         onClick={() => addToCart(item)}
                                    >Thêm vào giỏ</div>
                                </div>
                            )
                        })}
                    </ScrollContainer>
                    <button className="arrow-btn arrow-right btn-right" onClick={scrollRight}>
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>

                {/*<Paginate pageCount={pageCountProducts} onPageChange={handlePageProductClick}/>*/}
            </div>
        </>
    )
}

export default ProductDetail;