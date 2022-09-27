import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import bkg from "../../../public/img/background.png";
// import ErrorForm from "../Form/ErrorForm";
import Authorization from "../Auth/Authorization";
import { useDispatch, useSelector } from "react-redux";
import { userLogin, clearError } from "../../../Redux/Auth/authAction";

const Login = () => {
    const [loginState, setLoginState] = useState({
        email: "",
        password: "",
    });

    const formRef = React.createRef();
    const history = useHistory();
    const location = useLocation();
    console.log(location);
    // const { LoginForm } = useContext(userContext);
    const dispatch = useDispatch();
    const { error, isLoad } = useSelector((state) => state.userAuth);

    useEffect(() => {
        if (error) {
            setTimeout(() => dispatch(clearError()), 4000);
        }
    }, [error]);

    const { email, password } = loginState;

    const onChangeInputForm = (e) => {
        setLoginState({ ...loginState, [e.target.name]: e.target.value });
    };

    const onSumbmitFormLogin = async (e) => {
        e.preventDefault();
        let res;
        const enSub = Authorization.handleSubmit();
        if (!enSub) res = await dispatch(userLogin(loginState));
        // // const res = await LoginForm(loginState); //

        if (res && res.success) {
            if (location.state) return history.push(`${location.state.from}`);
            history.push("/");
        }

        // if (error) {
        //     alert(error);
        //     // setMsg([res.msg]); //
        // }

        // setTimeout(() => dispatch(clearError()), 5000);
    };

    useEffect(() => {
        Authorization({
            formName: "login",
            rules: [
                Authorization.isRequired(
                    "#email",
                    "Vui lòng nhập email của bạn!"
                ),
                Authorization.isEmail(
                    "#email",
                    "Địa chỉ email của bạn không đúng!!"
                ),
                Authorization.isRequired("#password"),
                Authorization.minLength(
                    "#password",
                    5,
                    "Minximum of password is 5 charactors"
                ),
            ],
        });
    }, []);
    // console.log(location.state);
    return (
        <>
            <div className="app-main">
                <img
                    src={bkg}
                    alt="background"
                    width="1200px"
                    className="app-bkg"
                />
                <div className="grid wide app-container">
                    <div className="app-signup l-o-7 m-o-4">
                        <form
                            name="login"
                            action="#"
                            method="POST"
                            onSubmit={onSumbmitFormLogin}
                            ref={formRef}
                        >
                            <h1 className="app-title">
                                Log In
                                <Link
                                    to="/signup"
                                    className="or-login small ms-2"
                                >
                                    <small>or Sign up</small>
                                </Link>
                            </h1>
                            <div className="sign-other-way">
                                <div className="btn btn-danger flex-grow-1">
                                    <i className="fab fa-google-plus"></i>
                                    &nbsp; Google+
                                </div>
                                <div className=" btn btn-primary flex-grow-1 border-top-right-none">
                                    <i className="fab fa-facebook"></i>
                                    &nbsp;Facebook
                                </div>
                            </div>
                            <div className="input-wrap">
                                <label className="form-lable" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    type="text"
                                    name="email"
                                    className="form-input form-control"
                                    id="email"
                                    placeholder="Nhập email"
                                    value={email}
                                    onChange={onChangeInputForm}
                                />

                                <span className="email-err form-err"></span>
                            </div>

                            <div className="input-wrap mt-2">
                                <label
                                    className="form-lable"
                                    htmlFor="password"
                                >
                                    Nhập mật khẩu
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-input form-control"
                                    id="password"
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={onChangeInputForm}
                                />
                                <span className="password-err form-err"></span>
                            </div>
                            <button className="btn btn-primary d-block w-100 mt-3">
                                Đăng Nhập
                            </button>
                            <div className="plugin-login">
                                <div className="remember-account">
                                    <input type="checkbox" id="check" />
                                    <label
                                        htmlFor="check"
                                        className="form-label ms-2"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <Link to="/forget" className="forgot-pass">
                                    Forget password??
                                </Link>
                            </div>
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

export default Login;
