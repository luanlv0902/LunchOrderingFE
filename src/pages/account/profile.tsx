
import "../../styles/styles.css";
import { useEffect, useState } from "react";
import { api } from "../../services/api";

function Profile() {
    const [showForm, setShowForm] = useState(false);
    const [success, setSuccess] = useState(false);
    const [avatar, setAvatar] = useState<string>("");
    const [info, setInfo] = useState({
        name: "",
        phone: "",
        birthday: "",
        gender: "",
    });

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!userId) return;

        api.getUserById(userId).then((user: any) => {
            setInfo({
                name: user.fullName || "",
                phone: user.phone || "",
                birthday: user.birthday || "",
                gender: user.gender || "",
            });
            setAvatar(user.avatar || "");
        });
    }, [userId]);

    const handleAvatarChange = (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatar(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleChange = (e: any) => {
        setInfo({
            ...info,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!userId) return;

        await api.updateProfile(userId, {
            fullName: info.name,
            phone: info.phone,
            birthday: info.birthday,
            gender: info.gender,
            avatar: avatar,
        });

        const updatedUser = await api.getUserById(userId);
        localStorage.setItem("user", JSON.stringify(updatedUser));


        setShowForm(false);
        setSuccess(true);

        setTimeout(() => setSuccess(false), 3000);
    };


    return (
        <div className="infor_content">
            <h2>Thông tin cá nhân</h2>

            <div className="text_security">
                <p>Quản lí hồ sơ để bảo mật thông tin</p>
                <div
                    className="update_info"
                    onClick={() => setShowForm(!showForm)}
                >
                    <i className="fa-solid fa-pen-to-square"></i>
                    <span>Cập nhật thông tin</span>
                </div>
            </div>

            <div className="infor_account_all">
                <div className="infor_account_left">
                    <div className="img_account_avatar">
                        <img
                            src={
                                avatar ||
                                "https://scr.vn/wp-content/uploads/2020/07/avt-con-trai-ng%E1%BA%A7u-978x1024.jpg"
                            }
                            alt="avatar"
                        />
                    </div>

                    <label className="upload-btn">
                        Chọn ảnh
                        <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
                    </label>

                </div>

                <div className="infor_account_right">
                    <div>
                        <p>Họ tên:</p>
                        <span>{info.name}</span>
                    </div>
                    <div>
                        <p>Số điện thoại:</p>
                        <span>{info.phone}</span>
                    </div>
                    <div>
                        <p>Ngày sinh:</p>
                        <span>
                            {info.birthday
                                ? new Date(info.birthday).toLocaleDateString("vi-VN")
                                : ""}
                        </span>
                    </div>
                    <div>
                        <p>Giới tính:</p>
                        <span>{info.gender}</span>
                    </div>
                </div>
            </div>

            {showForm && (
                <form className="update_form" onSubmit={handleSubmit}>
                    <h3>Cập nhật thông tin</h3>

                    <div>
                        <label>Họ tên</label>
                        <input
                            type="text"
                            name="name"
                            value={info.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Số điện thoại</label>
                        <input
                            type="text"
                            name="phone"
                            value={info.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Ngày sinh</label>
                        <input
                            type="date"
                            name="birthday"
                            value={info.birthday}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Giới tính</label>
                        <select
                            name="gender"
                            value={info.gender}
                            onChange={handleChange}
                        >
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>

                    <div className="form_btn">
                        <button type="submit">Lưu</button>
                        <button type="button" onClick={() => setShowForm(false)}>
                            Hủy
                        </button>
                    </div>

                </form>
            )}
            {success && (
                <div className="success-toast">
                    <i className="fa-solid fa-circle-check"></i>
                    Cập nhật thông tin thành công
                </div>
            )}

        </div>
    );
}

export default Profile;