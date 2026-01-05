import "../../styles/styles.css";
import {Link, NavLink, useParams, useSearchParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {formatPrice} from "../../components/formatPrice";
import {Order,OrderItem,Product} from "../../types/object";
import {api} from "../../services/api";


function OrderHistory() {
    const [filter, setFilter] = useState<"ALL" | "LOADING" | "DELIVERING" | "COMPLETE" | "CANCEL">("ALL");
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const query= {
        userId: searchParams.get("userId") || "",
        status: searchParams.get("status") || "",
        sortField: searchParams.get("sort") || "",
        order: searchParams.get("order") || "",
    }
   function getOrderStatusText (status: "LOADING" | "DELIVERING" | "COMPLETE" | "CANCEL"): string {
       switch (status) {
           case "LOADING":
               return "Đang xử lý";
           case "DELIVERING":
               return "Đang giao hàng";
           case "COMPLETE":
               return "Đã hoàn thành";
           case "CANCEL":
               return "Đã hủy";
           default:
               return "Không xác định";
       }
   }
    function formatDateTimeNice(isoString: string) {
        return new Date(isoString).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(/,/, '');
    }
    function sortOrder(e: React.ChangeEvent<HTMLSelectElement>) {
        const sortedOrders = e.currentTarget.value;
        setSearchParams(prev => {
            prev.set("sort", sortedOrders);
            prev.set("order", "desc");
            return prev;
        });

    }
    function changeFilter() {
        if(filter ==="ALL"){
            setSearchParams(prev => {
                prev.delete("status");
                return prev;
            });
            return;
        }
        setSearchParams(prev => {
            prev.set("status", filter);
            return prev;
        });
    }
   
    async function getOrderHistory() {
        const ordersRes = await api.getOrderByUserId(query);
        const ordersWithItems = await Promise.all(
            ordersRes.map(async (order: Order) => {
                const items = await api.getOrderItemByOrderId(String(order.id));
                return {
                    ...order,
                    orderItems: Array.isArray(items) ? items : []
                };
            })
        );

        setOrders(ordersWithItems);
    }

    useEffect(() => {
       changeFilter()
    }, [filter, setSearchParams]);
    useEffect(() => {
        getOrderHistory();
    }, [query.status, query.sortField, query.order]);

    return (
        <div className="voucher-container">
            <div className="voucher-header">
                <h3>Lịch sử mua hàng</h3>
            </div>

            <div className="voucher-filter">
                <button className={filter === "ALL" ? "active" : ""} onClick={() => setFilter("ALL")}>Tất cả</button>
                <button className={filter === "LOADING" ? "active" : ""} onClick={() => setFilter("LOADING")}>Đang xử
                    lý
                </button>
                <button className={filter === "DELIVERING" ? "active" : ""} onClick={() => setFilter("DELIVERING")}>Đang
                    vận chuyển
                </button>
                <button className={filter === "COMPLETE" ? "active" : ""} onClick={() => setFilter("COMPLETE")}>Đã
                    giao
                </button>
                <button className={filter === "CANCEL" ? "active" : ""} onClick={() => setFilter("CANCEL")}>Đã hủy
                </button>
            </div>

            <div className={"filter-history"}>
                {/*<span className="voucher-label"></span>*/}
                {/*<input type="text" placeholder="Tìm kiếm" className={"search-history"}/>*/}
                <div className={"selected-history"}>
                    <span className="voucher-label">Sắp xếp theo</span>
                    <select className={"selected-history"} onChange={sortOrder}>
                        <option value="createdAt">Mới nhất</option>
                        <option value="finalPrice">Tổng tiền</option>
                    </select>
                </div>
            </div>
            {orders.map((order, index) => (
                <div className="labeled-box" data-label={order.id} key={index}>
                    <table className="cart-table">
                        <thead>
                        <tr>
                            <th>Hình ảnh</th>
                            <th>Tên món</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Thành tiền</th>

                        </tr>
                        </thead>

                        <tbody>
                        {order.orderItems?.map((item,index) => (
                        <tr key={index}>
                            <td>
                                <NavLink to={`/product/${item.productId}`}>
                                    <img src={item.product?.img} alt={item.product?.img} className="cart-img"/>
                                </NavLink>

                            </td>

                            <td>{item.product?.name}</td>

                            <td>{formatPrice(item.product?.price as number)}</td>

                            <td>
                                <div className="qty-box">
                                    <span>{item.quantity}</span>
                                </div>
                            </td>

                            <td>
                                {formatPrice( (item.product?.price ?? 0) * item.quantity)}
                            </td>

                        </tr>
                        ))}

                        {/*))}*/}
                        </tbody>
                    </table>
                    <div className="detailOrder">
                        <div className="flex-row">
                            <div className={"titleDetailOrder"}>Địa chỉ</div>
                            <div className={"valueDetail"}>{order.address?.province+"-"+order.address?.district+"-"+order.address?.detail}</div>
                        </div>
                        <div className="flex-row">
                            <div className={"titleDetailOrder"}>Người nhận</div>
                            <div className={"valueDetail"}>{order.address?.receiverName+"-"+order.address?.phone} </div>
                        </div>
                        <div className="flex-row">
                            <div className={"titleDetailOrder"}>Trạng thái</div>
                            <div className={"valueDetail"}>{getOrderStatusText(order.status)}</div>
                        </div>
                        <div className="flex-row">
                            <div className={"titleDetailOrder"}>Ngày đặt hàng</div>
                            <div className={"valueDetail"}>{formatDateTimeNice(order.createdAt)}</div>
                        </div>
                        <div className="flex-row">
                            <div className={"titleDetailOrder"}>Phương thức thanh toán</div>
                            <div className={"valueDetail"}>Tiền mặt</div>
                        </div>
                        <div className="flex-row">
                            <div className={"titleDetailOrder"}>Ghi chú</div>
                            <div className={"valueDetail"}>{order.noteForChef}</div>
                        </div>
                        <div className="flex-row">
                            <div className={"titleDetailOrder"}>Giá gốc</div>
                            <div className={"valueDetail"}>{formatPrice(order.totalPrice)}</div>
                        </div>
                        <div className="flex-row">
                            <div className={"titleDetailOrder"}>Voucher</div>
                            <div className={"valueDetail"}>{order.voucher?.discountValue}%</div>
                        </div>
                        <div className="flex-row">
                            <div className={"titleDetailOrder"}>Tổng tiền</div>
                            <div className={"valueDetail"}>{formatPrice(order.finalPrice as number)}</div>
                        </div>
                        {order.status==="LOADING" &&(
                            <button className={"cancelOrder"}>Hủy đơn hàng</button>
                        )}
                    </div>
                </div>
            ))}
            {orders.length === 0 && (
                <div>Không có đơn hàng nào</div>
            )}

        </div>
    )
}

export default OrderHistory;
