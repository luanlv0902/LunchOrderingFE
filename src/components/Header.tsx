import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "../styles/styles.css";

const Header = () => {
    const [user, setUser] = useState<{ username: string } | null>(null);
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
