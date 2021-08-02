import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import handleNum from "../helpers/handleNum";
import Slide from "../utils/Slide/Slide";
import { useDispatch, useSelector } from "react-redux";
import { SingleDeleteCart } from "../../../Redux/Cart/actionCard";
import { postCart } from "../../../Redux/Cart/actionCard";
import Loading2 from "../utils/Loading/Loading2";
import NotFound from "../utils/NotFound/NotFound";

const Cart = () => {
    const dispatch = useDispatch();
    const { user, isAuth } = useSelector((state) => state.userAuth);
    const { cart, error, isLoad } = useSelector((state) => state.cartReducer);
    // const { products } = useSelector((state) => state.products);
    const [Loading, setLoading] = useState(true);

    const history = useHistory();
    const [pros, setPros] = useState([]);
    const itemCheckAll = React.createRef();
    const selAll = React.createRef();

    useEffect(() => {
        if (isAuth) {
            setLoading(true);
            let data = [...cart];
            setPros(
                data.map((item) => {
                    return { ...item, select: false };
                })
            );
            setLoading(false);
        }
    }, [cart.length]);

    useEffect(() => {
        if (isAuth && !Loading && itemCheckAll.current) {
            itemCheckAll.current.checked = selAll.current.checked =
                numCheck().length === pros.length;
        }
    });

    const checkAll = (e) => {
        let isChecked = e.target.checked;

        setPros(
            pros.map((item) => {
                item.select = isChecked;
                return item;
            })
        );
    };

    const numCheck = () => {
        let num = [];
        pros.map((item, index) => item.select === true && num.push(index));
        return num;
    };

    const increase = (id) => {
        setPros(
            pros.map((item) => {
                if (item._id === id && item.select) ++item.num;
                return item;
            })
        );
    };

    const minus = (id) => {
        setPros(
            pros.map((item) => {
                if (item._id === id && item.select)
                    item.num = item.num === 1 ? 1 : --item.num;
                return item;
            })
        );
    };

    const monTotal = () => {
        let money = 0;
        pros.map((item) => {
            if (item.select === true) {
                money +=
                    parseInt(item.proPrize) *
                    (1 - parseInt(item.proPromo) / 100) *
                    item.num;
            }
        });

        return money;
    };

    const removeProduct = (id) => {
        if (window.confirm("Xác nhận xoá sản phẩm khỏi giỏ hàng")) {
            // cart.forEach((item, index) => {
            //     if (item.id === id) cart.splice(index, 1);
            // });

            dispatch(SingleDeleteCart(id));
        }
    };

    const handleBuyProduct = () => {
        const num = monTotal();
        if (num) {
            dispatch(postCart(pros));
            // setCart(pros);
            let mark = numCheck().join("a");
            history.push(`/cart/payment`);
        } else {
            alert("Bạn chưa chọn sản phẩm nào");
        }
    };

    const handleChangeInput = (e, index) => {
        const check = e.target.checked;

        setPros(
            pros.map((item, id) => {
                if (id === index) item.select = check;
                return item;
            })
        );
    };

    if (error) return <NotFound />;

    return (
        <>
            {Loading && <Loading2 mid={true} />}
            {!Loading && (
                <>
                    <div className="app grid wide bg-light">
                        <div className="card-pro">
                            <nav className="nav d-flex my-4 px-4 py-2 bg-white border rounded">
                                <li className="nav-item d-flex align-items-center flex-fill">
                                    <input
                                        className="form-input-check check-all cursor-pointer"
                                        type="checkbox"
                                        name="all"
                                        id="all"
                                        onChange={checkAll}
                                        ref={selAll}
                                        // onChange={handleCheck}
                                    />
                                    <label
                                        className="nav-link ps-2 text-dark-60"
                                        htmlFor="all"
                                    >
                                        Sản phẩm
                                    </label>
                                </li>
                                <li className="nav-item w-20 ms-auto l-2">
                                    <Link
                                        to="#"
                                        className="nav-link disabled ps-0"
                                        href="#"
                                        tabIndex="-1"
                                        aria-disabled="true"
                                    >
                                        Đơn Giá
                                    </Link>
                                </li>
                                <li className="nav-item l-2">
                                    <Link
                                        to="#"
                                        className="nav-link disabled ps-0"
                                        href="#"
                                        tabIndex="-1"
                                        aria-disabled="true"
                                    >
                                        Số Lượng
                                    </Link>
                                </li>
                                <li className="nav-item l-2">
                                    <Link
                                        to="#"
                                        className="nav-link disabled ps-0"
                                        href="#"
                                        tabIndex="-1"
                                        aria-disabled="true"
                                    >
                                        Số Tiền
                                    </Link>
                                </li>
                            </nav>
                            <div className="card-list ">
                                <div className="card-list-mark rounded border">
                                    {!isLoad && cart.length === 0 && (
                                        <h1 className="text-center text-muted mb-4 mt-4">
                                            Giỏ hàng trống
                                        </h1>
                                    )}
                                    {pros.length > 0 &&
                                        pros.map((item, index) => (
                                            <div
                                                key={uuidv4()}
                                                className="cart-list-mark-wrap px-4 d-flex card-body bg-white"
                                            >
                                                <div className="product-desc d-flex align-items-center flex-fill">
                                                    <input
                                                        className="form-check-input cursor-pointer"
                                                        type="checkbox"
                                                        name="item-check"
                                                        checked={item.select}
                                                        onChange={(e) =>
                                                            handleChangeInput(
                                                                e,
                                                                index
                                                            )
                                                        }
                                                    />
                                                    <div
                                                        className="div l-1 img-pf mx-2"
                                                        style={{
                                                            paddingBottom:
                                                                " 9%",
                                                            background: ` url(${item.proImage[0].main.url})`,
                                                            backgroundSize:
                                                                "cover",
                                                            backgroundPosition:
                                                                "center",
                                                            backgroundRepeat:
                                                                "no-repeat",
                                                        }}
                                                    ></div>
                                                    <span className="product-text align-self-start text-muted l-5 text-break lh-2 text-ellipsis">
                                                        {item.proName}
                                                    </span>
                                                </div>
                                                <div className="product-prize l-2 d-flex mt-3">
                                                    <small className="text-decoration-line-through text-muted me-2 ">
                                                        {handleNum(
                                                            item.proPrize
                                                        )}
                                                        <span className="under">
                                                            đ
                                                        </span>
                                                    </small>
                                                    <p className="prize-now ">
                                                        {handleNum(
                                                            parseInt(
                                                                item.proPrize
                                                            ) *
                                                                (1 -
                                                                    parseInt(
                                                                        item.proPromo
                                                                    ) /
                                                                        100)
                                                        )}
                                                        <span className="under">
                                                            đ
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="product-sell-num l-2 mt-2">
                                                    <div className="pagination-sm d-flex">
                                                        <div
                                                            className="page-link text-muted cursor-pointer"
                                                            onClick={() =>
                                                                minus(item._id)
                                                            }
                                                            // onClick={() => reduction(item._id)}
                                                        >
                                                            <i className="fas fa-minus"></i>
                                                        </div>
                                                        <div
                                                            className="page-item cursor-pointer disabled"
                                                            disabled
                                                        >
                                                            <span className="page-link">
                                                                {item.num}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className="page-link text-muted cursor-pointer"
                                                            onClick={() =>
                                                                increase(
                                                                    item._id
                                                                )
                                                            }
                                                            // onClick={() => increase(item.id)}
                                                        >
                                                            <i className=" fas fa-plus"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="product-money l-2 mt-3 d-flex justify-content-between">
                                                    <span className="text-warning">
                                                        {handleNum(
                                                            parseInt(
                                                                item.proPrize
                                                            ) *
                                                                (1 -
                                                                    parseInt(
                                                                        item.proPromo
                                                                    ) /
                                                                        100) *
                                                                item.num
                                                        )}
                                                        <span className="under">
                                                            đ
                                                        </span>
                                                    </span>
                                                    <span
                                                        className="me-5 cursor-pointer cart-remove-trash"
                                                        onClick={() =>
                                                            removeProduct(
                                                                item._id
                                                            )
                                                        }
                                                    >
                                                        <i className="far fa-trash-alt "></i>
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                <div className="px-4 card-footer d-flex align-items-center mt-4 border">
                                    <div className="footer-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input me-2 check-all cursor-pointer"
                                            name="cad"
                                            id="all-select"
                                            ref={itemCheckAll}
                                            onChange={checkAll}
                                            // onChange={handleCheck}
                                        />
                                        <label htmlFor="all-select">
                                            Chọn tất cả ({numCheck().length})
                                        </label>

                                        {numCheck().length === 0 && (
                                            <span className="text-muted ms-1">
                                                (Xoá)
                                            </span>
                                        )}
                                        {numCheck().length > 0 && (
                                            <Link
                                                to="#"
                                                className="ms-1 text-decoration-none"
                                                href="#"
                                            >
                                                (Xoá)
                                            </Link>
                                        )}
                                    </div>
                                    <div className="footer-text ms-auto l-4 text-center d-flex align-items-center">
                                        <span className="ms-auto fs-6 text-dark-2">
                                            Tổng thanh toán ({numCheck().length}{" "}
                                            sp):
                                        </span>
                                        <span className="text-warning fs-4 mx-3 mb-1">
                                            <span>{handleNum(monTotal())}</span>
                                            <span className="under">đ</span>
                                        </span>
                                    </div>
                                    <button
                                        className="btn btn-info text-white"
                                        onClick={handleBuyProduct}
                                    >
                                        {/* <Link
                                        to="/payment"
                                        className="text-decoration-none text-white"
                                    >
                                        Mua Hàng
                                    </Link> */}
                                        Mua Hàng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid wide">
                        <Slide
                            title="Bạn có thể thích"
                            type={`relative&userId=${user.userId}`}
                        />
                        <div className="pagination justify-content-end">
                            <div className="page-item cursor-pointer">
                                <span className="page-link">Pre</span>
                            </div>
                            <div className="page-item cursor-pointer active">
                                <span className="page-link ">1</span>
                            </div>
                            <div className="page-item cursor-pointer">
                                <span className="page-link">2</span>
                            </div>
                            <div className="page-item cursor-pointer">
                                <span className="page-link">...</span>
                            </div>
                            <div className="page-item cursor-pointer">
                                <span className="page-link">Nex</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Cart;
