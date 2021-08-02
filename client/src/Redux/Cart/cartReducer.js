import {
    ALL_CART_REQUEST,
    ALL_CART_SUCCESS,
    ALL_CART_FAIL,
    POST_CART,
    POST_CART_SUCCESS,
    ADD_TO_CART,
    ORDER_POST_REQUEST,
    ORDER_GET_REQUEST,
    ORDER_REQUEST_SUCCESS,
    ORDER_GET_SUCCESS,
    DELETE_FROM_CART,
    ORDER_REQUEST_FAIL,
} from "./typeCart";

export const orderReducer = (state = { orders: [], isLoad: true }, action) => {
    const { type, payload } = action;
    switch (type) {
        case ORDER_POST_REQUEST:
        case ORDER_GET_REQUEST:
            return {
                ...state,
                isLoad: true,
            };
        case ORDER_GET_SUCCESS:
            return {
                ...state,
                isLoad: false,
                orders: payload.orders,
            };
        case ORDER_REQUEST_SUCCESS:
            return {
                isLoad: false,
                orders: payload.orders,
            };
        case ORDER_REQUEST_FAIL:
            return {
                ...state,
                isLoad: false,
                error: payload.error,
            };
        default:
            return state;
    }
};

export const cartReduce = (state = { cart: [], isLoad: true }, action) => {
    const { type, payload } = action;

    switch (type) {
        case DELETE_FROM_CART:
            return {
                ...state,
                isLoad: false,
                cart: payload.cart,
            };
        case POST_CART:
            return {
                ...state,
                isLoad: true,
            };
        case POST_CART_SUCCESS:
            return {
                isLoad: false,
                cart: payload.cart,
            };
        case ALL_CART_REQUEST:
            return {
                ...state,
                isLoad: true,
            };
        case ALL_CART_SUCCESS:
            return {
                isLoad: false,
                cart: payload.cart,
            };
        case ALL_CART_FAIL:
            return {
                ...state,
                isLoad: false,
                error: payload.error,
            };
        case ADD_TO_CART:
            return {
                ...state,
                cart: [...state.cart, payload.newItem],
            };
        default:
            return state;
    }
};
