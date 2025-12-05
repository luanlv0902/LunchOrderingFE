import React from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';

import Menu from "./pages/menu";
import Order from "./pages/order";
import Header from "./components/Header";

function App() {
    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path="/menu" element={<Menu />} />
                <Route path="/order" element={<Order />} />
            </Routes>
        </div>
    );
}

export default App;