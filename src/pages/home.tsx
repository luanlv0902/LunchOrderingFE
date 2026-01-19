import React, {useEffect, useState} from "react";
import "../styles/styles.css"
import IconScroll from "../components/icon-scroll";
import {Product} from "../types/object";
import {api} from "../services/api";
import {formatPrice} from "../components/formatPrice";
import { NavLink } from "react-router-dom";
import HomeVoucherNotice from "../components/HomeVoucherNotice";

const LEFT_IMAGE = "https://i.pinimg.com/736x/b6/b8/5f/b6b85f9b4ab78fabebcc5b55596c68ee.jpg";
const RIGHT_ILLUSTRATION = "https://i.pinimg.com/1200x/12/f0/fd/12f0fdad9c6f80d6f0a8f549bd66ded6.jpg";


function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [showVoucher, setShowVoucher] = useState(false);
    async function getProducts() {
        const products = await api.getProductByCategory("1",0);
        setProducts(products);
    }
    useEffect(() => {
        getProducts();
    },[])
    return(
        <>
            <IconScroll/>
            <div className="voucher-toggle" onClick={() => setShowVoucher(!showVoucher)}>
                NEWS 🔔
            </div>

            <HomeVoucherNotice className={showVoucher ? "show" : ""} />

            <div className="container_content">
                <div className="background_cha">
                    <div className="background_top">
                        <img
                            className="main-img"
                            src="/background.png"
                            alt=""
                        />
                        <img
                            className="torn-edge1"
                            src="/torn_edge.png"
                            alt=""
                        />
                        <img
                            className="torn-edge"
                            src="/torn_edge.png"
                            alt=""
                        />
                    </div>
                    <div className="background_top">
                        <img
                            className="main-img"
                            src="https://i.pinimg.com/736x/8e/76/40/8e76407dec91414241df5e343a8718c3.jpg"
                            alt=""
                        />
                        <img
                            className="torn-edge1"
                            src="/torn_edge.png"
                            alt=""
                        />
                        <img
                            className="torn-edge"
                            src="/torn_edge.png"
                            alt=""
                        />
                    </div>
                    <div className="background_top">
                        <img
                            className="main-img"
                            src="/BANNER.jpg"
                            alt=""
                        />
                        <img
                            className="torn-edge1"
                            src="/torn_edge.png"
                            alt=""
                        />
                        <img
                            className="torn-edge"
                            src="/torn_edge.png"
                            alt=""
                        />
                    </div>
                </div>
                <section className="hero">
                    <div className="hero-inner">
                        <div className="hero-left">
                            <div className="photo-frame">
                                <img src={LEFT_IMAGE} alt="Food" className="photo" />
                                <div className="tape tape-top" />
                                <div className="tape tape-bottom" />
                            </div>
                        </div>

                        <div className="hero-center">
                            <h1 className="site-title">ANZI</h1>
                            <div className="divider" />
                            <p className="lead">
                                Cơm nhà là điều xa xỉ giữa cuộc sống đầy bận rộn. Nếu thèm một bữa
                                cơm quê với thịt kho tiêu, canh chua cá hú, đừng ngại ngần mà đến
                                ngay AnZi.
                            </p>
                            <p className="lead">
                                Tại đây, bạn sẽ thưởng thức vị cơm quê nhà ngay tại trung tâm thành
                                phố. Khơi dậy hương vị tuổi thơ và cảm giác ấm cúng trong không gian
                                của chúng tôi. Hãy đến ngay để thưởng thức món ăn “Chuẩn vị cơm nhà”
                                nhé!
                            </p>

                            <a href="order"> <button className="cta">Đặt món ngay</button></a>
                        </div>

                        <div className="hero-right">
                            <div className="photo-frame">
                                <img src={RIGHT_ILLUSTRATION} alt="Illustration" className="photo" />
                                <div className="tape tape-top" />
                                <div className="tape tape-bottom" />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="img-break">
                    <img
                        className="img-top3"
                        src="/torn_edge.png"
                        alt=""
                    />
                    <img
                        className="img-top2"
                        src="/torn_edge.png"
                        alt=""
                    />
                    <img src="/img_break.png" alt=""/>
                    <img
                        className="img-top1"
                        src="/torn_edge.png"
                        alt=""
                    />
                    <img
                        className="img-top"
                        src="/torn_edge.png"
                        alt=""
                    />
                </div>
                <section className="highlight-menu">
                    <div className="title-wrapper">
                        <span className="title-left">Món ngon</span>
                        <span className="title-right">NỔI BẬT</span>
                    </div>
                    <div className="highlight-grid">
                        {products.map((item, index) => (
                            <NavLink to={`/product/${item.id}`} className={"highlight-item-link"}>
                                <div className="highlight-item" key={index}>
                                    <img src={item.img} alt={item.name} className="hi-img"/>
                                    <h3>{item.name}</h3>
                                    <p className="hi-price">{formatPrice(item.price)}</p>
                                </div>
                            </NavLink>

                        ))}
                    </div>
                    <a href="menu">
                        <button className="cta1">Xem menu</button>
                    </a>
                </section>

            </div>

            <div className="split_container">
                <img
                    className="torn-edge1"
                    src="/torn_edge.png"
                    alt=""
                />
                <img
                    className="torn-edge"
                    src="/torn_edge.png"
                    alt=""
                />
            </div>

            <div className="quality">
                <h2 className="quality-title">VÌ SAO CHỌN CƠM ANZI?</h2>
                <p className="quality-subtitle">
                    Khi đến với Anzi, bạn có thể yên tâm về chất lượng từng bữa ăn. Từ khâu chọn lựa nguyên liệu
                    đến quá trình chế biến, mọi bước đều được đội ngũ bếp thực hiện cẩn thận và đặt chữ “tâm” lên hàng đầu.
                </p>


                <div className="quality-grid">

                    <div className="quality-item">
                        <img src="https://cdn-icons-png.flaticon.com/512/590/590685.png" alt="fresh" className="quality-icon"/>
                        <h3>Nguồn thực phẩm tươi, sạch</h3>
                        <p>Nguyên liệu được chọn từ các nhà cung cấp uy tín, nói không với chất bảo quản và thực phẩm kém chất lượng.</p>
                    </div>

                    <div className="quality-item">
                        <img src="https://cdn-icons-png.flaticon.com/512/3480/3480818.png" alt="mien tay" className="quality-icon"/>
                        <h3>Đậm trưng hương vị miền tây</h3>
                        <p>Món ăn mang phong vị dân dã miền Tây với hương vị đậm đà, hài hòa, dễ hợp khẩu vị nhiều thực khách.</p>
                    </div>

                    <div className="quality-item">
                        <img src="https://cdn-icons-png.flaticon.com/512/1828/1828859.png" alt="menu" className="quality-icon"/>
                        <h3>Thực đơn đổi mới mỗi ngày</h3>
                        <p>Menu được làm mới liên tục, xen kẽ nhiều món đặc sắc để giúp bạn luôn có trải nghiệm ăn uống thú vị.</p>

                    </div>

                    <div className="quality-item">
                        <img src="https://cdn-icons-png.flaticon.com/512/2088/2088617.png" alt="delivery" className="quality-icon"/>
                        <h3>Giao nhanh chóng, đúng giờ</h3>
                        <p>Đội ngũ giao hàng luôn cố gắng mang bữa ăn đến tay bạn nhanh nhất có thể, vẫn giữ được độ nóng và ngon.</p>

                    </div>

                    <div className="quality-item">
                        <img src="https://cdn-icons-png.flaticon.com/512/1046/1046769.png" alt="nutrition" className="quality-icon"/>
                        <h3>Phần cơm đầy đủ chất dinh dưỡng</h3>
                        <p>Mỗi suất ăn đều được cân đối giữa món mặn, món canh, rau và trái cây, đảm bảo đáp ứng nhu cầu dinh dưỡng hằng ngày.</p>
                    </div>

                    <div className="quality-item">
                        <img src="https://cdn-icons-png.flaticon.com/512/3159/3159310.png" alt="support" className="quality-icon"/>
                        <h3>Luôn lắng nghe khách hàng</h3>
                        <p>Anzi luôn ghi nhận phản hồi của khách hàng để liên tục cải thiện và mang đến trải nghiệm tốt hơn mỗi ngày.</p>

                    </div>

                </div>
            </div>

        </>
    )
}

export default Home