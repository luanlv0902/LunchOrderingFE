import React, {useEffect, useState, useContext} from "react";
import {NavLink, useNavigate, useLocation, useSearchParams} from "react-router-dom";
import "../styles/styles.css";
import {CartContext} from "./CartContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ConfirmDialog from "../components/Dialog";

const Header = () => {
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [keyword, setKeyword] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const {totalQuantity, clearCart} = useContext(CartContext);

    // logout states
    const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
    const [notifyLogout, setNotifyLogout] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
    }, [location.pathname]);

    // ===== LOGOUT FLOW (GIỐNG HỦY ĐƠN HÀNG) =====
    const handleLogout = () => {
        setConfirmLogoutOpen(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("userId");

        clearCart();

        setConfirmLogoutOpen(false);
        setNotifyLogout(true);

        setTimeout(() => {
            navigate("/login");
        });
    };

    const cancelLogout = () => {
        setConfirmLogoutOpen(false);
    };

    // ===== SEARCH =====
    const handleSearch = () => {
        const params = new URLSearchParams(searchParams);
        if (!keyword.trim()) {
            params.delete("search");
        } else {
            params.set("search", keyword.trim());
        }
        params.set("page", "0");
        navigate(`/menu?${params.toString()}`);
    };

    useEffect(() => {
        if (location.pathname !== "/menu") return;
        handleSearch();
    }, [keyword]);


    return (
        <>
            <header className="header">
                <div className="header-container">
                    {/* LOGO */}
                    <div className="logo">
                        <a href="/">
                            <img
                                src="https://anzi.com.vn/images/icon/logo-red.png"
                                alt="Anzi Logo"
                            />
                        </a>

                    </div>

                    {/* SEARCH */}
                    <div className="search-box">
                        <i
                            className="fa-solid fa-magnifying-glass search-icon"
                            onClick={handleSearch}
                        />
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Nhập tên món ăn..."
                        />
                    </div>

                    {/* MENU */}
                    <nav className="nav">
                        <NavLink to="/home" className="nav-item">TRANG CHỦ</NavLink>
                        <NavLink to="/menu" className="nav-item">MENU</NavLink>
                        <NavLink to="/contact" className="nav-item">LIÊN HỆ</NavLink>

                        <NavLink to="/cart" className="nav-item cart-icon">
                            <i className="fa-solid fa-cart-shopping"></i>
                            {totalQuantity > 0 && (
                                <span className="cart-badge">{totalQuantity}</span>
                            )}
                        </NavLink>

                        {user ? (
                            <>
                                <NavLink to="/account" className="nav-item">
                                    TÀI KHOẢN
                                </NavLink>
                                <span
                                    className="nav-item logout"
                                    onClick={handleLogout}
                                    style={{cursor: "pointer"}}
                                >
                                    <i className="fa-solid fa-right-from-bracket"></i>
                                </span>
                            </>
                        ) : (
                            <NavLink to="/login" className="nav-item">
                                ĐĂNG NHẬP
                            </NavLink>
                        )}
                    </nav>
                </div>
            </header>

            {/* ===== SNACKBAR LOGOUT ===== */}
            <Snackbar
                open={notifyLogout}
                autoHideDuration={1000}
                onClose={() => setNotifyLogout(false)}
                anchorOrigin={{vertical: "top", horizontal: "right"}}
                sx={{paddingTop: "80px", zIndex: 9999}}
            >
                <Alert severity="success" variant="filled" sx={{minWidth: 300}}>
                    Đăng xuất thành công!
                </Alert>
            </Snackbar>

            {/* ===== CONFIRM LOGOUT ===== */}
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
};

export default Header;
