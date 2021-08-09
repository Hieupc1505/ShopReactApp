import axios from "axios";
import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    ALL_PRODUCT_FAIL,
    SINGLE_PRODUCT_REQUEST,
    SINGLE_PRODUCT_SUCCESS,
    SINGLE_PRODUCT_FAIL,
    CLEAR_ERROR,
    // SERVER,
    // PAGE_SEARCH_SUCCESS,
    PAGE_SEARCH_REQUEST,
    CLIENT_REQUEST,
    CLIENT_REQUEST_END,
    REQUEST_FAIL,
    SORT_PRODUCTS,
} from "./typeProduct";

// export const getProsByCateId = (categoryId) => async (dispatch) => {
//     dispatch({ type: CLIENT_REQUEST });
//     const { data } = await axios
//         .get(`/api/getpros/${categoryId}`)
//         .catch((err) =>
//             dispatch({
//                 type: REQUEST_FAIL,
//                 payload: {
//                     error: err.response.data.msg,
//                 },
//             })
//         );
//     dispatch({ type: CLIENT_REQUEST_END });
//     return data;
// };

export const sortPros = (sortType) => async (dispatch, getState) => {
    const state = getState();
    const { products } = state;
    switch (sortType) {
        case "prizeaz":
            dispatch({ type: CLIENT_REQUEST });
            products.sort((a, b) => (a.proPrize > b.proPrize ? 1 : -1));
            dispatch({
                type: SORT_PRODUCTS,
                payload: {
                    pros: products,
                },
            });
            break;

        default:
            dispatch({ type: "DEFAULT" });
    }
};

export const getCategory = () => async (dispatch) => {
    dispatch({ type: CLIENT_REQUEST });
    const { data } = await axios.get(`/api/categories`).catch((err) =>
        dispatch({
            type: REQUEST_FAIL,
            payload: {
                error: err.response.data.msg,
            },
        })
    );
    dispatch({ type: CLIENT_REQUEST_END });
    return data;
};

export const pageSearch = (query) => async (dispatch) => {
    try {
        dispatch({ type: PAGE_SEARCH_REQUEST });

        const { data } = await axios.get(`/api/page/search${query}&page=1`);
        dispatch({
            type: CLIENT_REQUEST_END,
        });
        return data;
    } catch (err) {
        dispatch({
            type: ALL_PRODUCT_FAIL,
            payload: {
                error: err.response.data.msg,
            },
        });
    }
};

export const searchProduct = (name) => async (dispatch) => {
    try {
        const { data } = await axios.get(`/api/products/search?q=${name}`);

        return data;
    } catch (err) {
        dispatch({
            type: ALL_PRODUCT_FAIL,
            payload: err.response.data.msg,
        });
    }
};
export const getAllProduct =
    (num = 12) =>
    async (dispatch) => {
        try {
            dispatch({
                type: ALL_PRODUCT_REQUEST,
            });
            const { data } = await axios.get(`/api/products?num=${num}`);
            dispatch({
                type: ALL_PRODUCT_SUCCESS,
                payload: {
                    pros: data.pros,
                },
            });
        } catch (err) {
            dispatch({
                type: ALL_PRODUCT_FAIL,
                payload: err.response
                    ? err.response.data.msg
                    : "Internal server error",
            });
        }
    };
export const getProductById = (id) => async (dispatch) => {
    try {
        dispatch({ type: SINGLE_PRODUCT_REQUEST });
        const { data } = await axios.get(`/api/products/${id}`);

        dispatch({
            type: SINGLE_PRODUCT_SUCCESS,
            payload: {
                isLoad: false,
                pro: data.pro,
            },
        });
    } catch (err) {
        console.log(err.response);
        dispatch({
            type: SINGLE_PRODUCT_FAIL,
            payload: err.response
                ? err.response.data.msg
                : "Opps! Have a error",
        });
    }
};
export const clearError = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERROR,
    });
};
export const getProductByCategoryAndNum =
    (num = 10, type = "saled") =>
    async (dispatch) => {
        const { data } = await axios
            .get(`/api/slide?type=${type}&num=${num}`)
            .catch((err) =>
                dispatch({
                    type: REQUEST_FAIL,
                    payload: {
                        error: err.response
                            ? err.response.data.msg
                            : "get product by number fail",
                    },
                })
            );
        return data;
    };
