import { useLocation, useNavigate } from "react-router-dom";
import "../styles/styles.css";

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const orderId = location.state?.orderId;

    return (
        <div className="order-success-page">
            <div className="order-success-card">
                <div className="success-icon">✅</div>
                <h2>Đặt hàng thành công!</h2>
                <p>
                    Cảm ơn bạn đã đặt hàng.
                    {orderId && (
                        <>
                            <br />
                            <strong>Mã đơn hàng:</strong> {orderId}
                        </>
                    )}
                </p>

                <div className="order-success-actions">
                    <button
                        className="btn-primary"
                        onClick={() => navigate("/account/order-history")}
                    >
                        Xem lịch sử đơn hàng
                    </button>

                    <button
                        className="btn-secondary"
                        onClick={() => navigate("/home")}
                    >
                        Về trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;