import React from "react";
import { Link, useHistory } from "react-router-dom";
import handleNum from "../../helpers/handleNum";

const ProductItem = ({ item }) => {
    const [heart, setHeart] = React.useState(0);
    const history = useHistory();

    const handleLInk = (e) => {
        e.preventDefault();
        if (e.target.className.includes("far fa-heart")) setHeart(1);
        else if (e.target.className.includes("fas fa-heart")) setHeart(0);
        else {
            history.push(`/product/${item._id}`);
        }
    };

    return (
        // <div className="col l-3">
        <Link
            to={`/product/${item._id}`}
            className="text-decoration-none"
            onClick={handleLInk}
        >
            <div className="list-produce-item">
                <div
                    className="produce-item-img"
                    style={{
                        backgroundImage: `url('${item.proImage[0].main.url}')`,
                    }}
                ></div>
                <p className="produce-item-name">{item.proName}</p>
                <div
                    className="
                        produce-item-rate
                        produce-item-rate-half
                    "
                >
                    <i className="rate-icon fas fa-star"></i>
                    <i className="rate-icon fas fa-star"></i>
                    <i className="rate-icon fas fa-star"></i>
                    <i className="rate-icon fas fa-star"></i>
                    <i
                        className="
                            rate-icon
                            fas
                            fa-star-half-alt
                        "
                    ></i>
                    <i className="rate-icon far fa-star"></i>
                </div>
                <div className="produce-item-prize">
                    {item.proPromo !== 0 && (
                        <p className="prize-old">
                            {handleNum(item.proPrize)}
                            <span className="prize-underline">đ</span>
                        </p>
                    )}
                    <p className="prize-new">
                        {handleNum(
                            Math.ceil(
                                parseInt(item.proPrize) -
                                    (parseInt(item.proPrize) *
                                        parseInt(item.proPromo)) /
                                        100
                            )
                        )}
                        <span className="prize-underline">đ</span>
                    </p>
                </div>
                <div className="product-mark d-flex justify-content-between mb-2">
                    {heart === 0 && (
                        <span className="product-mark-like">
                            {/* product-mark-liked */}
                            <i className="far fa-heart cursor-pointer"></i>
                            <i className="fas fa-heart cursor-pointer"></i>
                        </span>
                    )}
                    {heart === 1 && (
                        <span className="product-mark-like product-mark-liked">
                            {/* product-mark-liked */}
                            <i className="far fa-heart cursor-pointer"></i>
                            <i className="fas fa-heart cursor-pointer"></i>
                        </span>
                    )}
                    <span className="produce-item-saled">
                        Đã bán {item.proSaled ? item.proSaled : 30}
                    </span>
                </div>
                {item.proPromo !== 0 && (
                    <span className="produce-item-sal">{item.proPromo}%</span>
                )}
                <p className="produce-item-like">
                    <i className="fas fa-check"></i>
                    <span className="produce-item-text">Yêu Thích</span>
                </p>
            </div>
        </Link>
        // </div>
    );
};

export default ProductItem;
