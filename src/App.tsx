import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
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

function App() {
    const location = useLocation();
    const hideLayoutRoutes = ["/login", "/register"];
    const hideLayout = hideLayoutRoutes.includes(location.pathname);

    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/order" element={<Order />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/product/:idProduct" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
            <IconScroll/>
            <Footer />
        </div>
    );
}

export default App;