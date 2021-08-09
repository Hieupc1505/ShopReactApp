import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../../public/css/pay.css";
import address2 from "../helpers/address2";
import { v4 as uuid4 } from "uuid";
import handleNum from "../helpers/handleNum";
import { useDispatch, useSelector } from "react-redux";
import { sendProfileForm } from "../../../Redux/Auth/authAction";
import { updateProfile } from "../../../Redux/Auth/authAction";
import { Redirect } from "react-router-dom";
// import NotFound from "../utils/NotFound/NotFound";
import Loading2 from "../utils/Loading/Loading2";
// import { SERVER } from "../helpers/key";
import axios from "axios";
import { OrderPost, postCart } from "../../../Redux/Cart/actionCard";
import Authorization from "../Auth/Authorization";

const Payment = () => {
    const dispatch = useDispatch();
    const { search } = useLocation();
    // const [param, setParam] = useState(null);

    const { user, isLoad: loadUser } = useSelector((state) => state.userAuth);
    const { cart, isLoad } = useSelector((state) => state.cartReducer);

    const [flag, setFlag] = useState({
        num: 0,
        type: "post",
    });
    const [dataPro, setDataPro] = useState({
        pros: [],
        total: 0,
        restCart: [],
    });
    const [ctrl, setControl] = useState({
        play: 0,
        lev1: -1,
        lev2: -1,
        lev3: -1,
        data: [],
        val: "",
        errVal: null,
    });
    const [dataForm, setDataForm] = useState({
        name: "",
        number: "",
        comment: "",
    });
    const [Loading, setLoading] = useState(true);
    const ele = React.createRef();

    let userMark = user && user.mark ? user.mark : null;
    const { pros, total } = dataPro;
    let { name, number, comment } = dataForm;
    const { play, lev1, lev2, lev3, data, val } = ctrl;

    useEffect(() => {
        if (user) {
            let type = user.mark === 0 ? "post" : "put";
            setFlag({
                num: user.mark,
                type,
            });
            if (type === "put")
                setDataForm({
                    name: user.userName,
                    number: user.number,
                    comment: user.address.des,
                });
            if (type === "post")
                setDataForm({
                    name: "",
                    number: "",
                    comment: "",
                });
            setControl({
                play: 0,
                lev1: -1,
                lev2: -1,
                lev3: -1,
                data: [],
                val: user.address ? user.address.main : "",
                errVal: null,
            });
        }
    }, [userMark]);

    useEffect(() => {
        let mon = 0;
        let data = [];
        let restCart = [];
        for (let item of cart) {
            if (item && item.select === true) data.push(item);
            else restCart.push(item);
        }
        data.forEach((item) => {
            mon +=
                parseInt(item.proPrize) *
                (1 - parseInt(item.proPromo) / 100) *
                parseInt(item.num);
        });
        setDataPro({
            pros: data,
            total: mon,
            restCart,
        });
    }, [cart, search]);

    useEffect(() => setLoading(!Loading), [dataPro]);

    useEffect(() => {
        // console.log(flag.num + "\n" + user.mark + "\n" + flag.type);

        if (flag.num === 0 && !isLoad && !loadUser) {
            let ipTop = document.querySelectorAll("input.text-to-top"); //eff
            let textTop = document.querySelectorAll(".form-text-top"); // topcd

            Array.from(ipTop).map((eff) => {
                eff.addEventListener("focus", () => {
                    if (eff.value === "")
                        eff.previousElementSibling.style.animation =
                            "fade-up linear 0.2s forwards";

                    eff.previousElementSibling.style.color = "#0d6efd";
                });

                eff.addEventListener("blur", () => {
                    // let ele = eff.previousElementSibling.
                    // topcd = document.querySelector(".form-text-top");
                    let topcd = eff.previousElementSibling;
                    topcd.setAttribute("style", "color : #6c757d !important");
                    if (eff.value === "") {
                        topcd.style.animation = "";
                        topcd.classList.remove("after-effect");
                    } else if (eff.value !== "") {
                        topcd.classList.add("after-effect");
                    }
                });
            });
            Array.from(textTop).map((topcd) => {
                let eff = topcd.nextElementSibling;
                topcd.addEventListener("click", () => {
                    eff.focus();
                });
            });

            ele.current.addEventListener("focus", function () {
                if (this.value === "")
                    this.previousElementSibling.style.animation =
                        "fade-up linear 0.2s forwards";

                this.previousElementSibling.style.color = "#0d6efd";

                setControl({
                    ...ctrl,
                    play: 1,
                    lev1: 1,
                    data: address2,
                    val: "",
                });
            });
            ele.current.addEventListener("blur", function () {
                this.previousElementSibling.style.color = "#6c757d";
            });
        }

        if (flag.type === "put" && flag.num === 0 && !loadUser) {
            let ipTop = document.querySelectorAll("input.text-to-top"); //eff
            let textTop = document.querySelectorAll(".form-text-top"); //
            for (let i = 0; i < textTop.length; i++) {
                textTop[i].classList.add("after-effect");
            }
        }
    }, [isLoad, loadUser, flag.num]);

    useEffect(() => {
        if (play === 1) {
            document
                .querySelector(".nav-item-province")
                .addEventListener("click", () => {
                    setControl({
                        ...ctrl,
                        play: 1,
                        lev1: 1,
                        data: address2,
                        lev2: -1,
                        lev3: -1,
                        val: "",
                    });
                });
            document
                .querySelector(".nav-item-district")
                .addEventListener("click", () => {
                    if (lev2 !== -1) {
                        setControl({
                            ...ctrl,
                            data: address2[lev1].level2s,
                            lev3: -1,
                            val: address2[lev1].name,
                        });
                    }
                });
        }
    }, [play, lev1, lev2]);

    const handleItemClick = (e, index) => {
        let text = e.target.textContent;
        text += val;

        setControl({
            ...ctrl,
            lev1: index,
            lev2: 1, //vi tri cua tinh
            data: data[index].level2s,
            val: text,
        });
    };
    const handleItemClickLev2 = (e, index) => {
        let text = e.target.textContent;
        text += "," + val;
        setControl({
            ...ctrl,
            lev2: index,
            lev3: 1, //vi tri cua huyen
            data: data[index].level3s,
            val: text,
        });
    };
    const handleItemClickLev3 = (e, index) => {
        let text = e.target.textContent;
        text += "," + val;

        setControl({
            play: 0,
            lev1: -1,
            lev2: -1,
            lev3: -1,
            data: [],
            val: text,
        });
    };
    const onChangeInput = (e) => {
        let text = e.target.value;
        setDataForm({ ...dataForm, [e.target.name]: text });
    };
    const changeProfile = () => {
        setFlag({
            num: 0,
            type: "put",
        });
    };
    const cancel = () => {
        setFlag({
            num: 1,
            type: "put",
        });
    };
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        let data = {
            userName: name,
            number: number,
            address: {
                main: val,
                des: comment,
            },
        };

        const enSub = Authorization.handleSubmit();

        if (!val) {
            setControl({
                ...ctrl,
                errVal: true,
            });
        }
        if (val && !enSub) {
            if (flag.type === "post") await dispatch(sendProfileForm(data));
            else if ((flag.type = "put")) {
                await dispatch(updateProfile(data));
                setFlag({
                    ...flag,
                    num: 1,
                });
            }
        }
    };
    let [check, setCheck] = useState(0);
    const changeCheck = () => {
        let tar = check === 0 ? 1 : 0;
        setCheck(tar);
    };
    const handlePayOnline = async () => {
        if (pros.length === 0) window.location.href = "/";
        if (check === 1) {
            const { data } = await axios.post(`/order/create_payment_url`, {
                amount: `${dataPro.total}`,
                orderType: "billpayment",
                orderDescription: "Thanh toan don hang thoi gian: ",
                language: "vn",
            });

            const { url } = data;

            window.location.href = url;
        } else {
            // const userInfo = {
            //     userName: dataForm.name,
            //     number: dataForm.number,
            //     address: {
            //         main: val,
            //         des: comment,
            //     },
            // };
            const userInfo = {
                userName: user.userName,
                number: user.number,
                address: {
                    main: user.address.main,
                    des: user.address.des,
                },
            };

            setLoading(true);

            const order = dataPro.pros.map((item) => {
                return { num: item.num, _id: item._id };
            });

            await dispatch(
                OrderPost({ userInfo, order, pay: 0, total: dataPro.total })
            );

            await dispatch(postCart(dataPro.restCart));
            alert("Đơn hàng của bạn đang được xử lý");
            setLoading(false);
        }
    };
    useEffect(
        () =>
            (async () => {
                if (search.includes("vnp_ResponseCode")) {
                    const { data } = await axios.get(
                        `/order/vnpay_return${search}`
                    );
                    if (
                        data.msg["vnp_ResponseCode"] === "00" &&
                        pros.length > 0
                    ) {
                        const userInfo = {
                            userName: user.userName,
                            number: user.number,
                            address: {
                                main: user.address.main,
                                des: user.address.des,
                            },
                        };

                        setLoading(true);
                        const order = dataPro.pros.map((item) => {
                            return { num: item.num, _id: item._id };
                        });
                        await dispatch(
                            OrderPost({
                                userInfo,
                                order,
                                pay: 1,
                                total: dataPro.total,
                            })
                        );

                        await dispatch(postCart(dataPro.restCart));
                        alert("GD thành công!!");
                        window.location.href = "/";
                    } else if (
                        data.msg["vnp_ResponseCode"] !== "00" &&
                        !isLoad
                    ) {
                        alert("GD thất bại");
                    }
                }
            })(),
        [search, dataPro.pros]
    );
    useEffect(() => {
        if (flag.num === 0)
            Authorization({
                formName: "addr",
                rules: [
                    Authorization.isRequired("#Name", "Vui lòng nhập tên"),
                    Authorization.isNumber("#number", "Vui lòng nhập đúng sđt"),
                ],
            });
    });

    const handleChangeInput = () => {};
    if (!isLoad && !Loading && pros.length === 0) return <Redirect to="/" />;
    return (
        <>
            {!isLoad ? (
                <div className="app grid wide bg-light">
                    {flag.num === 0 && (
                        <div
                            className="dialog-address position-fixed w-100 h-100"
                            style={{
                                zIndex: "10",
                                top: "0",
                                left: "0",
                                right: "0",
                                bottom: "0",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                background: "rgba(255, 255, 255, 0.9)",
                            }}
                        >
                            <div className="dialog-main rounded border bg-white">
                                <form
                                    action="#"
                                    className="form p-4"
                                    onSubmit={handleSubmitForm}
                                    name="addr"
                                >
                                    <div className="d-flex">
                                        <div className="form-group me-1">
                                            <div className="form-text-top px-1">
                                                Name
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                id="Name"
                                                className="form-control-custom text-to-top"
                                                value={name}
                                                onChange={onChangeInput}
                                            />
                                            <span className="email-err form-err"></span>
                                        </div>
                                        <div className="form-group ms-1">
                                            <div className="form-text-top px-1">
                                                Số điện thoại
                                            </div>
                                            <input
                                                type="text"
                                                name="number"
                                                id="number"
                                                className="form-control-custom text-to-top "
                                                value={number}
                                                onChange={onChangeInput}
                                            />
                                            <span className="email-err form-err"></span>
                                        </div>
                                    </div>
                                    <div className="form-add-wrap mt-3">
                                        <div className="form-group">
                                            <div className="form-text-top px-1">
                                                Địa Chỉ
                                            </div>
                                            <input
                                                className="form-control-custom w-100 input-address"
                                                type="text"
                                                name="address"
                                                id="address"
                                                ref={ele}
                                                value={val}
                                                onChange={handleChangeInput}
                                                autoComplete="off"
                                                onFocus={() =>
                                                    setControl({
                                                        ...ctrl,
                                                        errVal: null,
                                                    })
                                                }
                                            />
                                            {ctrl.errVal && (
                                                <span className="email-err form-err">
                                                    Vui lòng nhập địa chỉ
                                                </span>
                                            )}
                                        </div>
                                        {play === 1 && (
                                            <div className="form-add-list border rounded mt-3">
                                                <div
                                                    className="
                                        form-add-nav
                                        nav nav-pills nav-fill
                                        border-bottom
                                    "
                                                >
                                                    <div
                                                        className="nav-item nav-item-province  btn active rounded-0"
                                                        // onClick="loadData()"
                                                    >
                                                        Tỉnh/Thành phố
                                                    </div>
                                                    <div className="nav-item nav-item-district btn active">
                                                        Quận/Huyện
                                                    </div>
                                                    <div className="nav-item nav-item-ppc btn">
                                                        Xã/Phường
                                                    </div>
                                                </div>
                                                <ul className="list-group list-group-flush">
                                                    {lev1 !== -1 &&
                                                        lev2 === -1 &&
                                                        data.map(
                                                            (item, index) => (
                                                                <li
                                                                    className="list-group-item list-group-item-effect"
                                                                    key={uuid4()}
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        handleItemClick(
                                                                            e,
                                                                            index
                                                                        )
                                                                    }
                                                                >
                                                                    {item.name}
                                                                </li>
                                                            )
                                                        )}
                                                    {lev2 !== -1 &&
                                                        lev3 === -1 &&
                                                        data.map(
                                                            (item, index) => (
                                                                <li
                                                                    className="list-group-item list-group-item-effect"
                                                                    key={uuid4()}
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        handleItemClickLev2(
                                                                            e,
                                                                            index
                                                                        )
                                                                    }
                                                                >
                                                                    {item.name}
                                                                </li>
                                                            )
                                                        )}
                                                    {lev3 !== -1 &&
                                                        data.map(
                                                            (item, index) => (
                                                                <li
                                                                    className="list-group-item list-group-item-effect"
                                                                    key={uuid4()}
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        handleItemClickLev3(
                                                                            e,
                                                                            index
                                                                        )
                                                                    }
                                                                >
                                                                    {item.name}
                                                                </li>
                                                            )
                                                        )}

                                                    {/* <!-- <li className="list-group-item">VinhPhuc</li>
                                    <li className="list-group-item">HaNoi</li>
                                    <li className="list-group-item">TP.HCM</li>
                                    <li className="list-group-item">HaTay</li>
                                    <li className="list-group-item">DaNang</li>
                                    <li className="list-group-item">HaTay</li>
                                    <li className="list-group-item">CaoNguyen</li>
                                    <li className="list-group-item">HaTay</li> --> */}
                                                </ul>
                                                <ul
                                                    className="
                                        list-group list-group-flush
                                        group-add2
                                    "
                                                ></ul>
                                            </div>
                                        )}
                                    </div>
                                    <textarea
                                        className="form-more-detail-addr mt-3 border rounded"
                                        placeholder="Địa chỉ cụ thể"
                                        name="comment"
                                        value={comment}
                                        onChange={onChangeInput}
                                    ></textarea>
                                    <div className="form-group mt-3">
                                        <label htmlFor="#" className="d-block">
                                            Loại địa chỉ
                                        </label>
                                        <div className="btn btn-outline-success me-2">
                                            Nhà riêng
                                            {/* <span className="flag-btn"></span> */}
                                        </div>
                                        <div className="btn btn-outline-success">
                                            Văn phòng
                                        </div>
                                    </div>
                                    <div className="justify-content-end mt-4 text-right d-flex">
                                        {user.mark !== 0 && (
                                            <div
                                                className="
                                    btn btn-outline-secondary me-2
                                "
                                                onClick={cancel}
                                            >
                                                Trở lại
                                            </div>
                                        )}
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            Hoàn thành
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    <div className="pay-ment">
                        <div
                            className="
                        pay-address
                        mt-5
                        bg-white
                        border
                        rounded
                        position-relative
                    "
                            style={{ position: "absolute", width: "100%" }}
                        >
                            <div className="draw position-absolute w-100"></div>
                            <h3 className="fs-5 mt-2 ms-4 text-info pt-2">
                                <i className="fas fa-map-marker-alt me-2"></i>
                                Địa chỉ nhận hàng
                            </h3>
                            {user && flag.num === 1 && (
                                <ul className="pay-list d-flex justify-content-between me-5">
                                    <li
                                        className="pay-list-item fs-6 fw-bold"
                                        style={{
                                            /* width: 360px; */
                                            flexBasis: "35%",
                                            display: "flex",
                                            flexWrap: "wrap",
                                            /* flex-grow: 11; */
                                        }}
                                    >
                                        <span className="pay-name me-2">
                                            {user.userName}
                                        </span>
                                        <span className="pay-number">
                                            {user.number}
                                        </span>
                                    </li>
                                    <li className="pay-list-item px-2 flex-fill">
                                        {user.address.main}
                                    </li>
                                    <li
                                        className="pay-list-item text-muted"
                                        style={{ flexBasis: "10%" }}
                                    >
                                        Mặc định
                                    </li>
                                    <li
                                        className="pay-list-item cursor-pointer"
                                        style={{ flexBasis: "10%" }}
                                        onClick={changeProfile}
                                    >
                                        Thay đổi
                                    </li>
                                </ul>
                            )}
                        </div>
                        <div className="pay-ment-payrol card mt-5">
                            <div className="card-body py-4">
                                <nav
                                    className="
                                nav
                                d-flex
                                px-4
                                py-2
                                bg-white
                                border
                                rounded
                                border-bottom-0
                            "
                                >
                                    <li
                                        className="
                                    nav-item
                                    d-flex
                                    align-items-center
                                    flex-fill
                                "
                                    >
                                        <label
                                            className="nav-link ps-2 text-dark-60"
                                            htmlFor="all"
                                        >
                                            Sản phẩm
                                        </label>
                                    </li>
                                    <li className="nav-item w-20 ms-auto l-2">
                                        <Link
                                            className="nav-link disabled ps-0"
                                            to="#"
                                            tabIndex="-1"
                                            aria-disabled="true"
                                        >
                                            Đơn Giá
                                        </Link>
                                    </li>
                                    <li className="nav-item l-2">
                                        <Link
                                            className="nav-link disabled ps-0"
                                            to="#"
                                            tabIndex="-1"
                                            aria-disabled="true"
                                        >
                                            Số Lượng
                                        </Link>
                                    </li>
                                    <li className="nav-item l-2">
                                        <Link
                                            className="nav-link disabled ps-0"
                                            to="#"
                                            tabIndex="-1"
                                            aria-disabled="true"
                                        >
                                            Số Tiền
                                        </Link>
                                    </li>
                                </nav>
                                <div className="card-list">
                                    {pros.map((item) => (
                                        <div
                                            key={uuid4()}
                                            className="
                                    px-4
                                    d-flex
                                    card-body
                                    bg-white
                                    border
                                    rounded
                                "
                                        >
                                            <div
                                                className="
                                        product-desc
                                        d-flex
                                        align-items-center
                                        flex-fill
                                    "
                                            >
                                                <div
                                                    className="
                                            div
                                            l-1
                                            img-pf
                                            mx-2
                                            d-inline-block
                                        "
                                                    style={{
                                                        paddingBottom: "9%",
                                                        background: `url('${item.proImage[0].main.url}')`,
                                                        backgroundPosition:
                                                            "center",
                                                        backgroundSize: "cover",
                                                        backgroundRepeat:
                                                            "no-repeat",
                                                    }}
                                                ></div>
                                                <span
                                                    className="
                                            product-text
                                            align-self-start
                                            text-muted
                                            l-5
                                            text-break
                                            lh-2
                                            text-ellipsis
                                            flex-fill
                                            ms-2
                                            me-4
                                        "
                                                >
                                                    {item.proName}
                                                </span>
                                            </div>
                                            <div className="product-prize w-20 d-flex mt-3">
                                                {/* <small
                                                className="
                                            text-decoration-line-through
                                            text-muted
                                            me-2
                                        "
                                            >
                                                {handleNum(item.Prize)}
                                                <span className="under">đ</span>
                                            </small> */}
                                                <p className="prize-now">
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
                                                        className="page-item disabled ms-4"
                                                        disabled=""
                                                    >
                                                        <span className="page-link">
                                                            {item.num}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="product-money l-2 mt-3">
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
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="card-ship d-flex py-4">
                                <div
                                    className="
                                card-ship-form
                                form-group form-inline
                                d-flex
                                px-3
                            "
                                    style={{
                                        flexBasis: "40%",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <label
                                        htmlFor="ship"
                                        style={{ flexBasis: "25%" }}
                                    >
                                        Lới nhắn
                                    </label>
                                    <input
                                        type="text"
                                        name="comment"
                                        id="ship"
                                        className="form-control"
                                        placeholder="Add comment for custommer"
                                    />
                                </div>
                                <div
                                    className="
                                card-ship-main
                                d-flex
                                justify-content-between
                                flex-fill
                                px-3
                                align-items-center
                                justify-content-between
                            "
                                >
                                    <span className="text-info">
                                        Đơn vị vận chuyển:{" "}
                                    </span>
                                    <div className="card-ship-main-opp">
                                        <h4 className="fs-5">
                                            Vận chuyển nhanh quốc tế
                                        </h4>
                                        <p className="card-text">
                                            <small>Standard express</small>
                                        </p>
                                    </div>
                                    <Link
                                        to="#"
                                        className="text-primary fs-5 text-decoration-none"
                                    >
                                        Thay đổi
                                    </Link>
                                    <span className="text-muted me-2">
                                        {handleNum(30000)}
                                        <span className="under">đ</span>
                                    </span>
                                </div>
                            </div>
                            <div
                                className="
                            card-header
                            pay-ment-payrol-header
                            d-flex
                            p-3
                            align-items-center
                            bg-light
                        "
                            >
                                <h5 className="">Phương thức thanh toán</h5>
                                {check === 0 && (
                                    <>
                                        {" "}
                                        <div
                                            className="btn btn-outline-info btn-outline-info-selected mx-3 px-3 position-relative"
                                            onClick={changeCheck}
                                        >
                                            Thanh toán khi nhận hàng
                                            <i className="fas fa-check btn-icon-select"></i>
                                        </div>
                                        <div
                                            className="btn btn-outline-info px-3 position-relative"
                                            onClick={changeCheck}
                                        >
                                            Thẻ tín dụng/Ghi nợ
                                        </div>
                                    </>
                                )}
                                {check === 1 && (
                                    <>
                                        {" "}
                                        <div
                                            className="btn btn-outline-info mx-3 px-3 position-relative"
                                            onClick={changeCheck}
                                        >
                                            Thanh toán khi nhận hàng
                                        </div>
                                        <div
                                            className="btn btn-outline-info  btn-outline-info-selected px-3 position-relative"
                                            onClick={changeCheck}
                                        >
                                            Thẻ tín dụng/Ghi nợ
                                            <i className="fas fa-check btn-icon-select"></i>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="card-body">
                                <div className="card-content w-25 float-end">
                                    <div
                                        className="
                                    card-text-wrap
                                    d-flex
                                    justify-content-between
                                    text-muted
                                "
                                    >
                                        <span className="card-text">
                                            Tổng tiền hàng :{" "}
                                        </span>
                                        <span className="card-prize me-2">
                                            {handleNum(total)}
                                            <span className="under">đ</span>
                                        </span>
                                    </div>
                                    <div
                                        className="
                                    card-text-wrap
                                    d-flex
                                    justify-content-between
                                    text-muted
                                "
                                    >
                                        <span className="card-text">
                                            Phí vận chuyển :{" "}
                                        </span>
                                        <span className="card-prize me-2">
                                            {handleNum("30000")}
                                            <span className="under">đ</span>
                                        </span>
                                    </div>
                                    <div
                                        className="
                                    card-text-wrap
                                    d-flex
                                    justify-content-between
                                    text-muted
                                    align-items-center
                                "
                                    >
                                        <span className="card-text">
                                            Tổng tiền hàng :
                                        </span>
                                        <span className="card-prize me-2 fs-2 text-danger">
                                            {handleNum(total, 30000)}
                                            <span className="under">đ</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer d-flex justify-content-between py-3">
                                <span className="card-text d-flex align-items-center">
                                    Ấn vào đặt hàng bạn đã đồng ý với
                                    <Link
                                        className="small ms-1"
                                        to="/cart/payment"
                                    >
                                        Điều khoản sử dụng
                                    </Link>
                                </span>
                                <button
                                    className="btn btn-primary px-4"
                                    onClick={handlePayOnline}
                                >
                                    Đặt hàng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Loading2 mid={true} />
            )}
        </>
    );
};

export default Payment;
