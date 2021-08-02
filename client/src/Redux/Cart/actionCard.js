import {
    ALL_CART_REQUEST,
    ALL_CART_SUCCESS,
    ALL_CART_FAIL,
    POST_CART,
    POST_CART_SUCCESS,
    ADD_TO_CART,
    DELETE_FROM_CART,
    ORDER_POST_REQUEST,
    ORDER_GET_REQUEST,
    ORDER_REQUEST_SUCCESS,
    ORDER_GET_SUCCESS,
    ORDER_REQUEST_FAIL,
} from "./typeCart";
import axios from "axios";

export const GetOrder = () => async (dispatch) => {
    dispatch({ type: ORDER_GET_REQUEST });
    const { data } = await axios.get(`/user/order`).catch((err) =>
        dispatch({
            type: ORDER_REQUEST_FAIL,
            payload: {
                error: err.response
                    ? err.response.data.message
                    : "update your order is fail!!",
            },
        })
    );
    if (data && data.success) {
        dispatch({
            type: ORDER_GET_SUCCESS,
            payload: {
                orders: data.orders,
            },
        });
    }
};
export const OrderPost = (dataForm) => async (dispatch) => {
    dispatch({ type: ORDER_POST_REQUEST });
    const { data } = await axios.post(`/user/order`, dataForm).catch((err) =>
        dispatch({
            type: ORDER_REQUEST_FAIL,
            payload: {
                error: err.response
                    ? err.response.data.message
                    : "update your order is fail!!",
            },
        })
    );

    if (data && data.success)
        dispatch({
            type: ORDER_REQUEST_SUCCESS,
            payload: {
                orders: data.user.orders,
            },
        });

    return data ? data.success : false;
};
export const AllCartRequest = () => async (dispatch) => {
    try {
        dispatch({
            type: ALL_CART_REQUEST,
        });
        const { data } = await axios.get(`/api/cart`);
        // console.log(data);
        dispatch({
            type: ALL_CART_SUCCESS,
            payload: {
                cart: data.cart,
            },
        });
    } catch (err) {
        dispatch({
            type: ALL_CART_FAIL,
            payload: {
                error: err.response.data.msg || "Get all cart is fail",
            },
        });
    }
};
export const postCart = (cartState) => async (dispatch) => {
    try {
        dispatch({
            type: POST_CART,
        });
        const { data } = await axios.post(`/api/cart/add`, cartState);
        dispatch({
            type: POST_CART_SUCCESS,
            payload: {
                cart: data.cart,
            },
        });
    } catch (err) {
        dispatch({
            type: ALL_CART_FAIL,
            payload: {
                error: err.response.data.msg || "Get all cart is fail",
            },
        });
    }
};
export const AddToCart = (pro, num) => async (dispatch, getState) => {
    const { _id } = pro;
    const state = getState();
    const { cart } = state.cartReducer;
    const isCheck = cart.some((item) => item._id === _id);

    if (isCheck) {
        alert("Sản phẩm đã có trong giỏ");
        return;
    } else {
        try {
            dispatch({
                type: ADD_TO_CART,
                payload: {
                    newItem: { num, ...pro },
                },
            });
            await axios.post(`/api/cart/add`, [{ ...pro, num }, ...cart]);
        } catch (err) {
            dispatch({
                type: ALL_CART_FAIL,
                payload: {
                    error: err.response.data.msg || "Post cart fail",
                },
            });
        }
    }

    // const { cart } = state.cartReducer;
};
export const SingleDeleteCart = (numId) => async (dispatch, getState) => {
    const state = getState();
    const { cart } = state.cartReducer;

    cart.forEach((item, index) => {
        if (item._id === numId) cart.splice(index, 1);
    });

    try {
        dispatch({
            type: POST_CART,
        });

        await axios.post(`/api/cart/add`, cart);

        dispatch({
            type: DELETE_FROM_CART,
            payload: {
                cart: cart,
            },
        });
    } catch (err) {
        dispatch({
            type: ALL_CART_FAIL,
            payload: {
                error: err.response.data.msg || "Remove product fail",
            },
        });
    }
};
