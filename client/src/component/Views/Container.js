import React, { useEffect, useLayoutEffect } from "react";
import Carousel from "../MainPages/utils/Carousel";
import ProductItem from "../MainPages/utils/ProductItem/ProductItem";
import { v4 as uuidv4 } from "uuid";
import Slide from "../MainPages/utils/Slide/Slide";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from "../../Redux/ProductRedux/actionProduct";
import ProductRow from "../MainPages/utils/ProductRow/ProductRow";
import axios from "axios";
import EmptyProductItem from "../MainPages/utils/ProductItem/EmptyProductItem";
import CarouselEmpty from "../MainPages/utils/CarouselEmpty";
import NotFound from "../MainPages/utils/NotFound/NotFound";

const Container = () => {
    const dispatch = useDispatch();

    const { isLoad, products, error } = useSelector((state) => state.products);
    const { user, isAuth } = useSelector((state) => state.userAuth);
    useLayoutEffect(() => {
        dispatch(getAllProduct());
    }, [dispatch]);

    useEffect(
        () =>
            setInterval(
                () =>
                    (async () => {
                        if (isAuth) {
                            const token = localStorage["ACCESSTOKEN"];
                            const data = await axios.get(
                                "http://localhost:5000/user/refresh_token",
                                {
                                    withCredentials: true,
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );
                            console.log(data);
                        }
                    })(),
                2 * 60 * 50 * 1000
            ),
        [isAuth]
    );

    return (
        <>
            {error && <NotFound />}
            {!error && (
                <div className="container-content mt-3">
                    <div className="grid wide">
                        <div className="row container-wrap">
                            <div className="col l-8">
                                {products.length !== 0 && <Carousel />}

                                {products.length === 0 && <CarouselEmpty />}
                            </div>
                            <div className="col l-4">
                                <div className="wrap-slide-item">
                                    <img
                                        src="./public/img/24.jpg"
                                        alt="sieusale"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row container-mid">
                            <div className="col l-3">
                                <ul className="mid-list">
                                    <li className="mid-list-item fs-5">
                                        Danh Mục Sản Phẩm
                                    </li>
                                    <li className="mid-list-item cursor-pointer">
                                        Sản Phẩm Mới
                                    </li>
                                    <li className="mid-list-item cursor-pointer">
                                        Sản Phẩm Bán Chạy
                                    </li>
                                    <li className="mid-list-item cursor-pointer">
                                        Thời Trang Nam Nữ
                                    </li>
                                    <li className="mid-list-item cursor-pointer">
                                        Phụ Kiện Nam Nữ
                                    </li>
                                </ul>
                            </div>
                            <div className="col mid-produce l-9">
                                <div className="mid-produce-wrap">
                                    <span className="produce-wrap-title fs-5">
                                        Sản Phẩm mới
                                    </span>
                                    {/* <div className="produce-wrap-list">
                                    <span className="produce-wrap-list-item">
                                        Giá
                                    </span>
                                    <i
                                        className="
                                            produce-wrap-list-icon
                                            fas
                                            fa-angle-down
                                        "
                                    ></i>
                                </div> */}
                                </div>
                                <div className="list-produce row">
                                    {products.length !== 0 &&
                                        products.map((item) => (
                                            <div
                                                className="col l-3"
                                                key={uuidv4()}
                                            >
                                                <ProductItem item={item} />
                                            </div>
                                        ))}
                                    {products.length === 0 &&
                                        Array.from(Array(12)).map((item) => (
                                            <div
                                                className="col l-3"
                                                key={uuidv4()}
                                            >
                                                <EmptyProductItem />
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                        <div className="row container-bright">
                            <div className="col l-4">
                                <div className="bright-wrap">
                                    <i
                                        className="
                                        bright-icon
                                        fs-3
                                        fas
                                        fa-shipping-fast
                                    "
                                    ></i>
                                    <div className="bright-content">
                                        <h3 className="bright-title fs-5">
                                            Miễn Phí Vận Chuyển
                                        </h3>
                                        <span className="bright-text">
                                            Miễn phí vận chuyển cho tât cả đơn
                                            hàng trên 150000d
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col l-4">
                                <div className="bright-wrap">
                                    <i
                                        className="
                                        bright-icon
                                        fs-3
                                        fas fa-exchange-alt
                                    "
                                    ></i>
                                    <div className="bright-content">
                                        <h3 className="bright-title fs-5">
                                            Trả Hàng Miễn Phí
                                        </h3>
                                        <span className="bright-text">
                                            Trả hàng miễn phí trong vòng 7 ngày
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col l-4">
                                <div className="bright-wrap">
                                    <i
                                        className="
                                        bright-icon
                                        fs-3
                                        fas fa-headset
                                    "
                                    ></i>
                                    <div className="bright-content">
                                        <h3 className="bright-title fs-5">
                                            Hỗ trợ 24/7
                                        </h3>
                                        <span className="bright-text">
                                            Liên hệ với chúng tôi 24h mỗi ngày
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Slide title="Sản phẩm nổi bật" type="saled" num="10" />

                        <div className="col l-12 geoto">
                            <div className="geoto-header">
                                <h2 className="geoto-header-title fs-5">
                                    Phụ Kiện Nam Nữ
                                </h2>
                                <span className="geoto-header-item">
                                    Thời Trang Nam
                                </span>
                                <span className="geoto-header-item">
                                    Thời Trang Nữ
                                </span>
                            </div>
                        </div>
                        <div className="geoto-content row">
                            <div
                                className="geoto-wrap-img col l-3"
                                style={{
                                    backgroundImage:
                                        "url('./public/img/a1.jpg')",
                                }}
                            ></div>
                            <div className="geoto-wrap col l-9">
                                <ProductRow num="6" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Container;
