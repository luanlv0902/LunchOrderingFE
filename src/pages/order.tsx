import React from "react";
import "../styles/styles.css"
function Order(){
    return (
        <>
            <h1>ĐẶT HÀNG</h1>
            <div className={"order"}>
                <div className={"container-order-1"}>
                    <div className={"filter-order"}>
                        <input type="text" placeholder={"Tìm kiếm"} className={"search-order"}/>
                        <div className={"title-sort"}>Sắp xếp theo</div>
                        <select name="sort" id="sortOrder" className={"sort-order"}>
                            <option >Mặc định</option>
                            <option>Giá tăng dần</option>
                            <option>Giá giảm dần</option>
                        </select>
                    </div>

                    <div className={"category-order"}>
                        <div className={"title-category"}>FOOD MENU</div>

                        <div className={"list-item-order"}>
                            <div className="category-item">
                                <img className={"img-category"} src="https://comnieuthienly.com/_next/image?url=https%3A%2F%2Fhos.comnieuthienly.com%2Fimages%2Fwebp%2F674ac922bdc46c2b04a4dea9.png&w=3840&q=75" alt="food"/>
                                <div className={"title-food"}>Cơm chiên trứng</div>
                            </div>
                            <div className="category-item">
                                <img className={"img-category"} src="https://comnieuthienly.com/_next/image?url=https%3A%2F%2Fhos.comnieuthienly.com%2Fimages%2Fwebp%2F674ac922bdc46c2b04a4dea9.png&w=3840&q=75" alt="food"/>
                                <div className={"title-food"}>Cơm chiên trứng</div>
                            </div>
                            <div className="category-item">
                                <img className={"img-category"} src="https://comnieuthienly.com/_next/image?url=https%3A%2F%2Fhos.comnieuthienly.com%2Fimages%2Fwebp%2F674ac922bdc46c2b04a4dea9.png&w=3840&q=75" alt="food"/>
                                <div className={"title-food"}>Cơm chiên trứng</div>
                            </div>
                            <div className="category-item">
                                <img className={"img-category"} src="https://comnieuthienly.com/_next/image?url=https%3A%2F%2Fhos.comnieuthienly.com%2Fimages%2Fwebp%2F674ac922bdc46c2b04a4dea9.png&w=3840&q=75" alt="food"/>
                                <div className={"title-food"}>Cơm chiên trứng</div>
                            </div>
                            <div className="category-item">
                                <img className={"img-category"} src="https://comnieuthienly.com/_next/image?url=https%3A%2F%2Fhos.comnieuthienly.com%2Fimages%2Fwebp%2F674ac922bdc46c2b04a4dea9.png&w=3840&q=75" alt="food"/>
                                <div className={"title-food"}>Cơm chiên trứng</div>
                            </div>
                            <div className="category-item">
                                <img className={"img-category"} src="https://comnieuthienly.com/_next/image?url=https%3A%2F%2Fhos.comnieuthienly.com%2Fimages%2Fwebp%2F674ac922bdc46c2b04a4dea9.png&w=3840&q=75" alt="food"/>
                                <div className={"title-food"}>Cơm chiên trứng</div>
                            </div>
                            <div className="category-item">
                                <img className={"img-category"} src="https://comnieuthienly.com/_next/image?url=https%3A%2F%2Fhos.comnieuthienly.com%2Fimages%2Fwebp%2F674ac922bdc46c2b04a4dea9.png&w=3840&q=75" alt="food"/>
                                <div className={"title-food"}>Cơm chiên trứng</div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className={"container-order-2"}>

                </div>
            </div>
        </>
    )
}
export default Order;