import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bkg from "../../../public/img/background.png";
import Authorization from "../Auth/Authorization";
import { userRegister } from "../../../Redux/Auth/authAction";
import { useDispatch, useSelector } from "react-redux";
import { clearError } from "../../../Redux/Auth/authAction";
// import { v4 as uuid4 } from "uuid";
// import ErrorForm from "./ErrorForm";

// import { MemoErrorForm } from "./ErrorForm";

const Signup = () => {
    const dispatch = useDispatch();
    const { user, isAuth, error } = useSelector((state) => state.userAuth);

    const [signForm, setLoginForm] = useState({
        email: "",
        password: "",
        verify: "",
    });

    // const [msg, setMsg] = useState(null);

    const { email, password, verify } = signForm;

    const onInputChange = (e) => {
        setLoginForm({ ...signForm, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (error) {
            setTimeout(() => dispatch(clearError()), 4000);
        }
    }, [error]);

    useEffect(() => {
        Authorization({
            formName: "signup",
            rules: [
                Authorization.isRequired(
                    "#email",
                    "Vui lòng nhập email của bạn!"
                ),
                Authorization.isEmail(
                    "#email",
                    "Địa chỉ email không chính xác"
                ),
                Authorization.isRequired("#password"),
                Authorization.minLength(
                    "#password",
                    5,
                    "Minximum of password is 5 charactors test"
                ),
                Authorization.isRequired("#verify"),
                Authorization.compare("#verify", function () {
                    return document.querySelector("#password").value;
                }),
            ],
        });
    }, []);
    const handleLoginForm = async (e) => {
        e.preventDefault();

        const enSub = Authorization.handleSubmit();
        console.log(enSub);
        if (!enSub) {
            const { email, password } = signForm;

            const data = await dispatch(userRegister({ email, password }));

            if (data && data.success) {
                alert("Vui lòng xác thực email!!");
                window.location.href = "/login";
            }
        }
    };

    // const RemoveItem = (i) => {
    //     const newMsg = msg.filter((item, index) => {
    //         return index !== i;
    //     });
    //     setMsg([...newMsg]);
    // };

    return (
        <>
            <div className="app-main">
                {/* <div className="msg-wrap">
                    <MemoErrorForm msg={msg} removeItem={RemoveItem} />
                </div> */}
                <img
                    src={bkg}
                    alt="background"
                    width="1200px"
                    className="app-bkg"
                />
                <div className="grid wide app-container">
                    <div className="app-signup l-o-7 m-o-4">
                        <form
                            name="signup"
                            action="#"
                            method="POST"
                            onSubmit={handleLoginForm}
                        >
                            <h1 className="app-title">
                                Sign Up{" "}
                                <Link to="/login" className="or-login small">
                                    or login
                                </Link>
                            </h1>
                            <div className="sign-other-way">
                                <div className="btn btn-danger flex-fill">
                                    <i className="fab fa-google-plus me-2"></i>
                                    Google+
                                </div>
                                <div className="btn btn-primary flex-fill">
                                    <i className="fab fa-facebook me-2"></i>{" "}
                                    Facebook
                                </div>
                            </div>
                            <div className="input-wrap mb-2">
                                <label className="form-lable" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    name="email"
                                    type="text"
                                    className="form-input form-control"
                                    id="email"
                                    placeholder="Nhập email"
                                    value={email}
                                    onChange={onInputChange}
                                />
                                <span className="email-err form-err"></span>
                            </div>

                            <div className="input-wrap mb-2">
                                <label
                                    className="form-lable"
                                    htmlFor="password"
                                >
                                    Nhập mật khẩu
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    className="form-input form-control"
                                    id="password"
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={onInputChange}
                                />
                                <span className="password-err form-err"></span>
                            </div>

                            <div className="input-wrap mb-2">
                                <label className="form-lable" htmlFor="verify">
                                    Nhập lại mật khẩu
                                </label>
                                <input
                                    name="verify"
                                    type="password"
                                    className="form-input form-control"
                                    id="verify"
                                    placeholder="Nhập mật khẩu"
                                    value={verify}
                                    onChange={onInputChange}
                                />
                                <span className="verify-err form-err"></span>
                            </div>
                            <button className="btn btn-primary w-100 mt-3 mb-3">
                                Đăng Ký
                            </button>
                            {error && (
                                <span className="text-danger">
                                    <i className="fas fa-exclamation-triangle text-danger"></i>
                                    <span className="ms-2">{error}</span>
                                </span>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;
