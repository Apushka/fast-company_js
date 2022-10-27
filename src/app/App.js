import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./components/ui/navBar";
import Login from "./layouts/login";
import Users from "./layouts/users";
import Main from "./layouts/main";
import AuthProvider from "./hooks/useAuth";
import ProtectedRoute from "./components/common/protectedRoute";
import LogOut from "./layouts/logout";
import AppLoader from "./hoc/appLoader";

function App() {
    return (
        <div>
            <AppLoader>
                <AuthProvider>
                    <NavBar />
                    <Switch>
                        <ProtectedRoute
                            path="/users/:userId?/:edit?"
                            component={Users}
                        />
                        <Route path="/login/:type?" component={Login} />
                        <Route path="/logout" component={LogOut} />
                        <Route exact path="/" component={Main} />
                        <Redirect to="/" />
                    </Switch>
                </AuthProvider>
            </AppLoader>
            <ToastContainer />
        </div>
    );
}

export default App;
