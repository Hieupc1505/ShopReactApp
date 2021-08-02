import React, { useEffect } from "react";

const Loading2 = ({ mid = false }) => {
    let style = mid
        ? { position: "relative", width: "100%", height: "60vh" }
        : {
              position: "fixed",
              top: "0",
              left: "0",
              bottom: "0",
              right: "0",
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: "5",
              borderRadius: "4px",
          };

    return (
        <div className="main" style={style}>
            <div className="loading2">
                <div className="load-item up"></div>
                <div className="load-item bottom"></div>
            </div>
        </div>
    );
};

export default Loading2;
