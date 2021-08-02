import React, { useEffect, useState } from "react";
import { getProductByCategoryAndNum } from "../../../../Redux/ProductRedux/actionProduct";
import { useDispatch } from "react-redux";
import ProductItem from "../ProductItem/ProductItem";
import { v4 as uuid4 } from "uuid";

const ProductRow = ({ num }) => {
    const dispatch = useDispatch();
    const [pros, setPros] = useState([]);

    useEffect(
        () =>
            (async () => {
                const data = await dispatch(getProductByCategoryAndNum(num));
                if (data) setPros(data.pros);
            })(),
        []
    );

    return (
        <>
            <div className="row">
                {pros.length !== 0 &&
                    pros.map((item) => (
                        <div key={uuid4()} className="col l-4 geoto-wrap-item">
                            <ProductItem item={item} />
                        </div>
                    ))}
            </div>
        </>
    );
};

export default ProductRow;
