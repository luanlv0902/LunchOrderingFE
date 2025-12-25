import "../../styles/styles.css";
import { useState } from "react";
import { api } from "../../services/api";

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const userId = String(localStorage.getItem("userId"));

    const handleSubmit = async () => {
        setError("");
        setSuccess("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        if (currentPassword  === newPassword  ) {
            setError("Mật khẩu mới giống với mật khẩu hiện tại");
            return;
        }

        try {
            await api.changePassword(userId, currentPassword, newPassword);

            setSuccess("Đổi mật khẩu thành công");

            // reset form
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            setError(err.message || "Đổi mật khẩu thất bại");
        }
    };

    return (
        <div className="change-password-wrapper">
            <h2 className="change-password-title">Đổi mật khẩu</h2>

            <div className="change-password-form">
                <div className="form-row">
                    <label>Mật khẩu hiện tại</label>
                    <div className="password-input">
                        <input
                            type={showCurrent ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <i
                            className={`fa-solid ${showCurrent ? "fa-eye-slash" : "fa-eye"}`}
                            onClick={() => setShowCurrent(!showCurrent)}
                        ></i>
                    </div>
                </div>


                <div className="form-row">
                    <label>Mật khẩu mới</label>
                    <div className="password-input">
                        <input
                            type={showNew ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <i
                            className={`fa-solid ${showNew ? "fa-eye-slash" : "fa-eye"}`}
                            onClick={() => setShowNew(!showNew)}
                        ></i>
                    </div>
                </div>


                <div className="form-row">
                    <label>Nhập lại mật khẩu mới</label>
                    <div className="password-input">
                        <input
                            type={showConfirm ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <i
                            className={`fa-solid ${showConfirm ? "fa-eye-slash" : "fa-eye"}`}
                            onClick={() => setShowConfirm(!showConfirm)}
                        ></i>
                    </div>
                </div>


                <button
                    className="btn-submit-password"
                    onClick={handleSubmit}
                >
                    Xác nhận
                </button>
                {error && <p className="error-text">{error}</p>}
                {success && <p className="success_change">{success}</p>}
            </div>
        </div>
    );
}

export default ChangePassword;
