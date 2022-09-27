const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        createProxyMiddleware(
            ["/api/**", "/user/**", "/order/**", "/service/**"],
            {
                target: "http://localhost:5000",
                changeOrigin: true,
                secure: false,
            }
        )
    );
    app.use(
        createProxyMiddleware(["/chat/**"], {
            target: " https://serverchat69.herokuapp.com",
            changeOrigin: true,
        })
    );
};

// https://serverchat69.herokuapp.com
