import React, { useEffect, useLayoutEffect } from "react";
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
import { USER_VERIFY } from "../../Redux/Auth/typeAuth";
import PageSearch from "./Search/PageSearch";
import { Redirect, useLocation } from "react-router-dom";
import Loading2 from "./utils/Loading/Loading2";
import Order from "../MainPages/Order/Order";

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

    useEffect(() => {
        loadUser();
    }, []);

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

            <Footer />
        </div>
    );
};

export default Page;
