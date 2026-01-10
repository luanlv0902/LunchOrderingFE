import React, { useState } from "react";
import "../styles/styles.css";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e?: React.FormEvent) => {
        e?.preventDefault();

        setError("");
        try {
            const user = await api.login(username, password);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("userId", String(user.id));
            // localStorage.setItem("userId", user.id);
            navigate("/home", { replace: true });
            window.location.reload();
        } catch (err) {
            setError("Sai tài khoản hoặc mật khẩu");
        }
    };

    return (
        <div className="auth-container">
            <Link to="/home" className="back-home">
                <i className="fa-solid fa-arrow-left"></i>
                Trang chủ
            </Link>

            {/* LEFT */}
            <div className="left">
                <img src="/background_login.jpg" alt="login" className="img_left" />
            </div>

            {/* RIGHT */}
            <div className="right">
                <h2 className="title">Đăng nhập</h2>

                {/* Bọc vào form */}
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <i className="fa-solid fa-user form-icon"></i>
                        <input
                            type="text"
                            placeholder="Tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <i className="fa-solid fa-lock form-icon"></i>
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="options">
                        <label>
                            <input type="checkbox" /> Lưu tài khoản
                        </label>
                        <span className="forgot">Quên mật khẩu?</span>
                    </div>

                    <button
                        type="submit" // submit form khi nhấn Enter
                        className="btn-login"
                        disabled={!username || !password}
                    >
                        Đăng nhập
                    </button>
                </form>

                <div className="social-login">
                    <button type="button" className="social-btn facebook">
                        <i className="fa-brands fa-facebook"></i>
                    </button>

                    <button type="button" className="social-btn google">
                        <div className="img_google">
                            <img
                                src="https://freepnglogo.com/images/all_img/google-logo-2025-6ffb.png"
                                alt=""
                            />
                        </div>
                    </button>
                </div>

                <p className="register">
                    Bạn chưa có tài khoản?{" "}
                    <Link to="/register" className="register-link">
                        Đăng ký ngay
                    </Link>
                </p>

                {error && <p className="error-text">{error}</p>}
            </div>
        </div>
    );
}

export default Login;