import React from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';

import Menu from "./pages/menu";
import Order from "./pages/order";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path="/menu" element={<Menu />} />
                <Route path="/order" element={<Order />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;