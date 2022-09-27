import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Auth from "./component/MainPages/Auth/Auth";
import MainPage from "./component/MainPages/Page";
import PageNotFound from "./component/MainPages/utils/NotFound/NotFound";
import UpImage from "./component/MainPages/utils/UploadImg/UpImage";
import ProtectedRouteAdmin from "./component/ProtectdRouteAdmin/ProtectedRouteAdmin";
import Test from "./component/Views/Test";
// import ProtectedRoute from "./component/MainPages/utils/UploadImg/ProtectedRoute/ProtectedRoute";
// import Cart from "./component/MainPages/Cart/Cart";
// import ChatBox from "./component/MainPages/utils/ChatBox/ChatBox";
// import LoadingSvg from "./component/MainPages/utils/Loading/LoadSvg";

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/upload" component={UpImage} />
                <Route
                    path="/login"
                    render={(props) => <Auth {...props} authRender="login" />}
                />

                <Route
                    path="/signup"
                    render={(props) => <Auth {...props} authRender="signup" />}
                />
                <Route
                    path="/forget"
                    exect
                    render={(props) => <Auth {...props} authRender="forget" />}
                />

                <Route
                    path="/user/forget/account/:token"
                    exect
                    render={(props) => <Auth {...props} authRender="reset" />}
                />

                <Route
                    exact
                    path="/"
                    render={(props) => <MainPage {...props} component="home" />}
                />
                <Route
                    exact
                    path="/products/cart"
                    render={(props) => <MainPage {...props} component="cart" />}
                />
                <Route
                    exact
                    path="/product/:id"
                    render={(props) => (
                        <MainPage {...props} component="detail" />
                    )}
                />

                <Route
                    exact
                    path="/cart/payment"
                    render={(props) => (
                        <MainPage {...props} component={"payment"} />
                    )}
                />

                <Route
                    exact
                    path="/orders/status"
                    render={(props) => (
                        <MainPage {...props} component="order" />
                    )}
                />
                <Route
                    exact
                    path="/page/search"
                    render={(props) => (
                        <MainPage {...props} component={"search"} />
                    )}
                />

                <Route path="/test" exact component={Test} />

                <ProtectedRouteAdmin
                    exact
                    path="/admin/dashboard"
                    component={UpImage}
                />

                <Route
                    path="/add/profile"
                    exact
                    render={(props) => (
                        <MainPage {...props} component={"profile"} />
                    )}
                />

                <Route
                    path="*"
                    render={(props) => <PageNotFound {...props} type="404" />}
                />

                {/* <Route
                        path="/cart"
                        render={(props) => (
                            <AuthLogin {...props} componentView="cart" />
                        )}
                    />
                    <Route path="/product/:id" component={Detail} />
                    <Route path="/test" component={FormTest} /> */}
            </Switch>
        </Router>
    );
}

export default App;
