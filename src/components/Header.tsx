import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "../styles/styles.css";
import {api} from "../services/api";

const Header = () => {
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    }, [location.pathname]);


    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    // search
    const handleSearch = () => {
        if (!keyword.trim()) return;
        navigate(`/menu?search=${encodeURIComponent(keyword.trim())}`);
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

                    {/* LOGIN / PROFILE */}
                    {user ? (
                        <>
                            <NavLink
                                to="/profile"
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
