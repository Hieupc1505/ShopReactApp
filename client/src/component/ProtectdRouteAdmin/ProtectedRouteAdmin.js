import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import axios from "axios";
import setHeaderDefault from "../MainPages/helpers/SetHeader";
import { ACCESSTOKEN } from "../../Redux/Auth/typeAuth";
import { USER_VERIFY } from "../../Redux/Auth/typeAuth";
import { useDispatch, useSelector } from "react-redux";

const ProtectedRouteAdmin = ({ component: Component, ...rest }) => {
    const { user, isAuth } = useSelector((state) => state.userAuth);

    const dispatch = useDispatch();

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
    }, [isAuth]);

    const role = user ? user.role : 0;
    return (
        <>
            {role === 0 && <h1>YOu are not Admin</h1>}
            {role === 1 && <Route {...rest} component={Component} />}
        </>
    );
    // if (user.role === 0) return <NotFound />;

    // return (
    //     <>
    //         <Route {...props} component={Component} />
    //     </>
    // );
};

export default ProtectedRouteAdmin;
