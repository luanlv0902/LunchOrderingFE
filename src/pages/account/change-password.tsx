import "../../styles/styles.css";
import { useState } from "react";

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <div className="change-password-wrapper">
            <h2 className="change-password-title">Đổi mật khẩu</h2>

            <div className="change-password-form">
                <div className="form-row">
                    <label>Mật khẩu hiện tại</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>

                <div className="form-row">
                    <label>Mật khẩu mới</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <div className="form-row">
                    <label>Nhập lại mật khẩu mới</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button className="btn-submit-password">
                    Xác nhận
                </button>
            </div>
        </div>
    );
}

export default ChangePassword;
