import React from "react";
export function formatPrice(price:number) {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}