import "../../styles/styles.css";
import {Link, NavLink, useParams, useSearchParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {formatPrice} from "../../components/formatPrice";
import {Order,OrderItem,Product} from "../../types/object";
import {api} from "../../services/api";
import itemOrder from "../../components/item-order";
import Alert from '@mui/material/Alert';
import {Snackbar} from "@mui/material";
import ConfirmDialog from "../../components/Dialog";




function OrderHistory() {
    const [filter, setFilter] = useState<"ALL" | "WAITING_PAYMENT" | "PENDING" | "COOKING" | "DELIVERING" | "COMPLETE" | "CANCEL">("ALL");
    const [orders, setOrders] = useState<Order[]>([]);
    const [notifyCancel, setNotifyCancel] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string>("");
    const query= {
        userId: searchParams.get("userId") || "",
        status: searchParams.get("status") || "",
        sortField: searchParams.get("sort") || "",
        order: searchParams.get("order") || "",
    }
    function getOrderStatusText (status: "WAITING_PAYMENT" | "PENDING" | "COOKING" | "DELIVERING" | "COMPLETE" | "CANCEL"): string {
        switch (status) {
            case "WAITING_PAYMENT":
                return "Đợi thanh toán";
            case "PENDING":
                return "Đang xử lý";
            case "COOKING":
                return "Đang nấu"
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

    function renderVoucherText(order: Order) {
        if (!order.voucher) return "Không sử dụng";

        const v = order.voucher;

        switch (v.discountType) {
            case "PERCENT":
                return `Giảm ${v.discountValue}%`;

            case "FIXED":
                return `Giảm ${formatPrice(v.discountValue)}`;

            case "FREESHIP":
                return "Miễn phí vận chuyển";

            default:
                return "Không sử dụng";
        }
    }

    function getPaymentMethodText(
        method: Order["methodPayment"]
    ): string {
        switch (method) {
            case "CASH":
                return "Thanh toán khi nhận hàng";
            case "BANK":
                return "Chuyển khoản ngân hàng";
            case "MOMO":
                return "Ví MoMo";
            case "VNPAY":
                return "VNPAY";
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
    function handleCancelClick(orderId: string) {
        setSelectedOrderId(orderId);
        setConfirmOpen(true);
    }
    async function confirmCancelOrder() {
        setConfirmOpen(false);
        try {
            console.log("selectOrderId ",selectedOrderId);
            await api.cancelOrder(selectedOrderId);
            setNotifyCancel(true);
            await getOrderHistory();
        } catch (error) {
            console.error("Lỗi khi hủy đơn hàng:", error);
        }
    }

    function cancelCancelOrder() {
        setConfirmOpen(false);
        setSelectedOrderId("");
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
                <button className={filter === "WAITING_PAYMENT" ? "active" : ""} onClick={() => setFilter("WAITING_PAYMENT")}>Đợi thanh toán
                </button>
                <button className={filter === "PENDING" ? "active" : ""} onClick={() => setFilter("PENDING")}>Đang xử lý
                </button>
                <button className={filter === "COOKING" ? "active" : ""} onClick={() => setFilter("COOKING")}>Đang nấu
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
                            <div className={"valueDetail"}>{order.address?.detail +", "+order.address?.district+", "+order.address?.province}</div>
                        </div>
                        <div className="flex-row">
                            <div className={"titleDetailOrder"}>Người nhận</div>
                            <div className={"valueDetail"}>{order.address?.receiverName+" - "+order.address?.phone} </div>
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
                            <div className="titleDetailOrder">Phương thức thanh toán</div>
                            <div className="valueDetail">
                                {getPaymentMethodText(order.methodPayment)}
                            </div>
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
                            <div className={"valueDetail"}>
                                {renderVoucherText(order)}
                            </div>

                        </div>
                        <div className="flex-row">
                            <div className={"titleDetailOrder"}>Phí vận chuyển</div>
                            <div className={"valueDetail"}>
                                {order.shippingFee === 0
                                    ? "Miễn phí"
                                    : formatPrice(order.shippingFee)}
                            </div>
                        </div>

                        <div className="flex-row total-price-row">
                            <div className="titleDetailOrder">Tổng tiền</div>
                            <div className="valueDetail total-price">
                                {formatPrice(order.finalPrice as number)}
                            </div>
                        </div>

                        {order.status==="PENDING" &&(
                            <button className={"cancelOrder"} onClick={()=>{
                                console.log("Order.id:", order.id);
                                console.log("Type:", typeof order.id);
                                handleCancelClick(order.id)
                            }}>Hủy đơn hàng</button>

                        )}

                    </div>
                </div>
            ))}
            {orders.length === 0 && (
                <div className={"none-order"}>
                    <h3>Không có đơn hàng nào</h3>
                </div>
            )}
            <Snackbar
                open={notifyCancel}
                autoHideDuration={2000}
                onClose={() => setNotifyCancel(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                    paddingTop: '80px',
                    zIndex: 9999,
                }}

            >
                <Alert
                    // onClose={() => setNotifyCancel(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%', minWidth: 300 }}
                >
                    Đơn hàng đã được hủy thành công!
                </Alert>
            </Snackbar>
            <ConfirmDialog
                open={confirmOpen}
                title="Xác nhận hủy đơn hàng"
                message="Bạn chắc chắn muốn hủy đơn hàng này?"
                confirmText="Hủy đơn hàng"
                cancelText="Không"
                onConfirm={confirmCancelOrder}
                onCancel={cancelCancelOrder}
            />

        </div>
    )
}

export default OrderHistory;
