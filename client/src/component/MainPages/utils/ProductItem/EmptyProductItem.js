import React from "react";
import { Link } from "react-router-dom";

const ProductItem = () => {
    let style = {
        height: "17px",
    };
    // #f6f1f1;
    return (
        // <div className="col l-3">
        <Link to={`#`} className="text-decoration-none">
            <div className=" list-produce-item-ept">
                <div className="produce-item-img "></div>
                <div className="produce-item-name mt-2" style={style}></div>
                <div
                    className="
                        produce-item-rate
                        w-50
                    
                        my-2
                    "
                    style={style}
                ></div>
                <div className="produce-item-prize mb-2" style={style}></div>
            </div>
        </Link>
        // </div>
    );
};

export default ProductItem;
