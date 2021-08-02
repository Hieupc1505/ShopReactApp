import { createStore, combineReducers, applyMiddleware } from "redux";
import {
    productsReducer,
    productDetailReducer,
} from "./ProductRedux/productsReducer";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { userAuth } from "./Auth/authReducer";
import { cartReduce } from "./Cart/cartReducer";
import { orderReducer } from "./Cart/cartReducer";

const reducer = combineReducers({
    products: productsReducer,
    productDetail: productDetailReducer,
    userAuth,
    cartReducer: cartReduce,
    orderReducer,
});

const initStateStore = {};

let middleware = [thunk];
export default createStore(
    reducer,
    initStateStore,
    composeWithDevTools(applyMiddleware(...middleware))
);
