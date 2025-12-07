import React from "react";

function ItemOrder(){
    return (
      <div className={"item-order"}>
          <img className={"img-order"} alt={"food"} draggable={false}
          onDragStart={(e) => e.preventDefault()}
          src={"https://comnieuthienly.com/_next/image?url=https%3A%2F%2Fhos.comnieuthienly.com%2Fimages%2Fwebp%2F674ac922bdc46c2b04a4dea9.png&w=3840&q=75"}/>
          <div className={"title-food"}>Cơm chiên trứng</div>
          <div className={"title-detail"}>Cơm, trứng, cà rốt, hành lá</div>
          <div className={"price-block"}>
              <div className={"price-order"}>25000đ</div>
              <div className={"quantity-order"}>
                  <button className={"operator"}>-</button>
                  <input className={"quantity"} defaultValue={0}/>
                  <button className={"operator"}>+</button>
              </div>


          </div>
          <button className={"select-food"}>Thêm món</button>
          <div className={"title-detail"}>Ghi chú cho đầu bếp</div>

      </div>
    )
}
export default ItemOrder;