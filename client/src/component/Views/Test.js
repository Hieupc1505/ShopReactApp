import React from "react";
import { Link } from "react-router-dom";

const Test = () => {
    let style = {
        height: "20px",
    };
    return (
        <div className="grid wide">
            <div className="row">
                <div className="col l-3">
                    <Link to={`#`} className="text-decoration-none">
                        <div className="list-produce-item">
                            <div className="produce-item-img "></div>
                            <div
                                className="produce-item-name mt-2"
                                style={style}
                            ></div>
                            <div
                                className="
                        produce-item-rate
                        w-50
                    
                        my-2
                    "
                                style={style}
                            ></div>
                            <div
                                className="produce-item-prize mb-2"
                                style={style}
                            ></div>
                        </div>
                    </Link>
                </div>
                <div className="col l-3">
                    <Link to={`#`} className="text-decoration-none">
                        <div className="list-produce-item">
                            <div className="produce-item-img "></div>
                            <div
                                className="produce-item-name mt-2"
                                style={style}
                            ></div>
                            <div
                                className="
                        produce-item-rate
                        w-50
                    
                        my-2 
                    "
                                style={style}
                            ></div>
                            <div
                                className="produce-item-prize mb-2"
                                style={style}
                            ></div>
                        </div>
                    </Link>
                </div>
                <div className="col l-3">
                    <Link to={`#`} className="text-decoration-none">
                        <div className="list-produce-item">
                            <div className="produce-item-img "></div>
                            <div
                                className="produce-item-name mt-2"
                                style={style}
                            ></div>
                            <div
                                className="
                        produce-item-rate
                        w-50
                    
                        my-2 
                    "
                                style={style}
                            ></div>
                            <div
                                className="produce-item-prize mb-2"
                                style={style}
                            ></div>
                        </div>
                    </Link>
                </div>
                <div className="col l-3">
                    <Link to={`#`} className="text-decoration-none">
                        <div className="list-produce-item">
                            <div className="produce-item-img "></div>
                            <div
                                className="produce-item-name mt-2"
                                style={style}
                            ></div>
                            <div
                                className="
                        produce-item-rate
                        w-50
                    
                        my-2 
                    "
                                style={style}
                            ></div>
                            <div
                                className="produce-item-prize mb-2"
                                style={style}
                            ></div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Test;
