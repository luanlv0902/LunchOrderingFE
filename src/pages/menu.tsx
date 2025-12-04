import React  from "react";
import "../styles/styles.css"
import Item from "../components/item-menu";
import ItemMenu from "../components/item-menu";
function Menu(){
    return (
        <>
            <div className={"container-menu"}>
                <div className={"header-menu"}>
                    <h1 >ALL MENUS</h1>
                    <div className={"menu"}>
                        <h3 className={"menu-item active"}>MÓN CƠM</h3>
                        <div className={"col"}></div>
                        <h3 className={"menu-item"}>MÓN CHAY</h3>
                        <div className={"col"}></div>
                        <h3 className={"menu-item"}>MÓN CÁ</h3>
                        <div className={"col"}></div>
                        <h3 className={"menu-item"}>MÓN THỊT</h3>
                        <div className={"col"}></div>
                        <h3 className={"menu-item"}>MÓN RAU</h3>
                        <div className={"col"}></div>
                        <h3 className={"menu-item"}>MÓN CANH</h3>
                        <div className={"col"}></div>
                        <h3 className={"menu-item"}>MÓN ĐẶC BIỆT</h3>
                        <div className={"col"}></div>
                        <h3 className={"menu-item"}>MÓN TRÁNG MIỆNG</h3>



                    </div>
                </div>
                <div className={"list-item-menu"}>
                    <ItemMenu/><ItemMenu/>
                    <ItemMenu/><ItemMenu/>
                    <ItemMenu/><ItemMenu/>
                    <ItemMenu/><ItemMenu/>





                </div>
            </div>



        </>
    )
}

export default Menu