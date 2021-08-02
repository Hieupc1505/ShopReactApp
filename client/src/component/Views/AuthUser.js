import React from "react";
import { Switch, Route } from "react-router-dom";
import Auth from "../MainPages/Auth/Auth";

const AuthUser = () => {
    return (
        <Switch>
            <Route
                exact
                path="/login"
                render={(props) => <Auth {...props} authRender="login" />}
            />
            <Route
                exact
                path="/signup"
                render={(props) => <Auth {...props} authRender="signup" />}
            />
        </Switch>
    );
};

export default AuthUser;
