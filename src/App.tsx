import React from "react";
import {Routes, Route, useLocation, Navigate} from "react-router-dom";
import "./App.css";

import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Menu from "./pages/menu";
import Order from "./pages/order";
import Contact from "./pages/contact";
import Header from "./components/Header";
import Footer from "./components/Footer";
import IconScroll from "./components/icon-scroll";
import ProductDetail from "./components/productDetail";
import Cart from "./pages/cart";

import AccountLayout from "./components/AccountLayout";
import Profile from "./pages/account/profile";
import Address from "./pages/account/address";
import ChangePassword from "./pages/account/change-password";
import Voucher from "./pages/account/voucher";
import OrderHistory from "./pages/account/order-history";

function App() {
    const location = useLocation();
    const hideLayoutRoutes = ["/login", "/register"];
    const hideLayout = hideLayoutRoutes.includes(location.pathname);

    return (
        <div className="App">
            <Header/>
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace/>}/>
                <Route path="/home" element={<Home/>}/>
                <Route path="/menu" element={<Menu/>}/>
                <Route path="/order" element={<Order/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/cart" element={<Cart/>}/>
                <Route path="/product/:idProduct" element={<ProductDetail/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>

                {/* ===== ACCOUNT ROUTES ===== */}
                <Route path="/account" element={<AccountLayout/>}>
                    <Route index element={<Profile/>}/>
                    <Route path="profile" element={<Profile/>}/>
                    <Route path="address" element={<Address/>}/>
                    <Route path="change-password" element={<ChangePassword/>}/>
                    <Route path="voucher" element={<Voucher/>}/>
                    <Route path="order-history" element={<OrderHistory/>}/>
                </Route>
            </Routes>
            <IconScroll/>
            <Footer/>
        </div>
    );
}

export default App;