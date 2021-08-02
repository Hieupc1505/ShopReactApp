import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_AUTH_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_VERIFY,
    USER_LOGOUT,
    USER_UPLOAD_PROFILE,
    CLEAR_ERROR,
    USER_UPDATE_PROFILE,
    USER_UPLOAD_REQUEST,
    USER_REQUEST,
    REQUEST_FAIL,
    USER_FORGET_SENDEMAIL,
    USER_FORGET_RESET,
} from "./typeAuth";

const userState = {
    isLoad: true,
    isAuth: false,
    user: null,
};

export const userAuth = (state = userState, action) => {
    const { type, payload } = action;

    switch (type) {
        case USER_LOGIN_REQUEST:
        case USER_UPLOAD_REQUEST:
            return {
                ...state,
                isLoad: true,
            };

        case USER_LOGIN_SUCCESS:
        case USER_FORGET_SENDEMAIL:
        case USER_FORGET_RESET:
            return {
                ...state,
                isLoad: false,
            };

        case USER_REGISTER_REQUEST:
            return {
                ...state,
                isLoad: true,
            };

        case USER_REGISTER_SUCCESS:
            return {
                isLoad: false,
                isAuth: false,
                user: null,
            };

        case USER_AUTH_FAIL:
            return {
                ...state,
                isLoad: false,
                error: payload.error.includes("jwt")
                    ? "Hành động đã quá hạn!!"
                    : payload.error,
            };
        case USER_VERIFY:
            return {
                isLoad: false,
                isAuth: payload.isAuth,
                user: payload.user,
            };
        case USER_LOGOUT:
            return {
                isLoad: false,
                isAuth: false,
                user: null,
            };
        case USER_UPLOAD_PROFILE:
            if (state.user.mark === 1) return state;
            return {
                ...state,
                isLoad: false,
                user: payload.user,
            };
        case CLEAR_ERROR:
            return {
                ...state,
                isLoad: false,
                error: null,
            };
        case USER_REQUEST:
            return {
                ...state,
                isLoad: true,
            };
        case USER_UPDATE_PROFILE:
            return {
                ...state,
                isLoad: false,
                user: payload.user,
            };
        case REQUEST_FAIL:
            return {
                ...state,
                isLoad: false,
            };
        default:
            return state;
    }
};
