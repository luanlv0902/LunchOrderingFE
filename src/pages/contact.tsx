import React from "react";
import "../styles/styles.css";
import IconScroll from "../components/icon-scroll";

function Contact() {
    return (
        <>
            <IconScroll />

            <div className="container-contact">
                <div className="header-contact">
                    <h1 className="title-contact">LIÊN HỆ</h1>
                    <p className="subtitle-contact">
                        Thông tin liên hệ & hỗ trợ khách hàng
                    </p>
                </div>

                <div className="contact-content">
                    {/* Địa chỉ */}
                    <div className="contact-row">
                        <div className="contact-icon"><i className="fa-solid fa-location-dot"></i></div>
                        <div>
                        <div className="contact-title">Địa chỉ</div>
                            <div className="contact-text">
                                Khu phố 33, phường Linh Xuân, TP.HCM
                            </div>
                        </div>
                    </div>

                    {/* Hotline */}
                    <div className="contact-row">
                        <div className="contact-icon"><i className="fa-solid fa-phone"></i></div>
                        <div>
                        <div className="contact-title">Hotline</div>
                            <div className="contact-text">
                                0971649429 - 0383107754
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="contact-row">
                        <div className="contact-icon"><i className="fa-solid fa-envelope"></i></div>
                        <div>
                        <div className="contact-title">Email</div>
                            <div className="contact-text">
                                22130156@st.hcmuaf.edu.vn
                            </div>
                        </div>
                    </div>
                </div>

                <div className="contact-form-box">
                    <h2 className="form-title">Thông tin thắc mắc, quý khách vui lòng liên hệ tại đây:</h2>

                    <form className="contact-form">

                        <label>Tên quý khách</label>
                        <input type="text" placeholder="Tên quý khách" />

                        <div className="form-row">
                            <div className="form-group">
                                <label>Số điện thoại (*)</label>
                                <input type="text" placeholder="Số điện thoại" />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input type="text" placeholder="Email" />
                            </div>
                        </div>

                        <label>Hệ thống chi nhánh</label>
                        <input type="text" placeholder="Hệ thống chi nhánh" />

                        <label>Nội dung thắc mắc của quý khách</label>
                        <textarea placeholder="Nội dung thắc mắc của quý khách"></textarea>

                        <button type="submit" className="btn-submit">Gửi thông tin</button>
                    </form>
                </div>

            </div>
        </>
    );
}

export default Contact;