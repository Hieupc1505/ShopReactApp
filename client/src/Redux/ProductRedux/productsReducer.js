import { ALL_PRODUCT_REQUEST } from "./typeProduct";
import { ALL_PRODUCT_SUCCESS } from "./typeProduct";
import { ALL_PRODUCT_FAIL } from "./typeProduct";
import { SINGLE_PRODUCT_SUCCESS } from "./typeProduct";
import { SINGLE_PRODUCT_FAIL } from "./typeProduct";
import { SINGLE_PRODUCT_REQUEST } from "./typeProduct";
import { CLEAR_ERROR } from "./typeProduct";
import { PAGE_SEARCH_SUCCESS } from "./typeProduct";
import { PAGE_SEARCH_REQUEST } from "./typeProduct";
import { CLIENT_REQUEST } from "./typeProduct";
import { CLIENT_REQUEST_END } from "./typeProduct";
import { REQUEST_FAIL } from "./typeProduct";
import { SORT_PRODUCTS } from "./typeProduct";

export const productsReducer = (
    state = { products: [], isLoad: true },
    action
) => {
    const { type, payload } = action;
    switch (type) {
        case ALL_PRODUCT_REQUEST:
        case PAGE_SEARCH_REQUEST:
            return {
                isLoad: true,
                products: [],
            };
        case CLIENT_REQUEST:
            return {
                ...state,
                isLoad: true,
            };
        case ALL_PRODUCT_SUCCESS:
        case SORT_PRODUCTS:
            return {
                isLoad: false,
                products: payload.pros,
            };

        case ALL_PRODUCT_FAIL:
        case REQUEST_FAIL:
            return {
                isLoad: false,
                error: payload,
            };
        case CLEAR_ERROR:
            return {
                ...state,
                error: null,
            };
        case PAGE_SEARCH_SUCCESS:
            return {
                ...state,
                isLoad: false,
                products: payload.pros,
            };
        case CLIENT_REQUEST_END:
            return {
                ...state,
                isLoad: false,
            };
        default:
            return state;
    }
};

export const productDetailReducer = (
    state = { product: {}, idLoad: true },
    action
) => {
    const { type, payload } = action;

    switch (type) {
        case SINGLE_PRODUCT_REQUEST:
            return {
                isLoad: true,
                product: {},
            };
        case SINGLE_PRODUCT_SUCCESS:
            return {
                isLoad: false,
                product: payload.pro,
            };
        case SINGLE_PRODUCT_FAIL:
            return {
                isLoad: false,
                error: payload,
            };
        default:
            return state;
    }
};
