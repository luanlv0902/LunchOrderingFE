import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/styles.css";
import { api } from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const isValidPhone = (phone: string) => {
        const regex = /^0\d{9,10}$/;
        return regex.test(phone);
    };



    const handleRegister = async () => {
        setError("");
        setSuccess("");

        if (!username || !phone || !password || !confirmPassword) {
            setError("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }
        if (!isValidPhone(phone)) {
            setError("Số điện thoại không hợp lệ");
            return;
        }

        try {
            const user = await api.register(username, password, phone);

            setSuccess("Đăng ký thành công!");

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err: any) {
            setError(err.message || "Đăng ký thất bại");
        }
    };


    return (
        <div className="auth-container">
            <Link to="/" className="back-home">
                <i className="fa-solid fa-arrow-left"></i>
                Trang chủ
            </Link>

            {/* LEFT */}
            <div className="left">
                <img
                    src="/background_login.jpg"
                    alt="register"
                    className="img_left"
                />
            </div>

            {/* RIGHT */}
            <div className="right">
                <h2 className="title">Đăng ký</h2>

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
                    <i className="fa-solid fa-phone form-icon"></i>
                    <input
                        type="tel"
                        placeholder="Số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
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

                <div className="input-group">
                    <i className="fa-solid fa-lock form-icon"></i>
                    <input
                        type="password"
                        placeholder="Xác nhận mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button className="btn-login" onClick={handleRegister}>
                    Đăng ký
                </button>

                <p className="register">
                    Bạn đã có tài khoản?{" "}
                    <span
                        className="register-link"
                        onClick={() => navigate("/login")}
                    >
                        Đăng nhập ngay
                    </span>
                </p>

                {error && <p className="error-text">{error}</p>}
                {success && <p className="success-text">{success}</p>}
            </div>
        </div>
    );
}

export default Register;
