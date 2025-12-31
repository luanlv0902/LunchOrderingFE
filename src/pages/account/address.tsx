import { useEffect, useState } from "react";
import "../../styles/styles.css";
import { api } from "../../services/api";
import { Address as AddressType } from "../../types/object";
import useGeoLocation from "../../components/location";

function Address() {
    const [addresses, setAddresses] = useState<AddressType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [success, setSuccess] = useState("");
    const [locationError, setLocationError] = useState("");
    const {
        address: geoAddress,
        loading: geoLoading,
        error: geoError,
        getCurrentLocation
    } = useGeoLocation();
    const [formData, setFormData] = useState({
        receiverName: "",
        phone: "",
        province: "",
        district: "",
        ward: "",
        detail: "",
        isDefault: false,
    });
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (locationError) {
            const timer = setTimeout(() => setLocationError(""), 2000);
            return () => clearTimeout(timer);
        }
    }, [locationError]);

    useEffect(() => {
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
                    a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
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
                    a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
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
        if (!userId) return;

        const fetchAddresses = async () => {
            try {
                const data = await api.getAddressesByUser(userId);
                setAddresses(data);
            } catch (error) {
                console.error("Lỗi lấy address:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAddresses();
    }, [userId]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const data = await api.getProvinces();
                const hcm = data.find((p: any) => p.name.includes("Hồ Chí Minh"));
                if (hcm) {
                    setProvinces([hcm]);
                    const provinceCode = String(hcm.code);

                    // Set mặc định province
                    setFormData(prev => ({ ...prev, province: provinceCode }));

                    // Load districts
                    const districtList = await api.getDistrictsByProvince(provinceCode);
                    const sortedDistricts = districtList.sort((a:any,b:any)=>a.name.localeCompare(b.name,"vi",{sensitivity:"base"}));
                    setDistricts(sortedDistricts);

                    if (sortedDistricts.length > 0) {
                        setFormData(prev => ({ ...prev, district: String(sortedDistricts[0].code) }));

                        // Load wards
                        const wardList = await api.getWardsByDistrict(sortedDistricts[0].code);
                        const sortedWards = wardList.sort((a:any,b:any)=>a.name.localeCompare(b.name,"vi",{sensitivity:"base"}));
                        setWards(sortedWards);

                        if (sortedWards.length > 0) {
                            setFormData(prev => ({ ...prev, ward: String(sortedWards[0].code) }));
                        }
                    }
                }
            } catch (err) {
                console.error("Lỗi load tỉnh:", err);
            }
        };
        fetchProvinces();
    }, []);


    const handleProvinceChange = async (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const provinceCode = e.target.value;

        setFormData({
            ...formData,
            province: provinceCode,
            district: "",
            ward: ""
        });

        setDistricts([]);
        setWards([]);

        if (!provinceCode) return;

        const data = await api.getDistrictsByProvince(provinceCode);
        const sortedDistricts = data.sort((a: any, b: any) =>
            a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
        );

        setDistricts(sortedDistricts);
    };


    const handleDistrictChange = async (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const districtCode = e.target.value;

        setFormData({
            ...formData,
            district: districtCode,
            ward: ""
        });

        setWards([]);

        if (!districtCode) return;

        const data = await api.getWardsByDistrict(districtCode);
        const sortedWards = data.sort((a: any, b: any) =>
            a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
        );

        setWards(sortedWards);
    };

    const handleWardChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const wardCode = e.target.value;
        const wardName =
            wards.find(w => w.code === wardCode)?.name || "";

        setFormData({
            ...formData,
            ward: wardCode
        });

    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleDeleteAddress = async (id: number) => {
        const confirmDelete = window.confirm(
            "Bạn có chắc chắn muốn xóa địa chỉ này không?"
        );

        if (!confirmDelete) return;

        try {
            await api.deleteAddress(id);
            setAddresses(addresses.filter(addr => addr.id !== id));
            setSuccess("Xóa địa chỉ thành công");
            setTimeout(() => setSuccess(""), 2000);

        } catch (error) {
            console.error("Lỗi xóa địa chỉ:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        const provinceName =
            provinces.find(p => p.code === Number(formData.province))?.name
            || addresses.find(a => a.id === editingId)?.province
            || "";

        const districtName =
            districts.find(d => d.code === Number(formData.district))?.name
            || addresses.find(a => a.id === editingId)?.district
            || "";

        const wardName =
            wards.find(w => String(w.code) === formData.ward)?.name
            || addresses.find(a => a.id === editingId)?.ward
            || "";


        try {
            setSuccess(
                editingId
                    ? "Cập nhật địa chỉ thành công"
                    : "Thêm địa chỉ thành công"
            );
            setTimeout(() => setSuccess(""), 2000);

            if (formData.isDefault) {
                const updates = addresses.map(addr =>
                    api.updateAddress(addr.id, { isDefault: false })
                );
                await Promise.all(updates);
            }
            // UPDATE
            if (editingId !== null) {
                const updated = await api.updateAddress(editingId, {
                    ...formData,
                    province: provinceName,
                    district: districtName,
                    ward: wardName,
                    userId,
                });

                setAddresses(prev =>
                    prev.map(addr =>
                        addr.id === editingId
                            ? updated
                            : { ...addr, isDefault: false }
                    )
                );
            }
            // ADD
            else {
                const newAddress = await api.addAddress({
                    ...formData,
                    province: provinceName,
                    district: districtName,
                    ward: wardName,
                    userId,
                });
                setAddresses(prev =>
                    formData.isDefault
                        ? prev.map(addr => ({ ...addr, isDefault: false })).concat(newAddress)
                        : [...prev, newAddress]
                );
            }

            //RESET
            setShowForm(false);
            setEditingId(null);
            setFormData({
                receiverName: "",
                phone: "",
                province: "",
                district: "",
                ward: "",
                detail: "",
                isDefault: false,
            });

        } catch (error) {
            console.error("Lỗi lưu địa chỉ:", error);
        }
    };

    const handleEditAddress = async (address: AddressType) => {
        if (provinces.length === 0) {
            console.warn("Provinces chưa load xong");
            return;
        }

        setEditingId(address.id);
        setShowForm(true);

        // === PROVINCE ===
        const provinceObj = provinces.find(
            p => p.name.trim() === address.province.trim()
        );

        if (!provinceObj) {
            console.warn("Không tìm thấy province:", address.province);
            return;
        }

        const provinceCode = provinceObj.code;
        setFormData(prev => ({
            ...prev,
            province: provinceCode,
            district: "",
            ward: ""
        }));

        const districtList = await api.getDistrictsByProvince(provinceCode);
        districtList.sort((a:any, b:any) =>
            a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
        );

        setDistricts(districtList);

        // === DISTRICT ===
        const districtObj = districtList.find(
            (d:any) => d.name.trim() === address.district.trim()
        );

        if (!districtObj) return;

        const districtCode = districtObj.code;

        setFormData(prev => ({
            ...prev,
            district: districtCode
        }));

        const wardList = await api.getWardsByDistrict(districtCode);
        wardList.sort((a:any, b:any) =>
            a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
        );
        setWards(wardList);

        const wardObj = wardList.find(
            (w:any) => w.name.trim() === address.ward.trim()
        );

        setFormData(prev => ({
            ...prev,
            ward: wardObj ? String(wardObj.code) : "",
            receiverName: address.receiverName,
            phone: address.phone,
            detail: address.detail,
            isDefault: address.isDefault
        }));

    };

    const resetForm = async () => {
        if (provinces.length === 0) return;
        const provinceCode = String(provinces[0].code);
        setFormData({ receiverName: "", phone: "", province: provinceCode, district: "", ward: "", detail: "", isDefault: false });

        // Load districts
        const districtList = await api.getDistrictsByProvince(provinceCode);
        const sortedDistricts = districtList.sort((a:any,b:any)=>a.name.localeCompare(b.name,"vi",{sensitivity:"base"}));
        setDistricts(sortedDistricts);

        if (sortedDistricts.length > 0) {
            const wardList = await api.getWardsByDistrict(sortedDistricts[0].code);
            const sortedWards = wardList.sort((a:any,b:any)=>a.name.localeCompare(b.name,"vi",{sensitivity:"base"}));
            setWards(sortedWards);
        }

        setEditingId(null);
    };


    if (loading) return <p>Đang tải địa chỉ...</p>;

    return (
        <>
            <div className="content_address">
                <h2>Địa chỉ của tôi</h2>

                <div className="manage-address">
                    <p>Quản lí địa chỉ để dễ dàng hơn trong việc giao hàng</p>
                    <div
                        className="add-address"
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                    >
                        <i className="fa-solid fa-pen-to-square"></i>
                        <span>Thêm địa chỉ</span>
                    </div>

                </div>

                {addresses.length === 0 && !showForm && (
                    <div className="no-address">
                        <img
                            src="https://cdni.iconscout.com/illustration/premium/thumb/our-address-5482594-4601659.png"
                            alt="Chưa có địa chỉ"
                            className="no-address-img"
                        />
                        <p>Bạn chưa có địa chỉ nào 😅</p>
                        <span>Hãy thêm địa chỉ để thuận tiện giao hàng nhé!</span>
                    </div>
                )}

                {[...addresses]
                    .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
                    .map((address) => (
                        <div className="infor_address" key={address.id}>
                            <div className="infor_address_user">
                                <p>Họ và tên:</p>
                                <span>{address.receiverName}</span>
                                <p>Số điện thoại:</p>
                                <span>{address.phone}</span>

                                {address.isDefault && (
                                    <span className="default-address">
                                    Mặc định
                                </span>
                                )}
                            </div>

                            <div className="infor_address_detail">
                                <p>{address.detail},</p>
                                <p>{address.ward},</p>
                                <p>{address.district},</p>
                                <p>{address.province}</p>
                            </div>

                            <div className="btn_address">
                                <div className="btn_update_address" >
                                    <button onClick={() => handleEditAddress(address)}>
                                        Cập nhật
                                    </button>


                                </div>

                                <div className="btn_delete_address">
                                    <button onClick={() => handleDeleteAddress(address.id)}>
                                        Xóa
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
            </div>

            {showForm && (
                <div className="address-overlay">
                    <form className="address-form" onSubmit={handleSubmit}>
                        <div className={"title-location"}>
                            <h3>{editingId ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}</h3>
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

                        <select
                            value={formData.province}
                            onChange={handleProvinceChange}
                            required
                        >
                            <option value="">-- Chọn Tỉnh / Thành phố --</option>
                            {provinces.map(p => (
                                <option key={p.code} value={p.code}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={formData.district}
                            onChange={handleDistrictChange}
                            required
                        >

                            <option value="">-- Chọn Quận / Huyện --</option>
                            {districts.map(d => (
                                <option key={d.code} value={d.code}>
                                    {d.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={formData.ward}
                            onChange={handleWardChange}
                            required
                        >
                            <option value="">-- Chọn Phường / Xã --</option>
                            {wards.map(w => (
                                <option key={w.code} value={String(w.code)}>
                                    {w.name}
                                </option>
                            ))}
                        </select>

                        <input
                            name="detail"
                            placeholder="Số nhà, tên đường"
                            value={formData.detail}
                            onChange={handleChange}
                            required
                        />

                        <label className="default-checkbox">
                            <input
                                type="checkbox"
                                name="isDefault"
                                checked={formData.isDefault}
                                onChange={handleChange}
                            />
                            Đặt làm địa chỉ mặc định
                        </label>

                        <div className="form-btn">
                            <button type="submit">Lưu</button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    resetForm();
                                }}
                            >
                                Hủy
                            </button>

                        </div>
                    </form>
                </div>
            )}
            {success && (
                <div className={`success-toast ${success.includes("Xóa") ? "delete-toast" : ""}`}>
                    <i className="fa-solid fa-circle-check"></i>
                    {success}
                </div>
            )}
        </>
    );
}

export default Address;

