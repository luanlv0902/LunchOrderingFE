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
                    <div className="contact-row">
                        <div className="contact-icon"><i className="fa-solid fa-location-dot"></i></div>
                        <div>
                        <div className="contact-title">Địa chỉ</div>
                            <div className="contact-text">
                                Khu phố 33, phường Linh Xuân, TP.HCM
                            </div>
                        </div>
                    </div>

                    <div className="contact-row">
                        <div className="contact-icon"><i className="fa-solid fa-phone"></i></div>
                        <div>
                        <div className="contact-title">Hotline</div>
                            <div className="contact-text">
                                0971649429
                            </div>
                        </div>
                    </div>

                    <div className="contact-row">
                        <div className="contact-icon"><i className="fa-solid fa-envelope"></i></div>
                        <div>
                        <div className="contact-title">Email</div>
                            <div className="contact-text">
                                comtruaanzi@gmail.com
                            </div>
                        </div>
                    </div>
                </div>

                <div className="contact-two-cols">
                    <div className="contact-form-box">
                        <h2 className="form-title">Thông tin thắc mắc, quý khách vui lòng liên hệ tại đây:</h2>

                        <form className="contact-form">
                            <label>Tên quý khách</label>
                            <input type="text" placeholder="Tên quý khách" />

                            <div className="contact-form-row">
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

                    <div className="contact-map">
                        <iframe
                            title="Google Map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d823.690048488983!2d106.79086022248966!3d10.87602124346981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d91c2f51e58d%3A0x736284e4e7660807!2zUXXDoW4gY8ahbSBzaW5oIHZpw6pu!5e0!3m2!1svi!2s!4v1768664551824!5m2!1svi!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0, borderRadius: "15px" }}
                            loading="lazy"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>

            </div>
        </>
    );
}

export default Contact;