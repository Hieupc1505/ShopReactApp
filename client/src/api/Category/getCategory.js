import React from "react";
import axios from "axios";
import { SERVER } from "../../component/MainPages/helpers/key";

const getCategory = async () => {
    try {
        const response = await axios.get(`${SERVER}/api/categories`);
        if (response.data.success) {
            return response.data;
        }
    } catch (err) {
        return (
            err.response.data || {
                success: false,
                msg: "Internal Server Error",
            }
        );
    }
};

export default getCategory;
