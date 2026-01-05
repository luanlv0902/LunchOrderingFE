import {useContext, useEffect, useState} from "react";
import {CartContext} from "../components/CartContext";
import {api} from "../services/api";
import {Address, Order} from "../types/object";
import {formatPrice} from "../components/formatPrice";
import {useNavigate} from "react-router-dom";
import "../styles/styles.css";

const Checkout = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const {
        cart,
        totalPrice,
        clearCart,
    } = useContext(CartContext);

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

    const [voucherCode, setVoucherCode] = useState("");
    const [voucher, setVoucher] = useState<any>(null);
    const [discount, setDiscount] = useState(0);
    const [userVoucherId, setUserVoucherId] = useState<number | null>(null);

    useEffect(() => {
        if (!userId) return;

        api.getAddressesByUser(userId).then(data => {
            setAddresses(data);
            const defaultAddr = data.find((a: Address) => a.isDefault);
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr.id);
            }
        });
    }, [userId]);

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

    const handleApplyVoucher = async () => {
        if (!voucherCode) return;

        const vouchers = await api.getVoucherByCode(voucherCode);
        if (vouchers.length === 0) {
            alert("Voucher không tồn tại");
            return;
        }

        const v = vouchers[0];
        const discountValue = calculateDiscount(v, totalPrice);

        if (discountValue <= 0) {
            alert("Không đủ điều kiện áp dụng voucher");
            return;
        }

        const userVouchers = await api.getUserVouchers(userId!);
        const uv = userVouchers.find(
            (u: any) => u.code === voucherCode && !u.used
        );

        if (!uv) {
            alert("Voucher đã dùng hoặc không thuộc về bạn");
            return;
        }

        setVoucher(v);
        setDiscount(discountValue);
        setUserVoucherId(uv.id);
    };

    const handlePlaceOrder = async () => {
        if (!userId) {
            alert("Vui lòng đăng nhập");
            return;
        }

        if (!selectedAddressId) {
            alert("Vui lòng chọn địa chỉ giao hàng");
            return;
        }

        // const order: Order = {
        //     userId,
        //     items: cart.map(item => ({
        //         productId: item.id,
        //         name: item.name,
        //         price: item.price,
        //         quantity: item.quantity,
        //     })),
        //     totalPrice,
        //     discount,
        //     finalPrice: totalPrice - discount,
        //     addressId: selectedAddressId,
        //     voucherCode: voucher?.code,
        //     status: "LOADING",
        //     createdAt: new Date().toISOString(),
        // };

        try {
            // await api.createOrder(order);

            if (userVoucherId) {
                await api.useVoucher(userVoucherId);
            }

            clearCart();
            navigate("/order-success");
        } catch (error) {
            alert("Đặt hàng thất bại");
        }
    };

    if (cart.length === 0) {
        return <h2>Giỏ hàng trống</h2>;
    }

    return (
        <div className="checkout-page">
            <h2 className="checkout-title">Thanh toán</h2>

            <div className="checkout-container">
                {/* LEFT */}
                <div className="checkout-left">

                    {/* ADDRESS */}
                    <div className="checkout-card">
                        <h3>Địa chỉ giao hàng</h3>

                        {addresses.length === 0 && (
                            <p className="empty-address">
                                Bạn chưa có địa chỉ giao hàng.
                                <span
                                    className="add-address-link"
                                    onClick={() => navigate("/account/address")}
                                >
                Thêm địa chỉ
            </span>
                            </p>
                        )}

                        {addresses.map(addr => (
                            <label
                                key={addr.id}
                                className={`address-card ${
                                    selectedAddressId === addr.id ? "active" : ""
                                }`}
                            >
                                <input
                                    type="radio"
                                    checked={selectedAddressId === addr.id}
                                    onChange={() => setSelectedAddressId(addr.id)}
                                />
                                <div>
                                    <strong>{addr.receiverName}</strong>
                                    <p>{addr.detail}</p>
                                </div>
                            </label>
                        ))}
                    </div>

                    {/* VOUCHER */}
                    <div className="checkout-card">
                        <h3>Voucher</h3>
                        <div className="voucher-box">
                            <input
                                value={voucherCode}
                                onChange={e => setVoucherCode(e.target.value)}
                                placeholder="Nhập mã voucher"
                            />
                            <button onClick={handleApplyVoucher}>Áp dụng</button>
                        </div>

                        {discount > 0 && (
                            <p className="voucher-success">
                                Đã giảm {formatPrice(discount)}
                            </p>
                        )}
                    </div>
                </div>

                {/* RIGHT */}
                <div className="checkout-right">
                    <div className="checkout-summary">
                        <h3>🛒 Đơn hàng</h3>

                        {cart.map(item => (
                            <div key={item.id} className="summary-item">
                            <span>
                                {item.name} x {item.quantity}
                            </span>
                                <span>
                                {formatPrice(item.price * item.quantity)}
                            </span>
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

                        <div className="summary-total">
                            <span>Tổng thanh toán</span>
                            <span>{formatPrice(totalPrice - discount)}</span>
                        </div>

                        <button
                            className="btn-place-order"
                            onClick={handlePlaceOrder}
                        >
                            Đặt hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;