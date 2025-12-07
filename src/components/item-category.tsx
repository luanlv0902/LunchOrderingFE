import React from "react";
import "../styles/styles.css"

function Category() {
    return (

        <div className="category-item">
            <img className={"img-category"} draggable={false}
            onDragStart={(e) => e.preventDefault()}
            src="https://comnieuthienly.com/_next/image?url=https%3A%2F%2Fhos.comnieuthienly.com%2Fimages%2Fwebp%2F674ac922bdc46c2b04a4dea9.png&w=3840&q=75"
                 alt="food"/>
            <div className={"title-food"}>Món cơm</div>
        </div>
    )
}
export default Category