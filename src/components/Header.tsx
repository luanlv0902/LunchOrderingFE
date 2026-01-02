import React, { useEffect, useState } from "react";
import {NavLink, useNavigate, useLocation, useSearchParams} from "react-router-dom";
import "../styles/styles.css";
import {api} from "../services/api";
import {useContext} from "react";
import {CartContext} from "./CartContext";

const Header = () => {
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const [searchParams] = useSearchParams();
    const {totalQuantity} = useContext(CartContext);
    const {clearCart} = useContext(CartContext);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    }, [location.pathname]);


    const handleLogout = () => {
        const ok = window.confirm("Bạn có chắc muốn đăng xuất không?");
        if (!ok) return;

        // Xóa dữ liệu đăng nhập
        localStorage.removeItem("user");
        localStorage.removeItem("userId");

        // Điều hướng
        clearCart();
        navigate("/login"); // hoặc "/home"
    };

    // search
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


    return (
        <header className="header">
            <div className="header-container">
                {/* LOGO */}
                <div className="logo">
                    <img
                        src="https://anzi.com.vn/images/icon/logo-red.png"
                        alt="Anzi Logo"
                    />
                </div>

                {/*Search-box*/}
                <div className="search-box">
                    <i
                        className="fa-solid fa-magnifying-glass search-icon"
                        onClick={handleSearch}
                    ></i>

                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                        placeholder="Nhập tên món ăn..."
                    />
                </div>


                {/* MENU */}
                <nav className="nav">
                    <NavLink
                        to="/home"
                        className={({ isActive }) =>
                            isActive ? "nav-item active" : "nav-item"
                        }
                    >
                        TRANG CHỦ
                    </NavLink>

                    <NavLink
                        to="/menu"
                        className={({ isActive }) =>
                            isActive ? "nav-item active" : "nav-item"
                        }
                    >
                        MENU
                    </NavLink>

                    <NavLink
                        to="/order"
                        className={({ isActive }) =>
                            isActive ? "nav-item active" : "nav-item"
                        }
                    >
                        ĐẶT HÀNG
                    </NavLink>

                    <NavLink
                        to="/contact"
                        className={({ isActive }) =>
                            isActive ? "nav-item active" : "nav-item"
                        }
                    >
                        LIÊN HỆ
                    </NavLink>

                    <NavLink
                        to="/cart"
                        className={({ isActive }) =>
                            isActive ? "nav-item active cart-icon" : "nav-item cart-icon"
                        }
                    >
                        <i className="fa-solid fa-cart-shopping"></i>

                        {/*{cartCount > 0 && (*/}
                        {/*    <span className="cart-badge">{cartCount}</span>*/}
                        {/*)}*/}
                        {totalQuantity > 0 && <span className="cart-badge">{totalQuantity}</span>}
                    </NavLink>


                    {/* LOGIN / PROFILE */}
                    {user ? (
                        <>
                            <NavLink
                                to="/account"
                                className={({ isActive }) =>
                                    isActive ? "nav-item active" : "nav-item"
                                }
                            >
                                TÀI KHOẢN
                            </NavLink>
                            <span
                                className="nav-item logout"
                                onClick={handleLogout}
                                style={{ cursor: "pointer" }}
                                title="Đăng xuất"
                            >
            <i className="fa-solid fa-right-from-bracket"></i> {/* Icon logout */}
        </span>
                        </>
                    ) : (
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                isActive ? "nav-item active" : "nav-item"
                            }
                        >
                            ĐĂNG NHẬP
                        </NavLink>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;