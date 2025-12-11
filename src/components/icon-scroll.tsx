import React from "react";
import {useEffect,useState} from "react";
import {NavLink} from "react-router-dom";

function IconScroll(){
const [appear,setAppearance] = useState<boolean>(false);

function appearArrow(){
    if(window.scrollY > 200){
        setAppearance(true);
    }
    else{
        setAppearance(false);
    }
}
function scrollToTop(){
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
    setAppearance(false);
}

    useEffect(() => {
        appearArrow();
        window.addEventListener("scroll", appearArrow);

        return () => window.removeEventListener("scroll", appearArrow);
    }, []);
    return(
        <div className="scroll">
            <NavLink to="/"
                     className={({ isActive }) =>
                         isActive ? "nav-item active" : "nav-item"
                     }>
                <div className={"icon-home"}
                     style={{
                         opacity: appear ? 1 : 0,
                         transition: "opacity 0.3s ease"
                     }}
                     onClick={scrollToTop}
                >
                    <i className="fa-regular fa-house"></i>
                </div>
            </NavLink>
            <div className={"icon-scroll"}
                 style={{
                     opacity: appear ? 1 : 0,
                     transition: "opacity 0.3s ease"
                 }}
                 onClick={scrollToTop}
            >
                <i className="fa-solid fa-angle-up"></i>
            </div>
        </div>
            )

}

export default IconScroll;