import React, { useEffect, useLayoutEffect, useRef } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Container from "../Views/Container";
import Detail from "./DetailProduct/Detail";
import Cart from "./Cart/Cart";
import Loading from "./utils/Loading/Loading";
import Payment from "./PayMent/Payment";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import setHeaderDefault from "./helpers/SetHeader";
import { ACCESSTOKEN } from "./helpers/key";
// import { SERVER } from "./helpers/key";
import { USER_VERIFY, SET_REFRESH_TOKEN_ID } from "../../Redux/Auth/typeAuth";
import PageSearch from "./Search/PageSearch";
import { Redirect, useLocation } from "react-router-dom";
import Loading2 from "./utils/Loading/Loading2";
import Order from "../MainPages/Order/Order";
import ChatBox from "./utils/ChatBox/ChatBox";
import Test from "../Views/Test";

// axios.defaults.withCredentials = true;

const Page = ({ component }) => {
    const dispatch = useDispatch();
    const { user, isAuth, isLoad } = useSelector((state) => state.userAuth);
    const { pathname } = useLocation();

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
    const getRefreshToken = async () => {
        const token = localStorage["ACCESSTOKEN"];
        const res = await axios.get("/user/refresh_token", {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.data && res.data.success)
            localStorage.setItem("ACCESSTOKEN", res.data.accessToken);
        else {
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

    useEffect(() => {
        if (isAuth) {
            let ref = setInterval(getRefreshToken, 1 * 55 * 1000);
            dispatch({
                type: SET_REFRESH_TOKEN_ID,
                payload: {
                    ref,
                },
            });
        }
    }, [isAuth]);

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    // const param = useParams();
    // console.log(param);
    return (
        <div className="app">
            <Header />
            {component === "home" && <Container />}
            {component === "detail" && <Detail />}
            {(component === "cart" || component === "order") && isLoad && (
                <Loading2 mid={true} />
            )}
            {component === "cart" &&
                !isLoad &&
                (isAuth ? (
                    <Cart />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: "/products/cart" },
                        }}
                    />
                ))}
            {component === "loading" && <Loading />}
            {component === "payment" && <Payment />}
            {component === "search" && <PageSearch />}
            {component === "profile" &&
                !isLoad &&
                (isAuth ? <Test /> : <Redirect to="/" />)}
            {component === "order" &&
                !isLoad &&
                (isAuth ? (
                    <Order />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: "/orders/status" },
                        }}
                    />
                ))}
            {isAuth && <ChatBox />}
            <Footer />
        </div>
    );
};

export default Page;
