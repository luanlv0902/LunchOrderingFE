import { useState } from "react";


interface Location {
    latitude: number;
    longitude: number;
}

export interface GeoAddress {
    province?: string;
    district?: string;
    ward?: string;
    detail?: string;
}

const GOONG_API_KEY = "gJcwEyP8V249KBJpgMBzTX6Wqu4bJAph1AJmac4C";

export function useGeoLocation() {
    const [location, setLocation] = useState<Location | null>(null);
    const [address, setAddress] = useState<GeoAddress | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError("Trình duyệt không hỗ trợ Geolocation");
            return;
        }

        setLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                await reverseGeocode(latitude, longitude);
                setLoading(false);
            },
            (err) => {
                setLoading(false);
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError("Người dùng từ chối chia sẻ vị trí");
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setError("Không thể lấy vị trí");
                        break;
                    case err.TIMEOUT:
                        setError("Lấy vị trí quá thời gian");
                        break;
                }
            }
        );
    };

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const res = await fetch(
                `https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=${GOONG_API_KEY}`
            );
            const data = await res.json();

            if (data.status !== "OK" || !data.results?.length) {
                throw new Error();
            }

            const r = data.results[0];
            const province = r.compound?.province || "";
            if (!province.toLowerCase().includes("hồ chí minh") &&
                !province.toLowerCase().includes("ho chi minh")) {
                setError("Xin lỗi, hiện chúng tôi chỉ hỗ trợ giao hàng tại TP. Hồ Chí Minh");
                setAddress(null);
                return;
            }

            setAddress({
                detail: r.formatted_address,
                province: province,
                district: r.compound?.district,
                ward: r.compound?.commune,
            });
        } catch {
            setError("Không thể convert tọa độ sang địa chỉ");
        }
    };

    return {
        location,
        address,
        loading,
        error,
        getCurrentLocation,
    };
}
export default useGeoLocation;
