import React from "react";
import "../styles/styles.css"
import Category from "../components/item-category";
import ItemOrder from "../components/item-order";

function Order(){
    return (
        <>
            <h1>ĐẶT HÀNG</h1>
            <div className={"order"}>
                <div className={"container-order-1"}>
                    <div className={"filter-order"}>
                        <input type="text" placeholder={"Tìm kiếm"} className={"search-order"}/>
                        <div className={"title-sort"}>Sắp xếp theo</div>
                        <select name="sort" id="sortOrder" className={"sort-order"}>
                            <option >Mặc định</option>
                            <option>Giá tăng dần</option>
                            <option>Giá giảm dần</option>
                        </select>
                    </div>

                    <div className={"category-order"}>
                        <div className={"title-category"}>FOOD MENU</div>
                        <div className={"list-item-category"}>
                            <Category/> <Category/> <Category/> <Category/>
                            <Category/>
                            <Category/>
                        </div>
                        <hr/>
                        <div className={"title-category"}>MÓN CƠM</div>
                        <div className={"list-item-order" }>
                        <ItemOrder/><ItemOrder/><ItemOrder/><ItemOrder/><ItemOrder/>
                        </div>

                    </div>

                </div>

                <div className={"container-order-2"}>
                    <div className={"title-detail-order"}>Chi tiết đơn hàng</div>
                    <div className={"title-address"}>Chọn địa chỉ</div>
                    <div>
                        <div className={"title-infor"}>Số lượng món</div>
                        <div className={"title-infor"}>1</div>
                        <div className={"title-infor"}>Thành tiền</div>
                        <div className={"title-infor"}>25000đ</div>
                        <hr/>
                        <div className={"title-infor"}>Tổng đơn hàng</div>
                        <div className={"title-infor"}>25000đ</div>
                        <button className={"select-food"}>Thanh toán</button>

                    </div>
                </div>
            </div>
        </>
    )
}
export default Order;