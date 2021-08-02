import React, { useState, useEffect } from "react";
import axios from "axios";
import { SERVER } from "../../component/MainPages/helpers/key";

const GetProduct = async () => {
    try {
        const pros = await axios.get(`${SERVER}/api/products`);
        return pros;
    } catch (err) {
        alert("Internal SERVER not get");
    }
};

export default GetProduct;
