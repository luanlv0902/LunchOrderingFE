import "../styles/styles.css";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ConfirmDialog from "../components/Dialog";

function AccountLayout() {
    const [open, setOpen] = useState(true);
    const [fullName, setFullName] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const navigate = useNavigate();
    const location = useLocation();

    // logout states
    const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
    const [notifyLogout, setNotifyLogout] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        api.getUserById(userId).then((user: any) => {
            setFullName(user.fullName || user.username || "");
        });
    }, []);

    useEffect(() => {
        const isAccountChild =
            location.pathname.startsWith("/account/profile") ||
            location.pathname.startsWith("/account/address") ||
            location.pathname.startsWith("/account/change-password");

        setOpen(isAccountChild);
    }, [location.pathname]);

    const handleLogout = () => {
        setConfirmLogoutOpen(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("userId");

        setConfirmLogoutOpen(false);
        setNotifyLogout(true);
        navigate("/login", { state: { loggedOut: true } });
    };

    const cancelLogout = () => {
        setConfirmLogoutOpen(false);
    };

    return (
        <>
            <div className="account-container">
                {/* ===== MENU LEFT ===== */}
                <div className="account_menu">
                    <div className="img_avartar">
                        <img
                            src={
                                user.avatar ||
                                "https://scr.vn/wp-content/uploads/2020/07/avt-con-trai-ng%E1%BA%A7u-978x1024.jpg"
                            }
                            alt="img_avartar"
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

                        <NavLink
                            to={`/account/order-history?userId=${user.id}&sort=createdAt&order=desc`}
                            className={({ isActive }) =>
                                isActive ? "menu-row menu-active" : "menu-row"
                            }
                        >
                            <i className="fa-solid fa-clock-rotate-left"></i>
                            <span>Lịch sử mua hàng</span>
                        </NavLink>

                        <NavLink
                            to="/account/voucher"
                            className={({ isActive }) =>
                                isActive ? "menu-row menu-active" : "menu-row"
                            }
                        >
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

            {/* ===== SNACKBAR ===== */}
            <Snackbar
                open={notifyLogout}
                autoHideDuration={2000}
                onClose={() => setNotifyLogout(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                sx={{ paddingTop: "80px", zIndex: 9999 }}
            >
                <Alert severity="success" variant="filled" sx={{ minWidth: 300 }}>
                    Đăng xuất thành công!
                </Alert>
            </Snackbar>

            {/* ===== CONFIRM DIALOG ===== */}
            <ConfirmDialog
                open={confirmLogoutOpen}
                title="Xác nhận đăng xuất"
                message="Bạn có chắc chắn muốn đăng xuất không?"
                confirmText="Đăng xuất"
                cancelText="Không"
                onConfirm={confirmLogout}
                onCancel={cancelLogout}
            />
        </>
    );
}

export default AccountLayout;
