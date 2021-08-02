import React, { useState, useEffect } from "react";
import bkg from "../../../public/img/background.png";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Authorization from "../Auth/Authorization";
import { sendMailForget, sendPassForget } from "../../../Redux/Auth/authAction";
import { clearError } from "../../../Redux/Auth/authAction";

const ResetPass = ({ type }) => {
    const { pathname } = useLocation();
    // console.log(pathname);
    const dispatch = useDispatch();
    const { user, isLoad, isAuth, error } = useSelector(
        (state) => state.userAuth
    );
    const [check, setCheck] = useState(true);
    const [ipVal, setIpVal] = useState({
        email: "",
        password: "",
        verify: "",
    });

    const handleInputChange = (e) => {
        const text = e.target.value;
        setIpVal({ ...ipVal, [e.target.name]: text });
    };
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log(ipVal.email);
    // };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const enSub = Authorization.handleSubmit();
        if (!enSub && type === "email") {
            const res = await dispatch(sendMailForget({ email: ipVal.email }));
            if (res && res.success) {
                setCheck(!check);
            }
        }
        if (!enSub && type === "reset") {
            const res = await dispatch(
                sendPassForget(pathname, { password: ipVal.password })
            );
            if (res && res.success) {
                alert(res.msg);
                window.location.href = "/login";
            }
        }
    };
    useEffect(() => {
        if (error) {
            setTimeout(() => dispatch(clearError()), 4000);
        }
    }, [error]);

    useEffect(() => {
        if (type === "email")
            Authorization({
                formName: "forget",
                rules: [
                    Authorization.isRequired(
                        "#email",
                        "Vui lòng nhập trường này"
                    ),
                    Authorization.isEmail(
                        "#email",
                        "Vui lòng nhập địa chỉ email!!"
                    ),
                ],
            });
        else
            Authorization({
                formName: "forget",
                rules: [
                    Authorization.isRequired(
                        "#password",
                        "Vui lòng nhập trường này"
                    ),
                    Authorization.minLength(
                        "#password",
                        5,
                        "Minximum of password is 5 charactors test"
                    ),

                    Authorization.isRequired(
                        "#verify",
                        "Trường này không được để trống"
                    ),
                    Authorization.compare("#verify", function () {
                        return document.querySelector("#password").value;
                    }),
                ],
            });
    }, [type]);
    return (
        <div className="app-main position-relative">
            <img
                src={bkg}
                alt="background"
                width="1200px"
                className="app-bkg"
            />
            {type === "email" && (
                <div className="grid wide app-container">
                    <div
                        className="app-signup translate-middle"
                        style={{ top: "50vh", left: "50vw" }}
                    >
                        {check && (
                            <form
                                name="forget"
                                action="#"
                                method="POST"
                                onSubmit={handleSubmitForm}
                            >
                                <h1 className="app-title text-center">
                                    Xác thực Email
                                </h1>
                                <div className="input-wrap">
                                    <label
                                        className="form-lable"
                                        htmlFor="email"
                                    >
                                        Vui lòng nhập email
                                    </label>
                                    <input
                                        type="text"
                                        name="email"
                                        className="form-input form-control"
                                        id="email"
                                        placeholder="Nhập email"
                                        value={ipVal.email}
                                        onChange={handleInputChange}
                                    />

                                    <span className="email-err form-err"></span>
                                </div>
                                <button className="btn btn-primary w-100 mt-3">
                                    Gửi
                                </button>
                                {error && (
                                    <span className="text-danger mt-3 d-inline-block">
                                        <i className="fas fa-exclamation-triangle text-danger"></i>
                                        <span className="ms-2">{error}</span>
                                    </span>
                                )}
                            </form>
                        )}
                        {!check && (
                            <>
                                <div className="card border-0">
                                    <div className="card-title border-0">
                                        <h3 className="text-center">
                                            Reset Password
                                        </h3>
                                    </div>
                                    <div className="card-body border border-warning">
                                        <p>
                                            Check your inbox for the next steps.
                                            If you don't receive an email, and
                                            it's not in your spam folder this
                                            could mean you signed up with a
                                            different address.
                                        </p>
                                    </div>
                                    <div className="card-footer border mt-2 text-center">
                                        <Link to="/login">Login </Link>
                                        or
                                        <Link to="/signup"> Signup</Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            {type === "reset" && (
                <div className="grid wide app-container">
                    <div className="app-signup l-o-7 m-o-4">
                        <form
                            name="forget"
                            action="#"
                            method="POST"
                            onSubmit={handleSubmitForm}
                        >
                            <h1 className="app-title text-center">
                                Reset Password
                            </h1>
                            <div className="input-wrap">
                                <label className="form-lable" htmlFor="email">
                                    Mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-input form-control"
                                    id="password"
                                    placeholder="Nhập mật khẩu"
                                    value={ipVal.password}
                                    onChange={handleInputChange}
                                />

                                <span className="email-err form-err"></span>
                            </div>
                            <div className="input-wrap">
                                <label className="form-lable" htmlFor="email">
                                    Nhập lại mật khẩu
                                </label>
                                <input
                                    type="password"
                                    name="verify"
                                    className="form-input form-control"
                                    id="verify"
                                    placeholder="Nhập lại mật khẩu"
                                    value={ipVal.verify}
                                    onChange={handleInputChange}
                                />

                                <span className="email-err form-err"></span>
                            </div>
                            <button className="btn btn-primary w-100 mt-3">
                                Gửi
                            </button>
                            {error && (
                                <span className="text-danger mt-3 d-inline-block">
                                    <i className="fas fa-exclamation-triangle text-danger"></i>
                                    <span className="ms-2">{error}</span>
                                </span>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResetPass;
