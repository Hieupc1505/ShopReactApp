import "./Order.css";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetOrder } from "../../../Redux/Cart/actionCard";
import handleNumber from "../helpers/handleNum";
import imgOrderEmpty from "../../../public/img/order-empty.png";
import { v4 as uuid4 } from "uuid";

const Order = () => {
    const { orders, isLoad } = useSelector((state) => state.orderReducer);
    const dispatch = useDispatch();
    useEffect(
        () =>
            (async () => {
                dispatch(GetOrder());
            })(),
        []
    );

    return (
        <div className="grid wide">
            <div className="order-status d-flex justify-content-between mx-auto w-50 my-3 p-2 position-relative">
                <div className="order-status-item text-center ">
                    <i className="fas fa-store position-relative">
                        <span className="num-order-status postion-absolute badge">
                            {orders.length}
                        </span>
                    </i>
                    <p>Đang xử lý</p>
                </div>
                <div className="order-status-item text-center ">
                    <i className="fas fa-shipping-fast position-relative">
                        <span className="num-order-status postion-absolute badge">
                            0
                        </span>
                    </i>
                    <p>Đang giao</p>
                </div>
                <div className="order-status-item text-center ">
                    <i className="fas fa-store position-relative">
                        <span className="num-order-status postion-absolute badge">
                            0
                        </span>
                    </i>
                    <p>Đã nhận</p>
                </div>
            </div>
            <div className="search-order position-relative">
                <i className="fas fa-search position-absolute top-50 translate-middle-y px-2 text-secondary"></i>
                <input
                    className="form-control form-control-search-order w-100 mt-2 mb-4 py-2"
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Tìm kiếm đơn hàng"
                />
            </div>
            {orders && orders.length !== 0 && (
                <ul className="list-status ps-0">
                    <li
                        className="
                        list-item-status list-item-status-title
                        d-flex
                        justify-content-between
                    "
                    >
                        <span className="px-2 list-item-stt">#</span>
                        <span className="flex-fill">Thông tin khách hàng</span>
                        <span className="l-1">Tổng tiền</span>
                        <span className="l-1">Trạng thái</span>
                        <span className="l-2">PT Thanh toán</span>
                        <span className="l-2">Thao tác</span>
                    </li>

                    {orders.map((item, index) => (
                        <li
                            className="list-item d-flex align-items-start"
                            key={uuid4()}
                        >
                            <div className="px-2 fw-bold list-item-stt">
                                #{index + 1}
                            </div>
                            <div className="flex-fill d-flex p-0">
                                <ul className="list-brand ps-0">
                                    <li className="list-brand-item">Name</li>
                                    <li className="list-brand-item">Địa chỉ</li>
                                    <li className="list-brand-item">SĐT</li>
                                    <li className="list-brand-item">
                                        Thời gian
                                    </li>
                                </ul>
                                <ul className="list-content">
                                    <li className="list-content-item">
                                        {item.userInfo.userName}
                                    </li>
                                    <li className="list-content-item">
                                        {item.userInfo.address.main}
                                    </li>
                                    <li className="list-content-item">
                                        {item.userInfo.number}
                                    </li>
                                    <li className="list-content-item">
                                        {item.time}
                                    </li>
                                </ul>
                            </div>
                            <div className="l-1">
                                <span>
                                    {handleNumber(item.total)}{" "}
                                    <span className="text-under">đ</span>
                                </span>
                            </div>
                            <div className="l-1">
                                <span className="bg-secondary list-item-handle text-white">
                                    Chờ xử lý
                                </span>
                            </div>
                            <div className="l-2">
                                {item.pay === 1 && (
                                    <span className="bg-success text-white list-item-handle">
                                        Online
                                    </span>
                                )}
                                {item.pay === 0 && (
                                    <span className="bg-primary text-white list-item-handle">
                                        Offline
                                    </span>
                                )}
                            </div>
                            <div className="l-2 d-flex">
                                <div className="btn btn-sm btn-outline-info">
                                    Chi tiết
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {!isLoad && orders.length === 0 && (
                <div className="order-empty d-flex justify-content-center flex-column align-items-center">
                    <img src={imgOrderEmpty} alt="" />
                    <span className="mt-2 text-secondary">
                        {" "}
                        Chưa có đơn hàng
                    </span>
                </div>
            )}
        </div>
    );
};

export default Order;
