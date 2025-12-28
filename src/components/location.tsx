import React, { useState } from "react";

interface Location {
    latitude: number;
    longitude: number;
}

interface Address {
    displayName: string;
    province?: string;
    district?: string;
    ward?: string;
}

const GetCurrentLocation: React.FC = () => {
    const [location, setLocation] = useState<Location | null>(null);
    const [address, setAddress] = useState<Address | null>(null);
    const [error, setError] = useState<string>("");
    const apiKey="2ad3d2552f3a4f5288aeddb9f3016298"

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError("Trình duyệt không hỗ trợ Geolocation.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });

                await reverseGeocode(latitude, longitude);
            },
            (err) => {
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError("Người dùng từ chối chia sẻ vị trí.");
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setError("Không thể lấy vị trí.");
                        break;
                    case err.TIMEOUT:
                        setError("Yêu cầu lấy vị trí bị timeout.");
                        break;
                    default:
                        setError("Lỗi không xác định.");
                }
            }
        );
    };

    const reverseGeocode = async (lat: number, lon: number) => {
        try {
            const res = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}&pretty=1&no_annotations=1&language=vi`
            );
            const data = await res.json();

            setAddress({
                displayName: data.display_name,
                province: data.address.state,
                district: data.address.county || data.address.city_district,
                ward: data.address.suburb || data.address.village
            });
        } catch (e) {
            setError("Không thể convert tọa độ sang địa chỉ.");
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <h3>Lấy vị trí hiện tại</h3>

            <button onClick={getCurrentLocation}>📍 Lấy vị trí</button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {location && (
                <div style={{ marginTop: 12 }}>
                    <p><b>Latitude:</b> {location.latitude}</p>
                    <p><b>Longitude:</b> {location.longitude}</p>
                </div>
            )}

            {address && (
                <div style={{ marginTop: 12 }}>
                    <p><b>Địa chỉ đầy đủ:</b> {address.displayName}</p>
                    <p><b>Tỉnh / Thành:</b> {address.province}</p>
                    <p><b>Quận / Huyện:</b> {address.district}</p>
                    <p><b>Phường / Xã:</b> {address.ward}</p>
                </div>
            )}
        </div>
    );
};

export default GetCurrentLocation;
