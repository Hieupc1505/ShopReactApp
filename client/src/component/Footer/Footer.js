import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div className="footer mt-4">
            <div className="grid wide">
                <div className="row footer-contact">
                    <div className="footer-wrap col l-2-5">
                        <p className="contact-title">
                            <span className="contact-header fs-3 fw-bold d-block">
                                SuniEo
                            </span>
                            <small className="contact-title-text">
                                Niền tin tạo nên sức mạnh
                            </small>
                        </p>
                        <div className="contact-container">
                            <i
                                className="
                                        contact-container-icon
                                        fas
                                        fa-phone-volume
                                        
                                    "
                                style={{ fontSize: "60px" }}
                            ></i>
                            <div className="contact-container-wrap">
                                <span className="contact-help">
                                    Cần Giúp Đỡ
                                </span>
                                <span className="contact-num d-block fs-6 text-white">
                                    0345653456
                                </span>
                                <span className="contact-num d-block fs-6 text-white">
                                    0345653456
                                </span>
                            </div>
                        </div>
                    </div>
                    <ul className="footer-wrap col l-2-5">
                        <h2 className="footer-link-head fs-5">Về Shop</h2>
                        <li className="footer-wrap-list">
                            <Link to="#" className="footer-list-link">
                                Giới thiệu về shop
                            </Link>
                        </li>
                        <li className="footer-wrap-list">
                            <Link to="#" className="footer-list-link">
                                Tuyển Dụng
                            </Link>
                        </li>
                        <li className="footer-wrap-list">
                            <Link to="#" className="footer-list-link">
                                Chính sách bảo mật
                            </Link>
                        </li>
                        <li className="footer-wrap-list">
                            <Link to="#" className="footer-list-link">
                                Điều khoản sử dụng
                            </Link>
                        </li>
                        <li className="footer-wrap-list">
                            <Link to="#" className="footer-list-link">
                                Hướng dẫn mua hàng
                            </Link>
                        </li>
                    </ul>
                    <ul className="footer-wrap col l-2-5">
                        <h2 className="footer-link-head fs-5">Thông Tin</h2>
                        <li className="footer-wrap-list">
                            <Link to="#" className="footer-list-link">
                                Về chúng tôi
                            </Link>
                        </li>
                        <li className="footer-wrap-list">
                            <Link to="#" className="footer-list-link">
                                Thanh Toán
                            </Link>
                        </li>
                        <li className="footer-wrap-list">
                            <Link to="#" className="footer-list-link">
                                Hoàn trả hàng
                            </Link>
                        </li>
                        <li className="footer-wrap-list">
                            <Link to="#" className="footer-list-link">
                                Dịch vụ hỗ trợ
                            </Link>
                        </li>
                    </ul>
                    <div className="footer-connect col l-2-5">
                        <h2
                            className="
                                    footer-connect-title footer-link-head
                                    fs-5
                                "
                        >
                            Theo dõi chúng tôi
                        </h2>
                        <Link className="footer-connect-link" to="#">
                            <i className="fab fa-facebook"></i> Facebook
                        </Link>
                        <Link className="footer-connect-link" to="#">
                            <i className="fab fa-instagram"> Instagram</i>
                        </Link>
                        <Link className="footer-connect-link" to="#">
                            <i className="fab fa-linkedin"></i> Linked
                        </Link>
                    </div>
                    <div className="footer-app col l-2-5">
                        <h2 className="footer-link-head fs-5">Tải ứng dụng</h2>
                        <div className="footer-down">
                            <img
                                src="./public/img/qrcode.png"
                                width="50px"
                                alt=""
                                className="footer-qrcode"
                            />
                            <div className="footer-down-app">
                                <span className="down-app-google">
                                    <i className="fab fa-google-play"></i> CH
                                    Play
                                </span>
                                <span className="down-app-apple">
                                    <i className="fab fa-apple"></i> App Store
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
