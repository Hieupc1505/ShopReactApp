import React from "react";
import imgNotFound from "../../../../public/img/404.png";
import imgServerError from "../../../../public/img/internal.png";
import { Link } from "react-router-dom";

const NotFound = ({ type = "500" }) => {
    let linkImg = type === "500" ? imgServerError : imgNotFound;
    const style =
        type === "500"
            ? {
                  position: "fixed",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  top: "0",
                  width: "100%",
              }
            : {
                  position: "fixed",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  top: "0",
                  background: "white",
              };
    const pageImg = {
        backgroundImage: `url('${linkImg}'`,
        width: "400px",
        height: "400px",
        backgroundPosition: "center",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        margin: "auto",
    };
    return (
        <div className="page_not_found" style={style}>
            <Link to="/">
                <div
                    className="btn btn-outline-primary position-absolute "
                    style={{
                        top: "18%",
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                >
                    Trở lại trang chủ
                </div>
            </Link>

            {type === "500" && (
                <img
                    src={imgServerError}
                    alt=""
                    style={{ width: "100%", height: "100%" }}
                />
            )}

            {type !== "500" && <div className="page-img" style={pageImg} />}
        </div>
    );
};

export default NotFound;
