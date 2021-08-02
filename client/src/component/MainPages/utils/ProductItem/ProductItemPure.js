import React from "react";
import { Link } from "react-router-dom";
import handleNum from "../../helpers/handleNum";

const ProductItemPure = ({ item }) => {
    // const history = useHistory();

    // const handleLInk = (e) => {
    //     e.preventDefault();
    //     if (e.target.className.includes("far fa-heart")) setHeart(1);
    //     else if (e.target.className.includes("fas fa-heart")) setHeart(0);
    //     else {
    //         history.push(`/product/${item._id}`);
    //     }
    // };
    return (
        <Link
            to={`/product/${item._id}`}
            className="text-decoration-none"
            // onClick={handleLInk}
        >
            <div className="list-produce-item">
                <div
                    className="produce-item-img"
                    style={{
                        backgroundImage: `url('${item.proImage[0].main.url}')`,
                    }}
                ></div>
                <p className="produce-item-name">{item.proName}</p>

                <div className="produce-item-prize">
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

                {/* <span className="produce-item-sal">{item.proPromo}%</span>
                <p className="produce-item-like">
                    <i className="fas fa-check"></i>
                    <span className="produce-item-text">Yêu Thích</span>
                </p> */}
            </div>
        </Link>
    );
};

export default ProductItemPure;
