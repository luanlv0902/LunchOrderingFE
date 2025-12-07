import React from "react";
import "../styles/styles.css"
import Category from "../components/item-category";
import ItemOrder from "../components/item-order";
import DragScroll from "../components/scroll-item";

function Order(){
    return (
        <>
            <h1>ĐẶT HÀNG</h1>
            <div className={"order"}>
                <div className={"container-order-1"}>
                    <div className={"filter-order"}>
                        <input type="text" placeholder={"Tìm kiếm"} className={"search-order"}/>
                        <div className={"flex-row"}>
                            <div className={"title-sort"}>Sắp xếp theo</div>
                            <select name="sort" id="sortOrder" className={"sort-order"}>
                                <option >Mặc định</option>
                                <option>Giá tăng dần</option>
                                <option>Giá giảm dần</option>
                            </select>
                        </div>
                    </div>

                    <div className={"category-order"}>
                        <div className={"title-category"}>FOOD MENU</div>
                        {/*<div className={"list-item-category"}>*/}
                          <DragScroll className="list-item-category">
                              <Category/> <Category/><Category/> <Category/><Category/><Category/> <Category/><Category/> <Category/><Category/>
                          </DragScroll>




                        {/*</div>*/}
                        <hr/>
                        <div className={"title-category"}>MÓN CƠM</div>
                       <DragScroll className="list-item-order">
                           <ItemOrder/><ItemOrder/><ItemOrder/><ItemOrder/><ItemOrder/><ItemOrder/><ItemOrder/><ItemOrder/><ItemOrder/><ItemOrder/>
                       </DragScroll>



                    </div>

                </div>

                <div className={"container-order-2"}>
                    <div className={"title-detail-order"}>Chi tiết đơn hàng</div>
                    <div className={"title-address"}>Chọn địa chỉ</div>
                    <div className={"list-cart"}>
                        <div className={"cart-detail"} >
                            <img className={"img-cart"} src="https://comnieuthienly.com/_next/image?url=https%3A%2F%2Fhos.comnieuthienly.com%2Fimages%2Fwebp%2F674ac922bdc46c2b04a4dea9.png&w=3840&q=75" alt="food"/>
                            <div className={"title-infor"}>Cơm chiên trứng</div>
                            <div className={"price-infor"}>25000đ</div>
                            <i>Xoa</i>
                        </div>
                        <div className={"quantity-order"}>
                            <button className={"operator"}>-</button>
                            <input className={"quantity"} defaultValue={0}/>
                            <button className={"operator"}>+</button>
                        </div>

                    </div>
                    <div className={"flex-row"}>
                        <div className={"title-infor"}>Số lượng món</div>
                        <div className={"price-infor"}>1</div>
                    </div>
                    <div className={"flex-row"}>
                        <div className={"title-infor"}>Thành tiền</div>
                        <div className={"price-infor"}>25000đ</div>

                    </div>
                    <hr/>
                    <div className={"flex-row"}>

                        <div className={"title-infor"}>Tổng đơn hàng</div>
                        <div className={"price-infor"}>25000đ</div>

                    </div>
                    <button className={"select-food"}>Thanh toán</button>
                </div>
            </div>
        </>
    )
}
export default Order;