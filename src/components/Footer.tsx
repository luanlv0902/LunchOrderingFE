import React from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css";

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-col">
                    <h3 className="footer-title">CƠM TRƯA ANZI</h3>
                    <p>Chuyên cung cấp cơm trưa văn phòng</p>
                    <p>Đảm bảo: Ngon - Sạch - An toàn</p>
                </div>

                <div className="footer-col">
                    <h4>Liên kết</h4>
                    <ul>
                        <li>
                            <Link to="/">Trang chủ</Link>
                        </li>
                        <li>
                            <Link to="/menu">Menu</Link>
                        </li>
                        <li>
                            <Link to="/contact">Liên hệ</Link>
                        </li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Liên hệ</h4>
                    <p>Khu phố 33, phường Linh Xuân, TP.HCM</p>
                    <p>0971649429</p>
                    <p>comtruaanzi@gmail.com</p>
                </div>

            </div>

            <div className="footer-bottom">
                © {new Date().getFullYear()} Cơm Trưa Anzi. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
