import React, { useState, useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import Slide from "../utils/Slide/Slide";
import handleNum from "../helpers/handleNum";
import { useSelector, useDispatch } from "react-redux";
import { getProductById } from "../../../Redux/ProductRedux/actionProduct";
import { v4 as uuid4 } from "uuid";
import Loading2 from "../utils/Loading/Loading2";
import { AddToCart } from "../../../Redux/Cart/actionCard";
import NotFound from "../utils/NotFound/NotFound";
import { getProductByCategoryAndNum } from "../../../Redux/ProductRedux/actionProduct";
// import EmptyProductItem from "../utils/ProductItem/EmptyProductItem";
import ProductItemPure from "../utils/ProductItem/ProductItemPure";
import dateFormat from "dateformat";

const Detail = () => {
    const { id: proId } = useParams();
    const { product, isLoad, error } = useSelector(
        (state) => state.productDetail
    );
    const [val, setVal] = useState("");

    const { isAuth, user } = useSelector((state) => state.userAuth);
    const { cart } = useSelector((state) => state.cartReducer);
    // const { proImage } = product ? product : null;

    const dispatch = useDispatch();
    const [slideCol, setSlideCol] = useState(null);
    const [comment, setComment] = useState([
        {
            name: "Lớp trưởng",
            img: "https://res.cloudinary.com/develope-app/image/upload/v1626161751/images_j0qqj4.png",
            comment: "Sản phẩm tốt nhưng shipper hơi hãm xíu? Nhìn chung oki",
            time: "20-6-2021 20:15",
            rate: true,
        },
    ]);

    useEffect(
        () =>
            (async () => {
                const data = await dispatch(getProductByCategoryAndNum(4));
                if (data) setSlideCol(data.pros);
            })(),
        []
    );
    // console.log(slideCol);
    useEffect(() => {
        dispatch(getProductById(proId));
    }, [proId]);

    const [num, setNum] = useState(1);

    const addToCart = async () => {
        if (user) {
            await dispatch(AddToCart(product, num));
        } else {
            alert("You have to login");
        }
    };

    const onModifyNum = (n) => {
        return function () {
            setNum(num + n);
        };
    };
    const onLikeProduct = (e) => {
        e.currentTarget.classList.toggle("product-mark-liked");
    };

    const handleChangeInput = (e) => {
        const text = e.target.value;
        setVal(text);
    };
    const addComment = () => {
        if (!isAuth) {
            alert("You have to login");
        } else {
            let data = {
                name: user.userName,
                img: "https://res.cloudinary.com/develope-app/image/upload/v1626161751/images_j0qqj4.png",
                comment: val,
                time: dateFormat(),
            };
            if (val !== "") {
                setComment([...comment, data]);
                setVal("");
            }
        }
    };
    const [link, setLink] = useState(null);
    const imgRef = React.createRef();
    const handleClickImg = (e) => {
        const itemUrl = e.target.style.backgroundImage;
        const link = itemUrl.match(/http.+(jpg|png)/gi);
        const tar = document.querySelector(".img-zoom-tar");

        tar.src = `${link}`;
        setLink(link);
    };

    const imgZoom = (imgId, resultId) => {
        let img, res, lens, cx, cy;
        img = document.querySelector(imgId);
        res = document.querySelector(resultId);
        lens = document.querySelector(".lens");

        // lens = document.createElement("div");
        // lens.setAttribute("class", "lens");

        img.parentElement.insertBefore(lens, img);

        cx = res.offsetWidth / lens.offsetWidth;
        cy = res.offsetHeight / lens.offsetHeight;

        res.style.backgroundImage = "url('" + img.src + "')";
        res.style.backgroundSize =
            img.width * cx + "px " + img.height * cy + "px";

        img.addEventListener("mousemove", handleMouseMove);
        lens.addEventListener("mousemove", handleMouseMove);

        img.addEventListener("touchmove", handleMouseMove);
        lens.addEventListener("touchmove", handleMouseMove);

        function handleMouseMove(e) {
            let pos, x, y;
            e.preventDefault();
            pos = getCursorPost(e);
            x = pos.x - lens.offsetWidth / 2;
            y = pos.y - lens.offsetHeight / 2;

            if (x > img.width - lens.offsetWidth)
                x = img.width - lens.offsetWidth;

            if (x < 0) x = 0;
            if (y > img.height - lens.offsetHeight)
                y = img.height - lens.offsetHeight;
            if (y < 0) y = 0;

            lens.style.left = x + "px";
            lens.style.top = y + "px";
            res.style.backgroundPosition =
                "-" + x * cx + "px -" + y * cy + "px";
        }

        function getCursorPost(e) {
            let a,
                x = 0,
                y = 0;
            e = e || window.event;
            a = img.getBoundingClientRect();
            x = e.pageX - a.left;
            y = e.pageY - a.top;

            x = x - window.pageXOffset;
            y = y - window.pageYOffset;
            return { x, y };
        }
    };

    const handleZoom = (e) => {
        imgZoom("#img-zoom-tar", ".img-zoom-result");
    };

    if (isLoad) return <Loading2 mid={true} />;

    return (
        <>
            {!isLoad && product ? (
                <div className="product grid wide">
                    <div className="product_info row mt-4 mb-2">
                        <div className="product_info-img col l-4 position-relative">
                            {product.proImage && (
                                <div className="product_info-img-main">
                                    <div className="lens"></div>
                                    <img
                                        src={product.proImage[0].main.url}
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                        }}
                                        ref={imgRef}
                                        alt=""
                                        className="img-zoom-tar"
                                        id="img-zoom-tar"
                                        onMouseOver={handleZoom}
                                    />
                                    <div className="img-zoom-result"></div>
                                </div>
                            )}

                            <div className="product_info_lists">
                                <div className="product_info_list d-flex my-3 justify-content-between mb-1">
                                    {product._id &&
                                        product.proImage[0].imgArr.map(
                                            (item) => (
                                                <div
                                                    key={uuid4()}
                                                    className="list-img-item cursor-pointer"
                                                    style={{
                                                        backgroundImage: `url('${item.url}')`,
                                                    }}
                                                    onClick={handleClickImg}
                                                ></div>
                                            )
                                        )}
                                    {/* <div className="product_info-img-list-item list-group-item border"></div>
                                <div className="product_info-img-list-item list-group-item border"></div>
                                <div className="product_info-img-list-item list-group-item border"></div>
                                <div className="product_info-img-list-item list-group-item border"></div> */}
                                </div>
                                <div className="product_info-img-control text-center">
                                    <span className="img-control-item cursor-pointer border border-2 rounded-circle bg-primary"></span>
                                    <span className="img-control-item cursor-pointer border border-2 me-1 rounded-circle"></span>
                                    <span className="img-control-item cursor-pointer border border-2 me-1 rounded-circle"></span>
                                    <span className="img-control-item cursor-pointer border border-2 me-1 rounded-circle"></span>
                                </div>
                            </div>
                        </div>
                        <div className="product_info-detail col l-8">
                            <h3>{product._id && product.proName}</h3>
                            <div className="detail-info d-flex align-items-center">
                                <div className="detail-info-rate d-flex">
                                    <i className="fas fa-star text-warning"></i>
                                    <i className="fas fa-star text-warning"></i>
                                    <i className="fas fa-star text-warning"></i>
                                    <i className="fas fa-star text-warning"></i>
                                    <i className="fas fa-star text-warning"></i>
                                </div>
                                <Link
                                    to="#"
                                    className="detail-link d-inline-block mx-2"
                                >
                                    <small className="detail-link-text">
                                        <span className="text-decoration-none">
                                            (Xem 23 đánh giá)
                                        </span>
                                    </small>
                                </Link>
                                <small className="span detail-selled text-secondary">
                                    Đã bán 9+
                                </small>
                            </div>
                            <div className="detail-prize d-flex align-items-center">
                                <h2 className="details-prize-now text-danger-80 text-danger">
                                    {product._id &&
                                        handleNum(
                                            Math.ceil(
                                                parseInt(product.proPrize) -
                                                    (parseInt(
                                                        product.proPrize
                                                    ) *
                                                        parseInt(
                                                            product.proPromo
                                                        )) /
                                                        100
                                            )
                                        )}
                                    <span className="under">đ</span>
                                </h2>

                                {product.proPromo !== 0 && (
                                    <>
                                        <div className="details-prize-old text-through mx-3  text-muted">
                                            {product._id &&
                                                handleNum(product.proPrize)}
                                            <span className="under">đ</span>
                                        </div>
                                        <small className="sell bg-danger px-2 text-white rounded font-weight-bold">
                                            -{product._id && product.proPromo}%
                                        </small>
                                    </>
                                )}
                            </div>
                            <div className="details-status">
                                Trạng thái :
                                {product._id && product.proStatus ? (
                                    <span className="text-info ms-2">
                                        Còn hàng
                                    </span>
                                ) : (
                                    <span className="text-info ms-2 text-danger">
                                        Ngừng kinh doanh
                                    </span>
                                )}
                            </div>
                            <div className="detail-cart d-flex align-items-start my-2">
                                <ul className="detail-number pagination mb-0 me-2">
                                    <li
                                        className="page-item"
                                        onClick={onModifyNum(-1)}
                                    >
                                        <button className="page-link ">
                                            <i className="fas fa-minus"></i>
                                        </button>
                                    </li>
                                    <li className="page-item disabled">
                                        <button className="page-link disabled">
                                            {num}
                                        </button>
                                    </li>
                                    <li
                                        className="page-item"
                                        onClick={onModifyNum(1)}
                                    >
                                        <Link to="#" className="page-link">
                                            <i className="fas fa-plus"></i>
                                        </Link>
                                    </li>
                                </ul>
                                <button
                                    className="btn btn-primary ml-3"
                                    onClick={addToCart}
                                >
                                    Thêm Vào Giỏ Hàng
                                </button>
                            </div>
                            <div className="detail-like">
                                <span
                                    className="product-mark-like me-2"
                                    onClick={onLikeProduct}
                                >
                                    {/* product-mark-liked */}
                                    <i className="far fa-heart cursor-pointer"></i>
                                    <i className="fas fa-heart cursor-pointer"></i>
                                </span>
                                <small>Yêu Thích</small>
                            </div>
                            <ul className="detail-share nav d-flex align-items-center">
                                <li className="nav-item">Chia sẻ : </li>
                                <li className="nav-item">
                                    <Link
                                        to="#"
                                        className="nav-link p-2 text-secondary"
                                    >
                                        <i className="fab fa-facebook"></i>
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        to="#"
                                        className="nav-link p-2 text-secondary"
                                    >
                                        <i className="fab fa-twitter-square"></i>
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        to="#"
                                        className="nav-link p-2 text-secondary"
                                    >
                                        <i className="fab fa-instagram"></i>
                                    </Link>
                                </li>
                            </ul>
                            <div className="detail-support d-inline-flex border rounded">
                                <div className="detail-support-item text-center p-2">
                                    <i className="fas fa-shield-alt"></i>
                                    <p className="text-justify">
                                        Hoàn tiền 110% nếu hàng giả
                                    </p>
                                </div>
                                <div className="detail-support-item text-center p-2">
                                    <i className="fas fa-exchange-alt"></i>
                                    <p className="text-justify">
                                        Hoàn tiền 110% nếu hàng giả
                                    </p>
                                </div>
                                <div className="detail-support-item text-center p-2">
                                    <i className="fas fa-exchange-alt"></i>
                                    <p className="text-justify">
                                        Hoàn tiền 110% nếu hàng giả
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="product-react" id="rate">
                        <ul className="nav nav-tabs">
                            <li className="nav-item ">
                                <Link to="#" className="nav-link active">
                                    Chi tiết
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="#" className="nav-link">
                                    Hướng dẫn mua hàng
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="#" className="nav-link">
                                    Hướng dẫn thanh toán
                                </Link>
                            </li>
                        </ul>
                        <div className="product-wrap border border-dark-50 border-top-0 comment info mb-3">
                            {/* //.info to show product-wrap-info */}
                            <div>
                                <h3 className="fs-5 py-2 px-3 mb-0 bg-gray">
                                    Mô tả{" "}
                                </h3>
                                <div className="product-wrap-des mx-4">
                                    <p>-Quần dai ống dộng</p>
                                    <p>-chất liệu bền</p>
                                    <p>-Quần dai ống dộng</p>
                                </div>
                            </div>
                            <h3 className="fs-5 py-2 px-3 mb-0 bg-gray mt-2">
                                Thông tin thêm
                            </h3>

                            <table className="table-info ms-4">
                                <tbody>
                                    <tr>
                                        <th width="25%">Thương hiệu</th>
                                        <th width="75%">HaloKaSi</th>
                                    </tr>
                                    <tr>
                                        <th width="25%">Xuất xứ</th>
                                        <th width="75%">Nhật Bản</th>
                                    </tr>
                                    <tr>
                                        <th width="25%">Kích thước</th>
                                        <th width="75%">50kg-75kg</th>
                                    </tr>
                                    <tr>
                                        <th width="25%">Chất liệu</th>
                                        <th width="75%">
                                            Vải collaption mềm mỏng thoáng mát
                                        </th>
                                    </tr>
                                    <tr>
                                        <th width="25%">Bảo quản</th>
                                        <th width="75%">
                                            Bảo quản nơi khô ráo tránh ánh nắng
                                            mặt trời, mặt trăng
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="rate-comment row">
                            <div className="rate-comment-main col l-10 mt-3">
                                <h3 className="text-secondary mb-3">
                                    Đánh giá sản phẩm
                                </h3>
                                <div className="product-wrap-comment row no-gutters">
                                    <div className="product-wrap-detail d-flex align-items-center justify-content-center bg-light col l-3">
                                        <h2 className="text-dark p-2 display-3">
                                            4.5
                                        </h2>
                                        <div className="product-list-rate">
                                            <div className="d-flex">
                                                <i className="fas fa-star text-warning"></i>
                                                <i className="fas fa-star text-warning"></i>
                                                <i className="fas fa-star text-warning"></i>
                                                <i className="fas fa-star text-warning"></i>
                                                <i className="fas fa-star text-warning"></i>
                                            </div>
                                            <small className="text-secondary ">
                                                56 nhận xét
                                            </small>
                                        </div>
                                    </div>
                                    <div className="product-wrap-rate col l-5">
                                        <div className="list-group-item-wrap d-flex align-items-center py-1">
                                            <h5
                                                className="product-list-rate-text d-block px-3 
                                        font-weight-bold

                                        "
                                            >
                                                1 sao
                                            </h5>
                                            <div
                                                className="progress flex-fill"
                                                style={{ height: "10px" }}
                                            >
                                                <div
                                                    className="progress-bar bg-danger h-100"
                                                    style={{ width: "40%" }}
                                                ></div>
                                            </div>
                                            <span className="text-title px-2">
                                                40{" "}
                                                <Link to="#" className="small">
                                                    (xem nhận xét)
                                                </Link>
                                            </span>
                                        </div>
                                        <div className="list-group-item-wrap d-flex align-items-center py-1">
                                            <h5
                                                className="product-list-rate-text d-block px-3 
                                            font-weight-bold

                                        "
                                            >
                                                2 sao
                                            </h5>
                                            <div
                                                className="progress flex-fill"
                                                style={{ height: "10px" }}
                                            >
                                                <div
                                                    className="progress-bar bg-danger h-100"
                                                    style={{ width: "40%" }}
                                                ></div>
                                            </div>
                                            <span className="text-title px-2">
                                                40{" "}
                                                <Link to="#" className="small">
                                                    (xem nhận xét)
                                                </Link>
                                            </span>
                                        </div>
                                        <div className="list-group-item-wrap d-flex align-items-center py-1">
                                            <h5
                                                className="product-list-rate-text d-block px-3 
                                            font-weight-bold

                                        "
                                            >
                                                3 sao
                                            </h5>
                                            <div
                                                className="progress flex-fill"
                                                style={{ height: "10px" }}
                                            >
                                                <div
                                                    className="progress-bar bg-danger h-100"
                                                    style={{ width: "10%" }}
                                                ></div>
                                            </div>
                                            <span className="text-title px-2">
                                                40{" "}
                                                <Link to="#" className="small">
                                                    (xem nhận xét)
                                                </Link>
                                            </span>
                                        </div>
                                        <div className="list-group-item-wrap d-flex align-items-center py-1">
                                            <h5
                                                className="product-list-rate-text d-block px-3 
                                        font-weight-bold

                                        "
                                            >
                                                4 sao
                                            </h5>
                                            <div
                                                className="progress flex-fill"
                                                style={{ height: "10px" }}
                                            >
                                                <div
                                                    className="progress-bar bg-danger h-100"
                                                    style={{ width: "70%" }}
                                                ></div>
                                            </div>
                                            <span className="text-title px-2">
                                                60{" "}
                                                <Link to="#" className="small">
                                                    (xem nhận xét)
                                                </Link>
                                            </span>
                                        </div>
                                        <div className="list-group-item-wrap d-flex align-items-center py-1">
                                            <h5
                                                className="product-list-rate-text d-block px-3 
                                            font-weight-bold

                                        "
                                            >
                                                5 sao
                                            </h5>
                                            <div
                                                className="progress flex-fill"
                                                style={{ height: "10px" }}
                                            >
                                                <div
                                                    className="progress-bar bg-danger h-100"
                                                    style={{ width: "80%" }}
                                                ></div>
                                            </div>
                                            <span className="text-title px-2">
                                                40{" "}
                                                <Link to="#" className="small">
                                                    (xem nhận xét)
                                                </Link>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="go-to-comment col l-4">
                                        <div
                                            className="btn btn-primary translate-middle position-relative top-50 left-mid"
                                            style={{ left: "50%" }}
                                        >
                                            Add your comment
                                        </div>
                                    </div>
                                </div>

                                <div className="product-wrap-comment-user l-12 list-group list-group-flush">
                                    {comment &&
                                        comment.map((item) => (
                                            <div
                                                className="user-comment list-group-item d-flex py-3"
                                                key={uuid4()}
                                            >
                                                <div
                                                    className="user-comment-name me-2 mt-1 border border-light "
                                                    style={{
                                                        background: `url('${item.img}')`,
                                                    }}
                                                ></div>
                                                <div className="user-commnet-text text-break flex-fill d-flex flex-column">
                                                    <h5 className="user-name mb-0 fs-6 fs-6">
                                                        {item.name}
                                                    </h5>
                                                    {item.rate && (
                                                        <div className="detail-info-rate detail-info-rate-comment d-flex mt-1 mb-2">
                                                            <i className="fas fa-star text-warning"></i>
                                                            <i className="fas fa-star text-warning"></i>
                                                            <i className="fas fa-star text-warning"></i>
                                                            <i className="fas fa-star text-warning"></i>
                                                            <i className="fas fa-star text-warning"></i>
                                                        </div>
                                                    )}
                                                    {!item.rate && (
                                                        <div className="detail-info-rate detail-info-rate-comment d-flex mt-1 mb-2"></div>
                                                    )}
                                                    <span className="fs-5">
                                                        {item.comment}
                                                    </span>
                                                    <span className="text-secondary small mt-2">
                                                        {item.time}
                                                    </span>
                                                    <div className="user-react d-flex align-items-center">
                                                        <span className="user-liked cursor-pointer ">
                                                            <i className="far fa-thumbs-up me-2"></i>
                                                            40 Hữu ích?
                                                        </span>
                                                        {/* <span className="user-disliked cursor-pointer d-inline-block mx-2">
                                                    <i className="far fa-thumbs-down"></i>
                                                    31
                                                </span>
                                                <span className="user-response cursor-pointer">
                                                    <i className="far fa-comment-dots"></i>
                                                    2
                                                </span> */}
                                                        <form className="form d-none">
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                name="comment"
                                                                placeholder="Comment here..."
                                                            />
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    <div className="add-cmt">
                                        <textarea
                                            id="w3review"
                                            name="w3review"
                                            rows="4"
                                            cols="50"
                                            placeholder="Thêm bình luận của bạn..."
                                            onChange={handleChangeInput}
                                            value={val}
                                        ></textarea>
                                        <button
                                            type="button"
                                            className="bnt btn-primary btn-sm float-end px-3 cursor-pointer"
                                            onClick={addComment}
                                        >
                                            Gửi
                                        </button>
                                    </div>
                                </div>
                                <Slide
                                    title="Sản phẩm liên quan"
                                    type="relative"
                                    num="10"
                                />
                            </div>
                            <div className="rate-recomment col l-2 d-flex flex-column">
                                <h3 className="text-secondary small">
                                    Sản phẩm bán chạy
                                </h3>
                                {slideCol &&
                                    slideCol.length !== 0 &&
                                    slideCol.map((item) => (
                                        <div className="pro-col" key={uuid4()}>
                                            <ProductItemPure item={item} />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <NotFound type="404" />
            )}
        </>
    );
};

export default Detail;
