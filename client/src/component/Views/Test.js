import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuid4 } from "uuid";
import address from "../MainPages/helpers/address2";
import Authorization from "../MainPages/Auth/Authorization";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../Redux/Auth/authAction";

const Test = () => {
    const dispatch = useDispatch();
    const { user, isAuth } = useSelector((state) => state.userAuth);
    const [formVal, setFormVal] = useState({
        name: "",
        number: "",
        comment: "",
    });

    const [ctrl, setCtrl] = useState({
        lev1: -1,
        lev2: -1,
        lev3: -1,
        data: address,
        play: 0,
        val: "",

        errVal: null,
    });
    useEffect(() => {
        if( user.mark ===1 ){
            setFormVal({
                name: user.userName, 
                number: user.number, 
                comment: user.address.des
            })
            setCtrl({
                ...ctrl, 
                val : user.address.main
            })
        }
    }, [])
    const [avata, setAvata] = useState(null);

    const onChangeInput = (e) => {
        setFormVal({ ...formVal, [e.target.name]: e.target.value });
    };

    const showBoxAddr = () => {
        setCtrl({
            ...ctrl,
            play: 1,
            lev1: 1,
        });
    };

    const handleItemClick = (e, index) => {
        let text = e.target.textContent;

        setCtrl({
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
        setCtrl({
            ...ctrl,
            lev2: index,
            lev3: 1, //vi tri cua huyen
            data: data[index].level3s,
            val: text,
        });
    };
    const handleItemClickLev3 = (e) => {
        let text = e.target.textContent;
        text += "," + val;

        setCtrl({
            play: 0,
            lev1: -1,
            lev2: -1,
            lev3: -1,
            data: [],
            val: text,
            errVal: null,
        });
    };

    const hanldeVal1 = () => {
        setCtrl({
            ...ctrl,
            play: 1,
            lev1: 1,
            data: address,
            lev2: -1,
            lev3: -1,
            val: "",
        });
    };
    const hanldeVal2 = () => {
        if (lev2 !== -1) {
            setCtrl({
                ...ctrl,
                data: address[lev1].level2s,
                lev3: -1,
                val: address[lev1].name,
            });
        }
    };

    const handleChangeInput = () => {};
    const { lev1, lev2, lev3, data, play, val } = ctrl;
    const { name, number, comment } = formVal;

    useEffect(() => {
        // console.log(flag.num + "\n" + user.mark + "\n" + flag.type);

        let ipTop = document.querySelectorAll("input.text-to-top"); //eff
        let textTop = document.querySelectorAll(".form-text-top"); // topcd
        let ele = document.querySelector(".input-address");

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

        ele.addEventListener("focus", function () {
            if (this.value === "")
                this.previousElementSibling.style.animation =
                    "fade-up linear 0.2s forwards";

            this.previousElementSibling.style.color = "#0d6efd";

            setCtrl({
                ...ctrl,
                play: 1,
                lev1: 1,
                data: address,
                val: "",
            });
        });

        ele.addEventListener("blur", function () {
            this.previousElementSibling.style.color = "#6c757d";
        });
        // }

        if (user && user.mark === 1) {
            let ipTop = document.querySelectorAll("input.text-to-top"); //eff
            let textTop = document.querySelectorAll(".form-text-top"); //
            for (let i = 0; i < textTop.length; i++) {
                textTop[i].classList.add("after-effect");
            }
        }
    }, []);

    useEffect(() => {
        Authorization({
            formName: "addr",
            rules: [
                Authorization.isRequired("#Name", "Vui lòng nhập tên"),
                Authorization.isNumber("#number", "Vui lòng nhập đúng sđt"),
            ],
        });
    });

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        let data = {
            userName: name,
            number: number,
            address: {
                main: val,
                des: comment,
            },
            avata,
        };

        const enSub = Authorization.handleSubmit();

        if (!val) {
            setCtrl({
                ...ctrl,
                errVal: true,
            });
        }
        if (val && !enSub) {
            const res = await dispatch(updateProfile(data)).catch((err) =>
                alert("Tính nay này hiện không khả dụng")
            );
            window.location.href = "/";
        }
    };

    const handleFileInputChange = async (e) => {
        // if (images) deleteImage(images.public_id);

        try {
            const file = e.target.files;
            let ins = file.length;
            let formData = new FormData();

            for (let x = 0; x < ins; x++) {
                formData.append("files", file[x]);
            }
            // =================================///==================
            // if (!file) return alert("File is not exist");
            // if (file.size > 1024 * 1024) return alert("Size too large!!");
            // if (file.type !== "image/jpeg" && file.type !== "image/png")
            //     return alert("File format is incorrect");
            // formData.append("file", file);
            // =========================================================
            // setLoading(true);
            const res = await axios.post(`/service/upload`, formData, {
                headers: {
                    "content-type": "multipart/form-data",
                },
            });
            console.log(res.data);
            // setLoading(false);
            if (res.data && res.data.success) {
                const { public_id, url } = res.data.imgs[0];
                setAvata({
                    public_id,
                    url,
                });
            }
        } catch (err) {
            console.log(err);
        }

        // previewFile(file);
    };

    const deleteImage = async () => {
        const res = await axios.post(`/service/destroy`, {
            public_id: avata.public_id,
        });
        if (res.data.success) {
            setAvata(null);
        }
    };

    return (
        <>
            <div
                className="dialog-address mt-3 w-100 h-100"
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
                        <div className="form-group img-upload h-100 position-relative w-50 m-auto mb-4">
                            <label
                                htmlFor="img"
                                className={
                                    avata
                                        ? "d-none"
                                        : `l-12
                            w-100 h-100 border 
                            border-info d-flex 
                            justify-content-center 
                            align-items-center 
                            cursor-pointer
                            
                            `
                                }
                                style={{
                                    minHeight: "200px",
                                    borderRadius: "999px",
                                    boxShadow: "0 0 20px -8px #1bbadbed",
                                }}
                            >
                                <i className="fas fa-plus fs-1 text-warning"></i>
                            </label>
                            <input
                                className="d-none"
                                type="file"
                                multiple
                                name="file"
                                id="img"
                                onChange={handleFileInputChange}
                            />
                            {avata && (
                                <div
                                    className="wrap-img-avata m-auto"
                                    style={{
                                        border: "1px solid #16c3e7ed",
                                        borderRadius: "999px",
                                        overflow: "hidden",
                                        /* height: 390px; */
                                        width: "200px",
                                        height: "200px",
                                        boxShadow:
                                            "rgb(27 186 219 / 93%) 0px 0px 20px -8px",
                                    }}
                                >
                                    <img
                                        src={avata && avata.url}
                                        alt="choosen"
                                    />
                                </div>
                            )}

                            {avata && (
                                <i
                                    className="far fa-times-circle img-close cursor-pointer text-danger"
                                    onClick={() => deleteImage(avata)}
                                ></i>
                            )}
                        </div>

                        <div className="d-flex">
                            <div className="form-group me-1">
                                <div className="form-text-top px-1">Name</div>
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
                                    value={val}
                                    onChange={handleChangeInput}
                                    autoComplete="off"
                                    onFocus={showBoxAddr}
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
                                            onClick={hanldeVal1}
                                            // onClick="loadData()"
                                        >
                                            Tỉnh/Thành phố
                                        </div>
                                        <div
                                            className="nav-item nav-item-district btn active"
                                            onClick={hanldeVal2}
                                        >
                                            Quận/Huyện
                                        </div>
                                        <div className="nav-item nav-item-ppc btn">
                                            Xã/Phường
                                        </div>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        {lev1 !== -1 &&
                                            lev2 === -1 &&
                                            data.map((item, index) => (
                                                <li
                                                    className="list-group-item list-group-item-effect"
                                                    key={uuid4()}
                                                    onClick={(e) =>
                                                        handleItemClick(
                                                            e,
                                                            index
                                                        )
                                                    }
                                                >
                                                    {item.name}
                                                </li>
                                            ))}
                                        {lev2 !== -1 &&
                                            lev3 === -1 &&
                                            data.map((item, index) => (
                                                <li
                                                    className="list-group-item list-group-item-effect"
                                                    key={uuid4()}
                                                    onClick={(e) =>
                                                        handleItemClickLev2(
                                                            e,
                                                            index
                                                        )
                                                    }
                                                >
                                                    {item.name}
                                                </li>
                                            ))}
                                        {lev3 !== -1 &&
                                            data.map((item, index) => (
                                                <li
                                                    className="list-group-item list-group-item-effect"
                                                    key={uuid4()}
                                                    onClick={(e) =>
                                                        handleItemClickLev3(
                                                            e,
                                                            index
                                                        )
                                                    }
                                                >
                                                    {item.name}
                                                </li>
                                            ))}

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
                            <div
                                className="
                                    btn btn-outline-secondary me-2
                                "
                            >
                                Trở lại
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Hoàn thành
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Test;
