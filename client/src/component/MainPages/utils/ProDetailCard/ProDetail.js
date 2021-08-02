import React from "react";

const ProDetail = ({ product }) => {
    console.log(product);
    return (
        <>
            <div className="product_info-img col l-4">
                <div
                    className="product_info-img-main"
                    style={{
                        backgroundImage: `${product.proImage[0].main.url}`,
                    }}
                ></div>
                <div className="product_info_lists">
                    <div className="product_info_list d-flex my-3 justify-content-between mb-1">
                        <div className="product_info-img-list-item list-group-item border"></div>
                        <div className="product_info-img-list-item list-group-item border"></div>
                        <div className="product_info-img-list-item list-group-item border"></div>
                        <div className="product_info-img-list-item list-group-item border"></div>
                    </div>
                    <div className="product_info-img-control text-center">
                        <span className="img-control-item cursor-pointer border border-2 rounded-circle bg-primary"></span>
                        <span className="img-control-item cursor-pointer border border-2 me-1 rounded-circle"></span>
                        <span className="img-control-item cursor-pointer border border-2 me-1 rounded-circle"></span>
                        <span className="img-control-item cursor-pointer border border-2 me-1 rounded-circle"></span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProDetail;
