import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

interface HomeVoucherNoticeProps {
    className?: string; // nhận className từ ngoài
}

function HomeVoucherNotice({ className }: HomeVoucherNoticeProps) {
    const [voucherCodes, setVoucherCodes] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVouchers = async () => {
            const newVouchers = await api.getNewVouchers();
            setVoucherCodes(newVouchers.map((v: any) => v.code));
        };
        fetchVouchers();
    }, []);

    return (
        <div className={`home-voucher-notice ${className || ""}`}>
            <h3>Voucher Hot!</h3>
            <p>
                {voucherCodes.length > 0
                    ? <>Nhập mã <span className="voucher-code">{voucherCodes.join(", ")}</span> tại trang Voucher để nhận ưu đãi</>
                    : "Hiện không có voucher mới"}
            </p>

            <button onClick={() => navigate("/account/voucher")}>Nhập voucher ngay</button>
        </div>
    );
}

export default HomeVoucherNotice;
