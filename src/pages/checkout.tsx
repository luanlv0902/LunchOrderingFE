import { useContext, useEffect, useState } from "react";
import { CartContext } from "../components/CartContext";
import { api } from "../services/api";
import { Address, Order, OrderItem } from "../types/object";
import { formatPrice } from "../components/formatPrice";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

const Checkout = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const { cart, totalPrice, clearCart } = useContext(CartContext);

    // ===== ADDRESS =====
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

    // ===== VOUCHER =====
    const [myVouchers, setMyVouchers] = useState<any[]>([]);
    const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(null);
    const [voucherId, setVoucherId] = useState("");
    const [userVoucherId, setUserVoucherId] = useState<number | null>(null);
    const [discount, setDiscount] = useState(0);

    // ===== PAYMENT =====
    const [paymentMethod, setPaymentMethod] = useState<string>("CASH");

    // ===== LOAD ADDRESS =====
    useEffect(() => {
        if (!userId) return;

        api.getAddressesByUser(userId).then(data => {
            setAddresses(data);
            const defaultAddr = data.find((a: Address) => a.isDefault);
            if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        });
    }, [userId]);

    // ===== LOAD USER VOUCHERS =====
    useEffect(() => {
        if (!userId) return;
        api.getUserVouchersWithDetail(userId).then(setMyVouchers);
    }, [userId]);

    // ===== CALCULATE DISCOUNT =====
    const calculateDiscount = (voucher: any, total: number) => {
        if (total < voucher.minOrder) return 0;

        if (voucher.discountType === "PERCENT") {
            return Math.min(
                (total * voucher.discountValue) / 100,
                voucher.maxDiscount || Infinity
            );
        }

        if (voucher.discountType === "FIXED") {
            return voucher.discountValue;
        }

        return 0;
    };

    // ===== FILTER AVAILABLE VOUCHERS =====
    const availableVouchers = myVouchers.filter(v => {
        const voucher = v.voucher;
        if (!voucher || v.used) return false;
        if (new Date(voucher.expireDate) < new Date()) return false;
        if (totalPrice < voucher.minOrder) return false;
        return true;
    });

    // ===== APPLY VOUCHER =====
    const handleSelectVoucher = (v: any) => {
        const voucher = v.voucher;
        const discountValue = calculateDiscount(voucher, totalPrice);

        setDiscount(discountValue);
        setVoucherId(voucher.id);
        setUserVoucherId(v.id);
        setSelectedVoucherId(v.id);
    };

    // ===== PLACE ORDER =====
    const handlePlaceOrder = async () => {
        if (!userId) return alert("Vui lòng đăng nhập");
        if (!selectedAddressId) return alert("Vui lòng chọn địa chỉ");
        const orderStatus =
            paymentMethod === "CASH" ? "PENDING" : "WAITING_PAYMENT";

        try {

            const order: Omit<Order, "id"> = {
                userId,
                totalPrice,
                discount,
                finalPrice: totalPrice - discount,
                addressId: selectedAddressId,
                voucherId,
                methodPayment: paymentMethod as Order["methodPayment"],
                status: orderStatus,
                createdAt: new Date().toISOString(),
            };

            const createdOrder: Order = await api.createOrder(order);

            const orderItems: Omit<OrderItem, "id">[] = cart.map(item => ({
                productId: item.id,
                orderId: createdOrder.id,
                quantity: item.quantity,
            }));

            await Promise.all(orderItems.map(item => api.createOrderItem(item)));

            if (userVoucherId) {
                await api.useVoucher(userVoucherId);
            }

            clearCart();
            navigate(`/account/order-history?userId=${userId}&sort=createdAt&order=desc`);
        } catch {
            alert("Đặt hàng thất bại");
        }
    };

    if (cart.length === 0) return <h2>Giỏ hàng trống</h2>;

    return (
        <div className="checkout-page">
            <h2 className="checkout-title">Thanh toán</h2>

            <div className="checkout-container">
                {/* LEFT */}
                <div className="checkout-left">
                    {/* ADDRESS */}
                    <div className="checkout-card">
                        <h3>Địa chỉ giao hàng</h3>

                        {addresses.map(addr => (
                            <label
                                key={addr.id}
                                className={`address-card ${selectedAddressId === addr.id ? "active" : ""}`}
                            >
                                <input
                                    type="radio"
                                    checked={selectedAddressId === addr.id}
                                    onChange={() => setSelectedAddressId(addr.id)}
                                />
                                <div className="address-content">
                                    <strong>{addr.receiverName}</strong>
                                    <p>
                                        {addr.detail}, {addr.ward}, {addr.district}, {addr.province}
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>

                    {/* VOUCHER */}
                    <div className="checkout-card">
                        <h3>Voucher của bạn</h3>

                        {availableVouchers.length === 0 && (
                            <p className="text-muted">Không có voucher phù hợp</p>
                        )}

                        {availableVouchers.map(v => {
                            const voucher = v.voucher;
                            return (
                                <div
                                    key={v.id}
                                    className={`voucher-row ${selectedVoucherId === v.id ? "active" : ""}`}
                                    onClick={() => handleSelectVoucher(v)}
                                >
                                    <div className="voucher-content">
                                        <strong>
                                            {voucher.discountType === "PERCENT"
                                                ? `Giảm ${voucher.discountValue}%`
                                                : `Giảm ${voucher.discountValue.toLocaleString()}đ`}
                                        </strong>
                                        <p>Đơn tối thiểu {voucher.minOrder.toLocaleString()}đ</p>
                                    </div>

                                    <button>
                                        {selectedVoucherId === v.id ? "Đã áp dụng" : "Dùng"}
                                    </button>
                                </div>

                            );
                        })}
                    </div>

                    {/* PAYMENT */}
                    <div className="checkout-card">
                        <h3>Phương thức thanh toán</h3>

                        <label className={`payment-option ${paymentMethod === "CASH" ? "active" : ""}`}>
                            <input
                                type="radio"
                                checked={paymentMethod === "CASH"}
                                onChange={() => setPaymentMethod("CASH")}
                            />
                            <span>💵 Tiền mặt khi nhận hàng</span>
                        </label>

                        <label className={`payment-option ${paymentMethod === "BANK" ? "active" : ""}`}>
                            <input
                                type="radio"
                                checked={paymentMethod === "BANK"}
                                onChange={() => setPaymentMethod("BANK")}
                            />
                            <span>💳 Chuyển khoản ngân hàng</span>
                        </label>

                        <label className={`payment-option ${paymentMethod === "MOMO" ? "active" : ""}`}>
                            <input
                                type="radio"
                                checked={paymentMethod === "MOMO"}
                                onChange={() => setPaymentMethod("MOMO")}
                            />
                            <span>📱 Ví Momo / ZaloPay</span>
                        </label>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="checkout-right">
                    <div className="checkout-summary">
                        <h3>🛒 Đơn hàng</h3>

                        {cart.map(item => (
                            <div key={item.id} className="summary-item">
                                <span>{item.name} x {item.quantity}</span>
                                <span>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                        ))}

                        <div className="summary-row">
                            <span>Tạm tính</span>
                            <span>{formatPrice(totalPrice)}</span>
                        </div>

                        <div className="summary-row discount">
                            <span>Giảm giá</span>
                            <span>-{formatPrice(discount)}</span>
                        </div>

                        <div className="summary-row">
                            <span>Phương thức thanh toán</span>
                            <span>
                                {paymentMethod === "CASH" && "Tiền mặt"}
                                {paymentMethod === "BANK" && "Chuyển khoản"}
                                {paymentMethod === "MOMO" && "Ví điện tử"}
                            </span>
                        </div>

                        <div className="summary-total">
                            <span>Tổng thanh toán</span>
                            <span>{formatPrice(totalPrice - discount)}</span>
                        </div>

                        <button className="btn-place-order" onClick={handlePlaceOrder}>
                            Đặt hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
