import React, { useRef, useEffect, useState } from "react";
import { v4 as uuid4 } from "uuid";
import ProductItem from "../ProductItem/ProductItem";
import { useDispatch } from "react-redux";
import { getProductByCategoryAndNum } from "../../../../Redux/ProductRedux/actionProduct";
import EmptyProductItem from "../ProductItem/EmptyProductItem";

const Slide = ({ title, type, num }) => {
    const main = useRef();
    // const { isLoad, error, products } = useSelector((state) => state.products);
    // const dispatch = useDispatch();
    // useEffect(() => {
    //     dispatch(getAllProduct());
    // });

    const [products, setProducts] = useState([]);
    const dispatch = useDispatch();

    useEffect(
        () =>
            (async () => {
                const data = await dispatch(getProductByCategoryAndNum(num));
                if (data) setProducts(data.pros);
            })(),
        [type]
    );
    // useEffect(
    //     () =>
    //         (async () => {
    //             const { data } = await axios.get(
    //                 `${SERVER}/api/slide?type=${type}`
    //             );
    //             setProducts(data.pros);
    //         })(),
    //     [type]
    // );

    const controlSlideNext = () => {
        const slide = main.current;

        // x += n;
        slide.scrollLeft += slide.offsetWidth;
        if (slide.scrollLeft >= slide.scrollWidth - slide.offsetWidth)
            slide.scrollLeft = 0;
    };
    const controlSlidePre = () => {
        const slide = main.current;

        // x += n;
        slide.scrollLeft -= slide.offsetWidth;
        if (slide.scrollLeft <= 0) slide.scrollLeft = slide.scrollWidth;
    };

    return (
        <>
            <h3 className="prod-outsd-title fs-5 mb-1">{title}</h3>
            <div className="pro-outsd-slide-control position-relative">
                <i
                    className="
                                pro-outsd-icon pro-outsd-icon-left
                                fas
                                fa-arrow-left
                            "
                    onClick={controlSlideNext}
                ></i>
                <i
                    className="
                                pro-outsd-icon pro-outsd-icon-right
                                fas
                                fa-arrow-right
                            "
                    onClick={controlSlidePre}
                ></i>
                <div
                    className="main-slide overflow-hidden pt-2"
                    ref={main}
                    style={{
                        transition: "all .2s linear",
                    }}
                >
                    <div className="row pro-outsd flex-nowrap">
                        {products.length !== 0 &&
                            products.map((item) => (
                                <div className="col l-2-5" key={uuid4()}>
                                    <ProductItem item={item} />
                                </div>
                            ))}
                        {products.length === 0 &&
                            Array.from(Array(5)).map((item) => (
                                <div className="col l-2-5" key={uuid4()}>
                                    <EmptyProductItem />
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Slide;
