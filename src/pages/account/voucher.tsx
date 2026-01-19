import "../../styles/styles.css";
import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Link } from "react-router-dom";

function Voucher() {
    const [inputCode, setInputCode] = useState("");
    const [myVouchers, setMyVouchers] = useState<any[]>([]);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error" | "warning";
    } | null>(null);
    const [filter, setFilter] = useState<"ALL" | "DISCOUNT" | "FREESHIP" | "EXPIRED" | "ENDING_SOON">("ALL");
    const userId = localStorage.getItem("userId");

    const showToast = (message: string, type: "success" | "error" | "warning") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2500);
    };

    const isExpired = (expireDate: string) => new Date(expireDate) < new Date();
    const isEndingSoon = (expireDate: string, days = 3) => {
        const now = new Date();
        const end = new Date(expireDate);
        const diffDays = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays > 0 && diffDays <= days;
    };

    useEffect(() => {
        if (!userId) return;
        api.getUserVouchersWithDetail(userId).then(setMyVouchers);
    }, [userId]);

    const handleApplyVoucher = async () => {
        if (!userId || !inputCode.trim()) return;
        const vouchers = await api.getVoucherByCode(inputCode.trim());
        if (vouchers.length === 0) return showToast("Mã voucher không hợp lệ", "error");

        const voucher = vouchers[0];
        if (isExpired(voucher.expireDate)) return showToast("Voucher đã hết hiệu lực", "error");

        const allUserVouchers = await api.getAllUserVouchers();
        const usedCount = allUserVouchers.filter((uv: any) => uv.voucherId === voucher.id).length;
        if (voucher.quantity - usedCount <= 0) return showToast("Voucher đã hết số lượng", "error");

        const existed = allUserVouchers.find((uv: any) => uv.userId === userId && uv.voucherId === voucher.id);
        if (existed) return showToast("Bạn đã sở hữu voucher này", "warning");

        await api.addUserVoucher({
            userId,
            voucherId: voucher.id,
            code: voucher.code,
            used: false
        });

        showToast("Nhận voucher thành công", "success");
        setInputCode("");
        const updated = await api.getUserVouchersWithDetail(userId);
        setMyVouchers(updated);
    };

    const handleDeleteVoucher = async (userVoucherId: number) => {
        if (!userId) return;
        if (!window.confirm("Bạn có chắc muốn xóa voucher này không?")) return;

        await api.deleteUserVoucher(userVoucherId);
        showToast("Đã xóa voucher", "success");
        const updated = await api.getUserVouchersWithDetail(userId);
        setMyVouchers(updated);
    };

    const filteredVouchers = myVouchers.filter((v) => {
        if (v.used) return false;

        const voucher = v.voucher;
        if (!voucher) return false;
        const expired = isExpired(voucher.expireDate);

        switch (filter) {
            case "DISCOUNT": return !expired && voucher.discountType !== "FREESHIP";
            case "FREESHIP": return !expired && voucher.discountType === "FREESHIP";
            case "EXPIRED": return expired;
            case "ENDING_SOON": return isEndingSoon(voucher.expireDate);
            default: return true; // ALL
        }
    });

    return (
        <div className="voucher-container">
            <div className="voucher-header">
                <h3>Kho Voucher</h3>
            </div>

            <div className="voucher-filter">
                <button className={filter === "ALL" ? "active" : ""} onClick={() => setFilter("ALL")}>Tất cả</button>
                <button className={filter === "DISCOUNT" ? "active" : ""} onClick={() => setFilter("DISCOUNT")}>Giảm giá</button>
                <button className={filter === "FREESHIP" ? "active" : ""} onClick={() => setFilter("FREESHIP")}>Freeship</button>
                <button className={filter === "ENDING_SOON" ? "active" : ""} onClick={() => setFilter("ENDING_SOON")}>Sắp hết hạn</button>
                <button className={filter === "EXPIRED" ? "active" : ""} onClick={() => setFilter("EXPIRED")}>Hết hạn</button>
            </div>

            <div className="voucher-input-box">
                <span className="voucher-label">Mã Voucher</span>
                <input type="text" placeholder="Nhập mã voucher tại đây" value={inputCode} onChange={(e) => setInputCode(e.target.value)} />
                <button className="btn-save" onClick={handleApplyVoucher} disabled={!inputCode.trim()}>Lưu</button>
            </div>

            <div className="voucher-list">
                {filteredVouchers.length === 0 && (
                    <div className="voucher-empty">
                        <img src="/Discount-amico.png" alt="No voucher" />
                        <p>Bạn chưa có voucher nào</p>
                        <span>Hãy nhập mã voucher để nhận ưu đãi</span>
                    </div>
                )}

                {filteredVouchers.map((v) => {
                    const voucher = v.voucher;
                    const expired = isExpired(voucher.expireDate);
                    const endingSoon = isEndingSoon(voucher.expireDate);

                    return (
                        <div key={v.id} className={`voucher-item ${expired ? "expired" : ""} ${endingSoon ? "ending-soon" : ""}`}>
                            <button className="btn-delete-voucher" onClick={() => handleDeleteVoucher(v.id)} title="Xóa voucher">✕</button>

                            <div className={`voucher-left ${voucher.discountType === "FREESHIP" ? "freeship" : ""}`}>
                                {voucher.discountType === "FREESHIP" ? (
                                    <>
                                        <span>Freeship</span>
                                        <i className="fa-solid fa-truck-fast"></i>
                                    </>
                                ) : (
                                    <>
                                        <span>Sale off</span>
                                        <i className="fa-solid fa-tags"></i>
                                    </>
                                )}
                            </div>

                            <div className="voucher-info">
                                <h4>
                                    {voucher.discountType === "PERCENT"
                                        ? `Giảm ${voucher.discountValue}%`
                                        : voucher.discountType === "FIXED"
                                            ? `Giảm ${voucher.discountValue.toLocaleString()}đ`
                                            : "Miễn phí vận chuyển"}
                                </h4>

                                {voucher.discountType !== "FREESHIP" && <p>Đơn tối thiểu {voucher.minOrder.toLocaleString()}đ</p>}

                                <p className={`voucher-expired ${expired ? "text-danger" : ""}`}>
                                    HSD: {voucher.expireDate}
                                </p>

                                {expired ? (
                                    <button className="btn-use disabled" disabled>Đã hết hạn</button>
                                ) : (
                                    <Link to="/cart">
                                        <button className="btn-use">{voucher.discountType === "FREESHIP" ? "Dùng ngay" : "Dùng ngay"}</button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {toast && (
                <div className={`custom-toast ${toast.type}`}>
                    {toast.type === "success" && <i className="fa-solid fa-circle-check"></i>}
                    {toast.type === "error" && <i className="fa-solid fa-circle-xmark"></i>}
                    {toast.type === "warning" && <i className="fa-solid fa-triangle-exclamation"></i>}
                    {toast.message}
                </div>
            )}
        </div>
    );
}

export default Voucher;