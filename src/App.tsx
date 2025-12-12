import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Home from "./pages/home";
import Menu from "./pages/menu";
import Order from "./pages/order";
import Contact from "./pages/contact";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                {/*<Route path="/home" element={<Home />} />*/}
                <Route path="/menu" element={<Menu />} />
                <Route path="/order" element={<Order />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;