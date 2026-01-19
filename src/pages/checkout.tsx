import {useContext, useEffect, useState} from "react";
import {CartContext} from "../components/CartContext";
import {api} from "../services/api";
import {Address, Order, OrderItem} from "../types/object";
import {formatPrice} from "../components/formatPrice";
import {useNavigate} from "react-router-dom";
import "../styles/styles.css";
import useGeoLocation from "../components/location";

const Checkout = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const {cart, totalPrice, clearCart} = useContext(CartContext);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

    const [myVouchers, setMyVouchers] = useState<any[]>([]);
    const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(null);
    const [voucherId, setVoucherId] = useState("");
    const [userVoucherId, setUserVoucherId] = useState<number | null>(null);
    const [discount, setDiscount] = useState(0);
    const [noteForChef, setNoteForChef] = useState("");

    const [paymentMethod, setPaymentMethod] = useState<string>("CASH");

    const [showForm, setShowForm] = useState(false);
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);
    const [shippingFee, setShippingFee] = useState(0);
    const [isFreeShipVoucher, setIsFreeShipVoucher] = useState(false);
    const isAlreadyFreeShip = shippingFee === 0 && !isFreeShipVoucher;
    const finalTotal = totalPrice - discount + shippingFee;
    const [locationError, setLocationError] = useState("");
    const {
        address: geoAddress,
        loading: geoLoading,
        error: geoError,
        getCurrentLocation
    } = useGeoLocation();

    const calculateShippingFee = (address: Address | undefined, total: number) => {
        if (!address) return 0;

        if (total >= 250000) return 0;

        if (isFreeShipVoucher) return 0;

        const district = address.district.toLowerCase();
        const ward = address.ward.toLowerCase();

        if (district.includes("thủ đức") && ward.includes("linh trung")) {
            return 10000;
        }

        if (district.includes("thủ đức")) {
            return 20000;
        }

        return 30000;
    };

    const [formData, setFormData] = useState({
        receiverName: "",
        phone: "",
        province: "",
        district: "",
        ward: "",
        detail: "",
        isDefault: false,
    });

    useEffect(() => {
        if (locationError) {
            const timer = setTimeout(() => setLocationError(""), 2000);
            return () => clearTimeout(timer);
        }
    }, [locationError]);

    useEffect(() => {
        if (geoError) {
            setLocationError(geoError);
            return;
        }
        if (!geoAddress || geoLoading || geoError || provinces.length === 0) return;

        const provinceName = geoAddress.province?.trim().toLowerCase() || "";
        if (!provinceName.includes("hồ chí minh") && !provinceName.includes("ho chi minh city")) {
            setLocationError("Xin lỗi, hiện chúng tôi không hỗ trợ cho các khu vực ngoài TP. HCM");
            setFormData(prev => ({
                ...prev,
                province: "",
                district: "",
                ward: "",
                detail: "",
            }));
            setDistricts([]);
            setWards([]);
            return;
        } else {
            setLocationError("");
        }

        const provinceObj = provinces.find(
            (p: any) =>
                p.name.trim().toLowerCase() === provinceName ||
                p.name.trim().toLowerCase().includes(provinceName)
        );

        if (!provinceObj) return;

        const provinceCode = String(provinceObj.code);

        setFormData((prev) => ({
            ...prev,
            province: provinceCode,
            district: "",
            ward: "",
            detail: geoAddress.detail || prev.detail || "",
        }));

        const loadAndSetDistricts = async () => {
            try {
                const districtList = await api.getDistrictsByProvince(provinceCode);
                const sorted = districtList.sort((a: any, b: any) =>
                    a.name.localeCompare(b.name, "vi", {sensitivity: "base"})
                );
                setDistricts(sorted);

                const districtObj = sorted.find(
                    (d: any) =>
                        d.name.trim().toLowerCase() === geoAddress.district?.trim().toLowerCase() ||
                        d.name.trim().toLowerCase().includes(geoAddress.district?.trim().toLowerCase() || "")
                );

                if (!districtObj) {
                    console.warn("Không tìm thấy quận/huyện:", geoAddress.district);

                    return;
                }

                const districtCode = String(districtObj.code);

                setFormData((prev) => ({
                    ...prev,
                    district: districtCode,
                    ward: "",
                }));

                const wardList = await api.getWardsByDistrict(districtCode);
                const sortedWards = wardList.sort((a: any, b: any) =>
                    a.name.localeCompare(b.name, "vi", {sensitivity: "base"})
                );
                setWards(sortedWards);

                const wardObj = sortedWards.find(
                    (w: any) =>
                        w.name.trim().toLowerCase() === geoAddress.ward?.trim().toLowerCase() ||
                        w.name.trim().toLowerCase().includes(geoAddress.ward?.trim().toLowerCase() || "")
                );

                if (wardObj) {
                    setFormData((prev) => ({
                        ...prev,
                        ward: String(wardObj.code),
                    }));
                } else {
                    console.warn("Không tìm thấy phường/xã:", geoAddress.ward);
                }


            } catch (err) {
                console.error("Lỗi auto-fill từ geolocation:", err);
            }
        };

        loadAndSetDistricts();
    }, [geoAddress, provinces, geoLoading, geoError]);

    useEffect(() => {
        const fetchProvinces = async () => {
            const data = await api.getProvinces();
            const hcm = data.find((p: any) => p.name.includes("Hồ Chí Minh"));

            if (hcm) {
                setProvinces([hcm]);
                const provinceCode = String(hcm.code);
                setFormData(prev => ({...prev, province: provinceCode}));

                const districts = await api.getDistrictsByProvince(provinceCode);
                setDistricts(districts);

                if (districts.length > 0) {
                    const wards = await api.getWardsByDistrict(districts[0].code);
                    setWards(wards);
                }
            }
        };
        fetchProvinces();
    }, []);

    const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        setFormData({...formData, province: code, district: "", ward: ""});

        const data = await api.getDistrictsByProvince(code);
        setDistricts(data);
    };

    const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const code = e.target.value;
        setFormData({...formData, district: code, ward: ""});

        const data = await api.getWardsByDistrict(code);
        setWards(data);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, type, checked} = e.target;
        setFormData({...formData, [name]: type === "checkbox" ? checked : value});
    };
    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        const provinceName =
            provinces.find(p => p.code === Number(formData.province))?.name || "";
        const districtName =
            districts.find(d => d.code === Number(formData.district))?.name || "";
        const wardName =
            wards.find(w => String(w.code) === formData.ward)?.name || "";

        const newAddress = await api.addAddress({
            ...formData,
            province: provinceName,
            district: districtName,
            ward: wardName,
            userId,
        });

        setAddresses(prev =>
            formData.isDefault
                ? prev.map(a => ({...a, isDefault: false})).concat(newAddress)
                : [...prev, newAddress]
        );

        setSelectedAddressId(newAddress.id);
        setShowForm(false);
    };


    // ===== LOAD ADDRESS =====
    useEffect(() => {
        if (!userId) return;

        api.getAddressesByUser(userId).then(data => {
            setAddresses(data);
            const defaultAddr = data.find((a: Address) => a.isDefault);
            if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        });
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        api.getUserVouchersWithDetail(userId).then(setMyVouchers);
    }, [userId]);

    const calculateDiscount = (voucher: any, total: number) => {
        if (total < voucher.minOrder) return 0;

        if (voucher.discountType === "PERCENT") {
            return Math.min(
                (total * voucher.discountValue) / 100,
                voucher.maxDiscount || Infinity
            );
        }

        if (voucher.discountType === "FIXED") {
            return voucher.discountValue;
        }

        return 0;
    };

    const availableVouchers = myVouchers.filter(v => {
        const voucher = v.voucher;
        if (!voucher || v.used) return false;
        if (new Date(voucher.expireDate) < new Date()) return false;
        if (totalPrice < voucher.minOrder) return false;
        if (voucher.discountType === "FREESHIP" && isAlreadyFreeShip) return false;
        return true;
    });

    const handleSelectVoucher = (v: any) => {
        const voucher = v.voucher;

        setVoucherId(voucher.id);
        setUserVoucherId(v.id);
        setSelectedVoucherId(v.id);

        if (voucher.discountType === "FREESHIP") {
            setIsFreeShipVoucher(true);
            setDiscount(0);
        } else {
            const discountValue = calculateDiscount(voucher, totalPrice);
            setDiscount(discountValue);
            setIsFreeShipVoucher(false);
        }
    };
    const handleCancelVoucher = () => {
        setSelectedVoucherId(null);
        setVoucherId("");
        setUserVoucherId(null);
        setDiscount(0);
        setIsFreeShipVoucher(false);
    };


    useEffect(() => {
        if (!selectedAddressId) return;

        const addr = addresses.find(a => a.id === selectedAddressId);
        setShippingFee(calculateShippingFee(addr, totalPrice));
    }, [selectedAddressId, isFreeShipVoucher, totalPrice]);

    const handlePlaceOrder = async () => {
        if (!userId) return alert("Vui lòng đăng nhập");
        if (!selectedAddressId) return alert("Vui lòng chọn địa chỉ");
        try {
            const order: Omit<Order, "id"> = {
                userId,
                totalPrice,
                discount,
                shippingFee,
                finalPrice: finalTotal,
                addressId: selectedAddressId,
                voucherId,
                noteForChef,
                methodPayment: paymentMethod as Order["methodPayment"],
                status: "PENDING",
                createdAt: new Date().toISOString(),
            };

            const createdOrder: Order = await api.createOrder(order);

            const orderItems: Omit<OrderItem, "id">[] = cart.map(item => ({
                productId: item.id,
                orderId: createdOrder.id,
                quantity: item.quantity,
            }));

            await Promise.all(orderItems.map(item => api.createOrderItem(item)));

            if (userVoucherId) {
                await api.useVoucher(userVoucherId);
            }

            clearCart();
            navigate("/order-success", {
                state: {
                    orderId: createdOrder.id
                }
            });
        } catch {
            alert("Đặt hàng thất bại");
        }
    };

    if (cart.length === 0) return <h2>Giỏ hàng trống</h2>;

    return (
        <div className="checkout-page">
            <h2 className="checkout-title">Thanh toán</h2>

            <div className="checkout-container">
                <div className="checkout-left">
                    <div className="checkout-card">
                        <h3>Địa chỉ giao hàng</h3>
                        <button
                            className="btn-add-address"
                            onClick={() => setShowForm(true)}
                        >
                            Thêm địa chỉ mới
                        </button>
                        {addresses.length === 0 && (
                            <p className="text-muted" style={{marginBottom: 10}}>
                                Bạn chưa có địa chỉ
                            </p>
                        )}


                        {addresses.map(addr => (
                            <label
                                key={addr.id}
                                className={`address-card ${selectedAddressId === addr.id ? "active" : ""}`}
                            >
                                <input
                                    type="radio"
                                    checked={selectedAddressId === addr.id}
                                    onChange={() => {
                                        setSelectedAddressId(addr.id);
                                        setShippingFee(calculateShippingFee(addr, totalPrice));
                                    }}
                                />

                                <div className="address-content">
                                    <strong>{addr.receiverName} - {addr.phone}</strong>
                                    <p>
                                        {addr.detail}, {addr.ward}, {addr.district}, {addr.province}
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>

                    <div className="checkout-card">
                        <h3>Voucher của bạn</h3>

                        {availableVouchers.length === 0 && (
                            <p className="text-muted">Không có voucher phù hợp</p>
                        )}

                        {availableVouchers.map(v => {
                            const voucher = v.voucher;
                            return (
                                <div
                                    key={v.id}
                                    className={`voucher-row ${selectedVoucherId === v.id ? "active" : ""}`}
                                    onClick={() => handleSelectVoucher(v)}
                                >
                                    <div className="voucher-content">
                                        <strong>
                                            {voucher.discountType === "FREESHIP" && "Miễn phí vận chuyển"}
                                            {voucher.discountType === "PERCENT" && `Giảm ${voucher.discountValue}%`}
                                            {voucher.discountType === "FIXED" && `Giảm ${voucher.discountValue.toLocaleString()}đ`}
                                        </strong>

                                        <p>
                                            Đơn tối thiểu {voucher.minOrder.toLocaleString()}đ
                                            {voucher.discountType === "PERCENT" && voucher.maxDiscount && (
                                                <span className="voucher-max-inline">
            {" "} -    Giảm tối đa {voucher.maxDiscount.toLocaleString()}đ
        </span>
                                            )}
                                        </p>


                                    </div>


                                    {selectedVoucherId === v.id ? (
                                        <div className="voucher-applied-actions">
                                            <span className="voucher-applied-text">Đã áp dụng</span>
                                            <button
                                                className="btn-cancel-voucher"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCancelVoucher();
                                                }}
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    ) : (
                                        <button>Dùng</button>
                                    )}

                                </div>

                            );
                        })}
                    </div>

                    <div className="checkout-card">
                        <h3>Phương thức thanh toán</h3>

                        <label className={`payment-option ${paymentMethod === "CASH" ? "active" : ""}`}>
                            <input
                                type="radio"
                                checked={paymentMethod === "CASH"}
                                onChange={() => setPaymentMethod("CASH")}
                            />
                            <img
                                src="data:image/png;base64,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"
                                alt="Tiền mặt"
                                className="payment-icon"
                            />
                            <span>Tiền mặt khi nhận hàng</span>
                        </label>

                        <label className={`payment-option ${paymentMethod === "BANK" ? "active" : ""}`}>
                            <input
                                type="radio"
                                checked={paymentMethod === "BANK"}
                                onChange={() => setPaymentMethod("BANK")}
                            />
                            <img
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAk1BMVEX///8zgcwoesg0gM4lesq1y+Smw+IzgcujwN+/0uYqfssuf8q5zuj6+vxUks6fvd7r8fZqm88sfc7l7fTy9vmwx+MfeMXo7/VAh8zV4e3F1ud6pNBPjckfeMuLr9WxyeKAqdRHicljl8w8hs2PstdEh8fb5fDL2+mXuNtqnNJ2otKpwttclMyHrthFiM43gcVek9HYIULPAAAWGklEQVR4nNVdZxuiuhLWBDeSHJCmgmLBXtf9/7/uAjZSCSrinfPh7LMrkDeZTM+k1aqZLGcTmf3d+bA/JUvUzggtk9P+cN71zch3rLoHUCNZTtTpzd04RDgnmFKOMPvD9a/Q39id9zpR8P+HM4hm01OIAcCYEHhdOp5QmxCc/oisT6sUZtOD1iYnOrpJOwVHJMB4ItjD7cQ9/j+gDMzVKeVKAtuyhZMRTJcTnabmL4O0/NkeGRhXhFYkjA20n/m/uS0d8xBiD74B77aWHg4PptM0HJas7TSssvHURDAIp9tfWki/b7fBO8zJU7on7ZnfNLAb+auEvM+cHEEMkt0PYLS2LgZ1AMyIAOBGDTPrdrz8LHcyhPByvG0Q3+hAPiZdZAQ9cmgKYzTWhAfbN/0PIcnoap6ithZvI5TasOOoAXzB7uJp4SOZiT2ZGANACEJomf5HCDCMySQ1WjXnyFvuvm3qWL2LUb4EqV7DaH3aT7udUeQPA+sqNSwrGPrRqNOduqc1wYYOTHDpfVXkjFyjRMAg4mGU7Kedra9wjazA33ZWboKwh0rsWILd721HZ5rqY9WAUilP7LO+PxREnbOdPqSaNYQ8PP2SLddJlOtHQDueVzeeU7N9HiO12Y6TTi2IaApWWLEBMR6E59HwxXcPR9NwoAKJwap2iTNaT6SeX+r6xKt35fp2GmMFSG89+ggOGQU9JF1A4i3dzic2yrDjLoFUvELUq3EZ/ROQrR8EyWrzsQ9tVolM7CBkLF7dBaVkSkUM8f71PyvnnP4/KPsaTsyPfutBXST+JErdnBqiK4GZGETMMhB1P/65dFLHA8mMeouaprRlLjyJZTgYf1w1Dk9iJUGwPatv5wczW2zSQfzpzbiNDSE+ENYp2VqZ9A7FctWIP2rEmaEn2hEYnauGGRy/Knv5Z+H+R174Qc1oCrUgMeyq37B29treVTXoRrHIj4EQfWz/9wgWrKAX9qq+yIwNj3jG38oj664FEgdBUnkEYjqKmCTd6lXtM2eashvKfHtU2UmIFkJLjhwrvkdIXSwwRDGpzGtmDB6Pg7jqMlo7IoDofWIVuwJJBnFcdQH9MxVyxKSyjIpiXl+l/PC27p+JtIRxqDo8M2ZiqphUXkZ/PBHMNniTUXuCecOo6ks3Y4MeW/ZSMhlXNdWPiBN574obk7B7EFa3e63MYqdfAyFJ7bHLqTIrpG9ip5yQN5TGSKAHcVxxWP6BNbwwwOv9rhP51c0hP+blDUQvq/5tyOtBMK5mDwb9EFOjwWS52I1eLsEYjgE7JITDFw24YcyrWTCvNu/DA4JFPvCMcPdesj44cBChF79khjsnzhZFZFfpFVbqUsInwtQ0mj5n23I2205vOj/s9+5hvuqauly74yWqsXjFmRqzHJ96usdKzLU5UIYIuZzvWtTyR7uDHSKC7+Sl3Pv3NO5qLLDVBdzuwePqALsDTspUlMu95SOQDVEboOldREVdd5klLUiBgWH6U4iBQcJ5p1SU9ThxAweV1aJ54VaQzKq8YLsv+HXpw+5N+fndkzLuSzAMD2VBkSPh4huXijrD54JOyKhkH3UvhRcg7zK78nc0zeo11CmKjHdPXTXGLi9ukkrSJlhws1zJjB/ZE2pZ5ldBMHIH3MjEhMFlpWTWIydu8KKKjO5x1mgVXyLoUV45RtcF3MwvFTLiEIR/FEO2etxcgQpiYsSbahVk1dYGRSEFrgEVa3cBonwATLlSFEFAbWKcVMZKqvrp54i+bROs2bkGY20OGK4QxUDYzbltuzAkgXq8TGSZgtTHkm+ugLNu8Fp3lKsJPdcI6tsMEWM4Gm7+1VkoY1B42fr8prp9OGUAuf/hxKxJMlnpDbLD6lOc6Brbw/mARgKm2RZ05hNpQgdkozrJEzEKCccLfKyVX3QSRpoT7ZiWaWP6WXzIAS5Ekaw7wkw+7KUiKPX/5DLOvBDmx4mO9TZlv2Zo6glnzoZSJoeMRTcnRdEGwhlCV1XWYZyl2+vI8gaelo9zy628phjtxNzOP2Uzuok5N5r6USlCeOUEIR240ZY6Uhb7MU2P1zlzsTC8zAxt5yRXgqn14k0yd2UxmahqHwypBPFjZkt5bpne7rEAiVZU7YgMbqHy7evIWRQSHB+OedJ/Y3bHscJaBVLmi1hl6pXo/eDCCAWs4xH6c8zZmgisstkcy4RMavaMzYKrbw1NFxPJQqKL1OrfecxrL2qluGPMNW+hYazNQsE64XX25FGSdEyXZc8zRyeRzQe5yFjJWjAfB0qlGIWMIRSW82h0EKa/ch4dXSSKDgJhVm4j27SQnGRGRxQykUrlmOeMlTApN2Y7beFGA5kEtmQDRjKpvgmlFpx0K7JugjeXj3bEDAifyvBFpwkRVVHiSyaBd7LioqIGorfBVrbqbUOqB2xq2KjtyTUGo13IssRYD45LUdrmPuObUDbay8PajOaZDOk+rabdRPwIwq5MhIyW9HfwQTbgLTMguYy+0uYkq8BEOYSzzN3F5/sU7bCRbYTF5FF5EMhqkgiQGp1T5kNAsojWmK4HIqFS1wdZpEkGYd7ixdYDfpvceSNlmptNAx4rJJ+Xk2wR/b/02oCxWANsl4zZrBQzm4VMeaXkZRDOsl0I1ze5aE4eVht65JBMqZ+BpR4AHXxDcCleRJfehdhWqM5gSvgcyQNBHjJxZBViqeS/vWXupYbBzS6Fye1zUSh5bboTZco5sJmxu6Jf+fSPkKcIHm5ZNUtDyC2nmYzb4F0SWCmTPhA+Ng8bQikMCUnd4Rm9YRAWbbAdPSJF6CrYEXURuxFlw5c6vU+EKaM/EOZ7tyWItRfeKw1ossFBQ2Bs+gmzW6VMb9olJ9TIJeUmX6q7n9J8V+DSdIWyWvWgKy1/zJhP7gzTap8IwhJ9ZgkT2WztMG9mMwizXcDFQgrvXtzetZng9hMhBO5qt1C9XCXd6QVCgNtjFrNXoWQJt+vymG4uHueKwER83wCdv9dqiptTilXVwTlEeTzFpDcOttnl3tKKFv8T70Jfav2z47ChnJXRwzaODqTUxy8OS+43BP+o70HEKgwmOgP64vf0DI3jvZlxPxR5VI+BFuTANhuJUjQXiCgMZXabMQaZQ8cziSxmxSdgBcPIdnmkOtXE7adVqHd6mFzkCB16J+KQhmAyEyDjBvnuKjxsp+82ldzMvt/yO+PLACgY+0ZAYYWsaEZglAHtVeClTLWOpD574enMfuwopwIBXl9Zo3N55magMJU39FFIOkLnh0yuQfYWa4q92xk7KYF9+uo/aoQQixLmERdxZclQFRnRZie9FfqMnFEEuTuuXUZZJJ9PRDOED6LBziTV8jeChipCwW61okqkZRmJlbFxq5RaeUWjklC6Fc6CM74jLu9F0USF0KGzQt7i+U8BFXSERCM0XkZlCNv5gfTDjJtLU+LjX2mgLIWbgqJDB9FTLNFGHRx8oEZcLWmuhBA2yIKNlHB5k+LQJkqnPKLrRybPzUZFASAJ3weYaotyhO08Q5jZNJvCUvqJQmkQdbiXtvafUZiADvqBs+olmhShEvP8TrkRu1j2nouzkicbVRo/ozOtLx4+fMSMRScdHrDE/PtQmvTNv03Qrb/L3Xvywof6YANixecWLSWN6J8/7N8jJWWJRkrb6tr2vyLZJybJaNnScaZu0qIz6rhGEWEbgrt760hDpqXpwWFMPfqI/bj0X89LAbbMQd71qUAeK54U9t3N8M4r8O4IUZvcvQFppFzpPd2+Si3W3XIJGOAaxV18SVIb/Ef/ZCYd5jVxmk54Zio/fXzo3S05V/YoCcvqpmeUVUlujijtBiCkkRHVQLhZyhA+YijZhD8RPm1FqbeI92WZMJ+KcML2dSPSQTHCOcd6CA0GoSVdiUft0ghDEULrJJOl5aV1zPa/1WZMqdiPp6MrNBCmHqlEXTxi+o5NIbxrqSCRpEkhKS/uP1Pr762uU1aEjZBOSYoOwgBJNDfZ31XLbFLch/CmpSJpWF+acXkSbUvhU8aQwbqIECKdvL0OwtZcFnRc35fCiguxNnD357qySInOsQNat5N1JtQiinNJolMbpoUwWor1GkQP93cTe1eEEAH7JuEElZ8ZIeSdNCREwMQysvXqCFXIBxBySa/HLD5DCP44L453jeX8bmd0ZKUNhP+CgGgBl3u6dKGmOs9fDeEGiXOBsJACtkaZnp9OH66ilchqGKUZUopWNJyMQ+g8gV7tmx7CVleWYJxIa1gs2cKXuIYPYkTNOKvWoHNvWr6hJsJAVi6EpAfqd5K+YfCeuCmjLZ0DXViM61+S962IkI2kF2ggbFISyKxZ6J00z4z4lGrIAjI+lZCUZ5JfQihPIiLPNlnRGPwnOfSfFQboHumknd1sxSgFAhX5q5cQtsbCc/x56TgZd4rT6cxceWc7rH1SILUWC2/J1DsdbtCpz6yE0JJBbGce1+W0y0/IbPtnGwBpeSLMVYqlx6dUnAdhkwmVYr1jI/oIswJhCcSMCL7WCBvZxEu6ukJ4raHt6K1jl+J03G/tqAEYeid/KiBMIaqyOVe7dK8sC8gryFqbgd55Cvrkcrr6VPAGTfSOLFRB2BoegCIqhdV13u0sZJbXUtsaRXYZjahAVqpk6BCGMmr+IsJW4BpyiPm+2MuDOvhW7n8ihh7CiCrUwnum7E2V23kZYat1lIdA86CmPDIDw3zf+DFGmqd+NlQgA9stm85u6x0dqYrQOsg32mU7/CMzDJCX5Ey1WRDtc01OESEicSuhUxZ652qqIgykB38yHYwk5/UyDs01RJQHXzURBow32Fp+A+FoogyAS5QEvp3sml0zp9oIKURLBiHSO4NXFeFUpvblhA3SzRfw0fNDE6GFGITUa8lS6yVVETpxxUbDEOOkezuVad9nR/d8IX12rv0VhPJiPDFhbN8yNUGhFYYuwmUDCGmvNrv6IQ/oi7cfAJf53e0w40I7k19GWHTZUgFpnw8Jyu67YMFBglF8vjdftEZ7UrQxfxjhZnBfLdgmxmWXIhhuu+MYDQxggLzhQPr/yYDE4+P24UCMDkyX/lf34RdkafcuKxAEYaHlseVvzeNudZ7Pz6vuzNwUNVWUcH18X5WlX9CHj6NJ+DLXbbrTMbht+qo+/IJNc7wGsaFx63VsjczSJrz/CbJbL9o0tKrCen50NYROViODyeIqIa3tyQOhPe8qjfz/eBtB1y4tji2zS2nLux7fYnsC5N4AdDPGWZU/xoakwPNdhD7rW9A1e7X4hykFN97wp4PHpqwJIe0fkv0XfPwnOX8K58vrQsj5+EycRq9h9msIO0nxpGJdCOk4Dd7VHmu7UrDZdhe0FVMXwh4ba6s5XnqjDkJsc+e6EHLx0ppj3jfq84GYmhDyMe968xbfR8jnLZjc0/qjuacGEPK5J6bu5aP5wyYQ8vnDOnPATSDkc8A15vEbQSjI49dXi9EIQqYWI2PJ2uppGkHI1NPkfUucumqiGkEoqomqq66tGYSiura6ahObQSiqTWzNqAZyn6ovbQYhW196TWkzNcLktRrh30AorhFmxM+Ldd6/gVBc582qkPlLCCdKCdXn09hEibDzGkJxrf4L5y36HEJkKMtbBYeE5F0u8gf4MlrZ2eQCyc5bVD8z49uYOVZZ4nYN+Qds5USmThD7gEZbNdmZGaf6uSfHZGhUYgo5I/aBkshswD6gc0XwlNGGj0HVcHatGZKdXWNONcJBE3difoKY84cF0UB3LvrIGdJGiDlDWkzC7KucA/5ZUpwDZo9hqc5y/zCpznIzzWkUbvD2T9MkDySpzuNbuj0VTAIwAEZTBACYSE/OcD0VlAssi9YcQBs2TIbs9JO6L4Z2b5MKPcdrIllP3JLeJrr9aX4YYUl/Gt0eQ7+LsLTHkGafqN9FWNonij37Ien19bsI2V5f/DbT69f2swgZZSDq16bXc0/REO9bJEQYLOj1EfXca/k0QnHfxF9FqNU3Uav35dhT9Vf/AqG2J0Co1/tSq3/p6AKapovAMNXsX6rVg3bTaZoEJjPTyEvag5a7NKCsj/DPENuYV9ZHmO8F/fqldF+lEVMzq+hMwPXztr84zteJ7ecNFbUI4+o92ZunKj3ZX+qr3zRV66v/2t0IjRJ3N4LQnHmS89L9Fk0SXVtZfr/Fq3eUNEYRm9QqzVBxrYEq36z6VfJj5ppAjdJDVmO8dD3k14jzBMrvCnrjvqcG6KX7nt65s+vbxN/ZpZeP6LAtrPTvXfsucfeuIb26Q8HdeS/et1szDV++O++9+w+/Ru/cfyi6w1KjkdiXac7dYVl2LU6R3ruH9Btk7bhykCr3kLI9W3OIv6Uzum/eJdsavnsfcM309n3AqarhborDP7SKR8I1ta96p/Mn7uWujz5yL7f4bvXuL4ibT92tLuoNhMgveIs7vgrQWLxUPZLaDByjNq/6eUXfhi/bXNuQ76pijJs14IZ87zCEX48mmYLOOM16xH7Mp4bgO76PyV10mxpwSXPOlJnwd6ERncatcurxbf4QRk0pxkKjk8doIHnTEjny9c5tYhya4FR/PBC0BMN6HeYUJLpsBOL4+xG4KObxoTb8gC3ZFV3Eib/tazx6KVHkfcbMOmIBc0C8+OYyRgvhhVDkbRa9Uo+Iuo154ffM1O5a0O/tfSHzJFN4gw8x7O/kF0ex6EZX+JYeZMkMhT2PMTrXL1T9qXB+kRd+VC9vY2GLTgJC4e3Tn6OgFwovxW4bnxbnQ0mLX4LtWX0Yg5ktEnO5oPu4feyMJVeuYW9RlxlnLjxJR8nBvI5i+67kxrDUM7631/kkBWZiEHF5ErzUZDeaXHjqwaveqf/ZSXX6/zzZ12q0/f2T9KJXCJKVbh+vctqsErYVyoNjkPH5LfikoCdtsp7K1aXb+cRCDk13KZaf+VSimqX3aD2R1u5hbMSr7Zv2ajSNgeLKTm9du5URrGSd4a8gB+F59CoXDUfTcKC6kRQDYTv+T1NHKnByIqAdz2elLedYsvzZPEbqC1dxopkffJecKZY2iL9NNSD2tBPpzncQdc42ATLhkhNCHp5+78TZ1uX6NrIDIh5GibvqbP1AvpxW4G87KzdB2FNOWTszntwPXMuoT1bvIrL3uVEBjNYnd9qdjSJ/GNywWlYw9KPRrLtyT2uCDbFhRhO4fD3e7uwuehcxk6w/6WRiGIAQtMwIEQIGxmSStS7VAJeSt9w1EYmOxlBvfPB+68Htnt1r2zakuvX5SQhBjOdNFWaNDkRzEV4n6JHDVzcgQ9vxskTkvEcIL8dN4mtl3UhdDOS3p7xHBKQC9AcSev4qqQMiTJ2y3a+UKvl9u61U19UptSns/q/gy8jaTkPwMamT6tFw+gvsSZNjHkIsuxCwAkEPhwedJhgNkOX3F8hQG88llDpgaF/dbP8mBebUTj0EIrnZSLV2qfFzOU1riPh8nILo6CZtUGVbEuzhduL2o99kThEF0WyaWtUpTEyEWY+cUG61pj9an1b6vtbvkOVEnd54EYeZZZkxLrz1Ec4bB2R/g5d/Y3feS8H98sYrI8vZRGZ/dz4s4mR5XUy0TOLT4bzrm5Hv1I7tf/3NpvawITp+AAAAAElFTkSuQmCC"
                                alt="Chuyển khoản ngân hàng"
                                className="payment-icon"
                            />
                            <span>Chuyển khoản ngân hàng</span>
                        </label>

                        <label className={`payment-option ${paymentMethod === "MOMO" ? "active" : ""}`}>
                            <input
                                type="radio"
                                checked={paymentMethod === "MOMO"}
                                onChange={() => setPaymentMethod("MOMO")}
                            />
                            <img
                                src="data:image/png;base64,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"
                                alt="Ví điện tử"
                                className="payment-icon"
                            />
                            <span>Ví Momo</span>
                        </label>
                    </div>
                </div>

                <div className="checkout-right">
                    <div className="checkout-summary">
                        <h3>Đơn hàng</h3>

                        {cart.map(item => (
                            <div key={item.id} className="summary-item">
                                <span>{item.name} x {item.quantity}</span>
                                <span>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                        ))}

                        <div className="summary-row">
                            <span>Tạm tính</span>
                            <span>{formatPrice(totalPrice)}</span>
                        </div>

                        <div className="summary-row discount">
                            <span>Giảm giá</span>
                            <span>-{formatPrice(discount)}</span>
                        </div>

                        <div className="summary-row">
                            <span>Phí vận chuyển</span>
                            <span>
        {shippingFee === 0
            ? "Miễn phí"
            : formatPrice(shippingFee)}
    </span>
                        </div>


                        <div className="summary-row">
                            <span>Phương thức thanh toán</span>
                            <span>
                                {paymentMethod === "CASH" && "Tiền mặt"}
                                {paymentMethod === "BANK" && "Chuyển khoản"}
                                {paymentMethod === "MOMO" && "Ví điện tử"}
                            </span>
                        </div>

                        <div className="summary-total">
                            <span>Tổng thanh toán</span>
                            <span>{formatPrice(finalTotal)}</span>
                        </div>

                        <div className="summary-row note-order">
                            <span>Ghi chú</span>
                        </div>

                        <textarea
                            className="order-note"
                            placeholder=""
                            value={noteForChef}
                            onChange={(e) => setNoteForChef(e.target.value)}
                            rows={3}
                        />

                        <button className="btn-place-order" onClick={handlePlaceOrder}>
                            Đặt hàng
                        </button>
                    </div>
                </div>
            </div>

            {showForm && (
                <div className="address-overlay">
                    <form className="address-form" onSubmit={handleAddAddress}>
                        <div className={"title-location"}>
                            <h3>Thêm địa chỉ mới</h3>
                            <div className={"location"} onClick={getCurrentLocation}>
                                <i className="fa-solid fa-location-dot"></i>
                                <div>Vị trí hiện tại</div>
                            </div>
                        </div>

                        {locationError && (
                            <div className="custom-toast error">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                                {locationError}
                            </div>
                        )}

                        <input
                            name="receiverName"
                            placeholder="Họ và tên"
                            value={formData.receiverName}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="phone"
                            placeholder="Số điện thoại"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />

                        <select value={formData.province} onChange={handleProvinceChange} required>
                            <option value="">-- Chọn Tỉnh --</option>
                            {provinces.map(p => (
                                <option key={p.code} value={p.code}>{p.name}</option>
                            ))}
                        </select>

                        <select value={formData.district} onChange={handleDistrictChange} required>
                            <option value="">-- Chọn Quận --</option>
                            {districts.map(d => (
                                <option key={d.code} value={d.code}>{d.name}</option>
                            ))}
                        </select>

                        <select value={formData.ward} onChange={e => setFormData({...formData, ward: e.target.value})}
                                required>
                            <option value="">-- Chọn Phường --</option>
                            {wards.map(w => (
                                <option key={w.code} value={String(w.code)}>{w.name}</option>
                            ))}
                        </select>

                        <input
                            name="detail"
                            placeholder="Số nhà, tên đường"
                            value={formData.detail}
                            onChange={handleChange}
                            required
                        />
                        <div className="form-btn">
                            <button type="submit">Lưu</button>
                            <button type="button" onClick={() => setShowForm(false)}>Hủy</button>
                        </div>
                    </form>
                </div>
            )}

        </div>
    );

};

export default Checkout;