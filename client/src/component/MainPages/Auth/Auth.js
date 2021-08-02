import React, { useEffect } from "react";
import Signup from "../Form/Signup.js";
import Login from "../Form/Login.js";
import { Redirect, useLocation } from "react-router-dom";
import Loading from "../utils/Loading/Loading2.js";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import setHeaderDefault from "../helpers/SetHeader.js";
import { ACCESSTOKEN } from "../../../Redux/Auth/typeAuth.js";
import { SERVER } from "../helpers/key.js";
import { USER_VERIFY } from "../../../Redux/Auth/typeAuth.js";
import ResetPass from "../Form/ResetPass";

const Auth = ({ authRender }) => {
    const { isLoad, isAuth } = useSelector((state) => state.userAuth);
    const dispatch = useDispatch();
    const location = useLocation();

    const loadUser = async () => {
        if (localStorage[ACCESSTOKEN]) {
            setHeaderDefault(localStorage[ACCESSTOKEN]);
        }

        try {
            const { data } = await axios.get(`/user/info`);

            if (data.success) {
                dispatch({
                    type: USER_VERIFY,
                    payload: {
                        isAuth: true,
                        user: data.user,
                    },
                });
            }
        } catch (err) {
            localStorage.removeItem(ACCESSTOKEN);
            setHeaderDefault(null);
            dispatch({
                type: USER_VERIFY, //
                payload: {
                    isAuth: false, //
                    user: null,
                },
            });
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    let body;

    // if (isLoad) body = <Loading />;
    if (isAuth) {
        if (location.state) return <Redirect to={`${location.state.from}`} />;
        return <Redirect to="/" />;
    } else
        body = (
            <>
                {authRender === "login" && <Login />}
                {authRender === "signup" && <Signup />}
                {authRender === "forget" && <ResetPass type="email" />}
                {authRender === "reset" && <ResetPass type="reset" />}
            </>
        );
    return <>{body}</>;
};

export default Auth;
