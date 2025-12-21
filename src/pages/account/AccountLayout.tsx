import "../../styles/styles.css";
import { NavLink, Outlet, useNavigate  } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../services/api";


function AccountLayout() {
    const [open, setOpen] = useState(true);
    const [fullName, setFullName] = useState("");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const navigate = useNavigate();
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        api.getUserById(userId).then((user: any) => {
            setFullName(user.fullName || user.username || "");
        });
    }, []);

    const handleLogout = () => {
        const ok = window.confirm("Bạn có chắc muốn đăng xuất không?");
        if (!ok) return;

        // Xóa dữ liệu đăng nhập
        localStorage.removeItem("user");
        localStorage.removeItem("userId");

        // Điều hướng
        navigate("/login"); // hoặc "/home"
    };


    return (
        <div className="account-container">
            {/* ===== MENU LEFT ===== */}
            <div className="account_menu">
                <div className="img_avartar">
                    <img
                        src={
                            user.avatar ||
                            "https://scr.vn/wp-content/uploads/2020/07/avt-con-trai-ng%E1%BA%A7u-978x1024.jpg"
                        }
                    />

                </div>

                <div className="sayhi_name">
                    <p>Xin chào,</p>
                    <p className="info_name">{fullName}</p>

                </div>

                <div className="info_account_menu">
                    {/* TÀI KHOẢN */}
                    <div className={`infor_user ${open ? "active" : ""}`}>
                        <div className="menu-row" onClick={() => setOpen(!open)}>
                            <i className="fa-solid fa-user"></i>
                            <span>Tài khoản cá nhân</span>
                        </div>

                        <ul className="submenu">
                            <li>
                                <NavLink
                                    to="/account/profile"
                                    className={({ isActive }) =>
                                        isActive ? "submenu-active" : ""
                                    }
                                >
                                    Hồ sơ
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/account/address"
                                    className={({ isActive }) =>
                                        isActive ? "submenu-active" : ""
                                    }
                                >
                                    Địa chỉ
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/account/change-password"
                                    className={({ isActive }) =>
                                        isActive ? "submenu-active" : ""
                                    }
                                >
                                    Đổi mật khẩu
                                </NavLink>
                            </li>
                        </ul>

                    </div>

                    <NavLink to="/orders_history" className="menu-row">
                        <i className="fa-solid fa-clock-rotate-left"></i>
                        <span>Lịch sử mua hàng</span>
                    </NavLink>

                    <NavLink to="/voucher" className="menu-row">
                        <i className="fa-solid fa-ticket"></i>
                        <span>Mã giảm giá</span>
                    </NavLink>

                    <div className="menu-row logout-btn" onClick={handleLogout}>
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span>Đăng xuất</span>
                    </div>

                </div>
            </div>

            {/* ===== CONTENT RIGHT ===== */}
            <div className="account_content">
                <Outlet />
            </div>
        </div>
    );
}

export default AccountLayout;
