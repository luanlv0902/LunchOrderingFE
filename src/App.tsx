import React from 'react';
import logo from './logo.svg';
import './App.css';
import Hello from "./components/Hello";
import Menu from "./pages/menu";
import Order from "./pages/order";

function App() {
  return (
    <div className="App">
        {/*<Hello text={'kkkkk'}></Hello>*/}
        {/*<Menu/>*/}
        <Order />
    </div>
  );
}

export default App;
