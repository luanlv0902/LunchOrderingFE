import React, { useContext } from "react";
import {CartContext} from "../components/CartContext";
import { Link } from "react-router-dom";

const Cart: React.FC = () => {
    const { cart, increase, decrease, remove, totalPrice } = useContext(CartContext);

    if (cart.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "40px" }}>
                <h2>Giỏ hàng trống</h2>
                <Link to="/menu">
                    <button className="btn btn-primary mt-3">Quay lại menu</button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2>Giỏ hàng</h2>

            <table className="table table-bordered mt-3">
                <thead>
                <tr>
                    <th>Hình</th>
                    <th>Tên món</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                    <th></th>
                </tr>
                </thead>

                <tbody>
                {cart.map(item => (
                    <tr key={item.id}>
                        <td style={{ width: 100 }}>
                            <img
                                src={item.img}
                                alt={item.name}
                                style={{ width: "80px", borderRadius: 8 }}
                            />
                        </td>

                        <td>{item.name}</td>

                        <td>{item.price.toLocaleString()} đ</td>

                        <td style={{ width: 160 }}>
                            <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => decrease(item.id)}
                            >
                                -
                            </button>

                            <span style={{ padding: "0 10px" }}>
                  {item.quantity}
                </span>

                            <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => increase(item.id)}
                            >
                                +
                            </button>
                        </td>

                        <td>
                            {(item.price * item.quantity).toLocaleString()} đ
                        </td>

                        <td>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => remove(item.id)}
                            >
                                Xóa
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Tổng tiền */}
            <div style={{ textAlign: "right", marginTop: 20 }}>
                <h4>Tổng thanh toán: {totalPrice.toLocaleString()} đ</h4>

                <Link to="/checkout">
                    <button className="btn btn-success mt-2">
                        Tiến hành đặt hàng
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Cart;
